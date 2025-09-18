import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "../../config/AxiosConfig";
import PaginationComponent from "../customComponents/PaginationComponent";

// needs to be changed
function DayWiseUnLoadingSummary() {
  const { register, handleSubmit, setValue, control } = useForm();
  const [searchedData, setSearchedData] = useState([]);
  const [billingOptions, setBillingOptions] = useState([]);
  const [loadingPointOptions, setLoadingPointOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [permitFromDate, setPermitFromDate] = useState(null);
  const [permitToDate, setPermitToDate] = useState(null);
  const [tableData, setTableData] = useState([]);

  const [formData, setFormData] = useState();
  const [totalNumberOfData, setTotalNumberOfData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValues, setInputValues] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const [excelBlob, setExcelBlob] = useState(null); // Store Excel file

  const [pageSize, setPageSize] = useState(10); // Default page size is 10

  // Load options for select boxes on component mount
  useEffect(() => {

    const fetchSelectOptions = async () => {
      try {
        const billingPartyRes = await axiosInstance.get("/api/v1/get/all/trader-billing-party-names");
        const billingPartyArrayOfObjects = billingPartyRes.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setBillingOptions(billingPartyArrayOfObjects);

        const loadingPointRes = await axiosInstance.get("/api/v1/get/all/loading-point-names");
        const loadingPointResArrayOfObjects = loadingPointRes.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setLoadingPointOptions(loadingPointResArrayOfObjects);
        const destinationRes = await axiosInstance.get("/api/v1/get/all/unloading-point-names");

        const destinationResArrayOfObjects = destinationRes.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setDestinationOptions(destinationResArrayOfObjects);

      } catch (error) {
        console.error("Error loading options:", error);
      }
    };

    fetchSelectOptions();
  }, []);


  async function getDataByPagenumber(fData, page) {
    await axiosInstance.post('/api/v1/find-daily-report',
      fData
    )
      .then(function (response) {
        // handle success
        console.log(response.data);
        // console.log(response.data.totalPages);
        setSearchedData(response.data.content);
        setTotalNumberOfData(response.data.totalElements);
        setTotalPages(response.data.totalPages); // Set the total pages
        setCurrentPage(page); // Set the current page

      })
      .catch(function (error) {
        // handle error
        console.log(error.response);

      });
  }


  async function postFilteredData(data, page) {

    const searchedData = {
      "traderId": data.billingParty ? data.billingParty : null,
      "loadingPointId": data.loadingPoint ? data.loadingPoint : null,
      "destinationId": data.destination ? data.destination : null,
      "startDate": data.permitFromDate ? format(data.permitFromDate, 'yyyy-MM-dd') : null,
      "endDate": data.permitToDate ? format(data.permitToDate, 'yyyy-MM-dd') : null,
      "page": page,
      "size": pageSize,
    }

    setFormData(searchedData);

    getDataByPagenumber(searchedData, page);
  }


  // Handle form submission
  const onSubmit = async (data) => {
    try {

      setInputValues(data); // Store the input values for pagination
      await postFilteredData(data, 0);

    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };


  // Handle page change
  const handlePageChange = (page) => {
    postFilteredData(inputValues, page); // Fetch data for the selected page
  };

  // Handler for changing page size
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    // postFilteredData(inputValues, 0); // Re-fetch data with new page size, starting from page 0
  };




  // Function to fetch all data in a single API call
  const fetchData = async () => {
    setLoading(true);
    setProgress(0);
    setIsExportComplete(false); // Reset state for new export

    try {
      // Simulate progress (just for user experience)
      setProgress(30);

      // set the conditions
      if (!formData) {

        return;
      }

      // Fetch all data in one API call

      await axiosInstance.post('/api/v1/find-daily-report-for-excel',
        formData
      )
        .then(function (response) {
          // handle success
          // Simulate more progress
          setProgress(70);
          // Once data is fetched, export to Excel
          exportDataToExcel(response.data);

        })
        .catch(function (error) {
          // handle error
          console.log(error.response);

        });

      setProgress(100); // Set progress to 100% when done
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };


  // Function to format header keys from camelCase to "Title Case"
  const formatHeader = (header) => {
    return header
      .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim(); // Remove any leading or trailing spaces
  };

  // Function to export the data to Excel
  const exportDataToExcel = async (allData) => {
    if (allData.length === 0) return;

    const rawHeaders = Object.keys(allData[0]);
    const headers = rawHeaders.map(formatHeader); // Convert 'truckNumber' to 'Truck Number'

    // Step 1: Create a worksheet with the data
    const worksheet = XLSX.utils.json_to_sheet(allData, { header: rawHeaders });

    // Step 2: Add company name and fetched date at the top of the sheet, ensuring it does not overwrite data
    XLSX.utils.sheet_add_aoa(worksheet, [["Your Company Name"]], { origin: "A1" }); // Company name at A1
    XLSX.utils.sheet_add_aoa(worksheet, [["Fetched Date: " + new Date().toLocaleDateString()]], { origin: "A2" }); // Fetched date at A2

    // Step 3: Add formatted headers starting from row 4 (index 3) to leave space for custom rows
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A3" }); // Data headers at row 4

    // Step 4: Insert data starting from row 5 (index 4), after headers
    XLSX.utils.sheet_add_json(worksheet, allData, { origin: "A4", skipHeader: true }); // Data starts from row 5


    // Merge the cells for titles (company name and date)

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
    ];


    // Step 6: Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Step 7: Generate the Excel file and create a blob
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Use Promise.resolve to ensure state updates are batched
    await Promise.resolve();

    // Step 8: Set the blob for download and mark the export as complete
    setExcelBlob(blob);
    setIsExportComplete(true);
    setLoading(false); // Stop loading after Excel generation 

  };

  const handleExportClick = () => {
    if (!formData) {
      return;
    }
    setShowModal(true); // Open modal
    fetchData(); // Start fetching data and exporting
  };

  // Function to handle the download button click
  const handleDownload = () => {
    if (excelBlob) {
      saveAs(excelBlob, "daily_report.xlsx");
      setShowModal(false); // Close modal after download
      setExcelBlob(null); // Clear blob to free up memory
      setIsExportComplete(false); // Reset export state if needed
      setProgress(0); // Reset progress if needed
    }
  };

  // Function to handle modal close
  const handleCancel = () => {
    setShowModal(false);
    setProgress(0); // Reset progress when closed
  };


  return (
    <div className="work-space-container">
      <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
        <span className="mb-0 h6">Day Wise Loading Summary</span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          {/* <div className="form-group col-md-2">
                        <label htmlFor="billingParty">Billing Party</label>
                        <select
                            {...register("billingParty")}
                            className="form-select form-select-sm border-dark-subtle"
                        >
                            <option value="">Select All</option>
                            {billingOptions.map((option) => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </select>
                    </div> */}

          {/* <div className="form-group col-md-2">
            <label htmlFor="loadingPoint">Loading Point</label>
            <select
              {...register("loadingPoint")}
              className="form-select form-select-sm border-dark-subtle"
            >
              <option value="">Select All Points/Plots</option>
              {loadingPointOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div> */}

          <div className="form-group col-md-2">
            <label htmlFor="destination">Destination</label>
            <select
              {...register("destination")}
              className="form-select form-select-sm border-dark-subtle"
            >
              <option value="">Select All Points/Plots</option>
              {destinationOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="reportDate">Date</label>
            <div className="d-flex flex-row justify-content-center">
              <Controller
                control={control}
                name="permitFromDate"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="d-MMM-yyyy"
                    placeholderText="Select a date"
                    className="date-picker-input w-100 pl-2"
                  />
                )}
              />
              <div className="mx-3">To</div>
              <Controller
                control={control}
                name="permitToDate"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="d-MMM-yyyy"
                    placeholderText="Select a date"
                    className="date-picker-input w-100 pl-2"
                  />
                )}
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="btn btn-sm btn-primary mt-4 ml-4">
              Proceed
            </button>
            <button type="button" className="btn btn-sm btn-primary mt-4 ml-4" onClick={handleExportClick}>
              Excel
            </button>
          </div>
        </div>
      </form>

      <div className="mx-auto mt-2">

        <div className="container mt-5">
          <div>
            <h6> <span>Total Records : </span><span>{totalNumberOfData ? totalNumberOfData : 0}</span></h6>
          </div>
          <hr />
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="thead-dark">
                <tr className="p-1 text-center">
                  <th>S.L No</th>
                  <th>Permit Number</th>
                  <th>Un-Loading Point Name</th>
                  <th>TP Count</th>
                  <th>Weight Sum</th>
                  <th>Freight Amount</th>
                  <th>Cash Advance</th>
                  <th>Bank Advance</th>
                  <th>HSD Advance</th>
                  <th>Billing Party Name</th>
                </tr>
              </thead>
              <tbody>
                {searchedData.length > 0 && searchedData.map((item, index) => (
                  <tr key={index} className="p-1">
                    <td className="text-center">{index + 1}</td>
                    <td>{item.permit_number}</td>
                    <td>{item.unloading_point_name}</td>
                    <td className="text-center">{item.tp_count}</td>
                    <td>{item.weight_sum ? parseFloat(item.weight_sum).toFixed(3) : 0.000}</td>
                    <td>{item.freight_amount ? parseFloat(item.freight_amount).toFixed(2) : 0.00}</td>
                    <td>{item.cash_advance ? parseFloat(item.cash_advance).toFixed(2) : 0.00}</td>
                    <td>{item.bank_advance ? parseFloat(item.bank_advance).toFixed(2) : 0.00}</td>
                    <td>{item.hsd_advance ? parseFloat(item.hsd_advance).toFixed(2) : 0.00}</td>
                    <td>{item.billing_party_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Page size dropdown */}
        <div className="d-flex justify-content-end mb-3">
          <label htmlFor="pageSize" className="form-label me-2 my-auto">
            Records per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="form-select form-select-sm"
            style={{ width: 'auto' }} // Adjust width to make it smaller
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>

        <div className='mt-2'>
          {/* Render the pagination component */}
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />

        </div>

        {/* Modal */}
        <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-top-center">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Exporting Data</h5>
                <button type="button" className="btn-close" onClick={handleCancel}></button>
              </div>
              <div className="modal-body">
                {loading ? (
                  <>
                    <p>Exporting data... Please wait.</p>
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated"
                        role="progressbar"
                        style={{ width: `${progress}%` }}
                      >
                        {progress}%
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {isExportComplete ? (
                      <p>Data exported successfully!</p>
                    ) : (
                      <p>Preparing to export...</p>
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleDownload}
                  disabled={!isExportComplete}
                >
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* modal end */}

      </div>
    </div>
  );
}

export default DayWiseUnLoadingSummary;


