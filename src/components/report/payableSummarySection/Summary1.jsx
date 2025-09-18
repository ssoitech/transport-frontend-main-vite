import React, { useState } from 'react'
import axiosInstance from '../../../config/AxiosConfig';
import { format } from 'date-fns';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast, Toaster } from 'react-hot-toast';
import PaginationComponent from '../../customComponents/PaginationComponent';
import DynamicTable from '../../customComponents/DynamicTable';


// needs to be changed
function Summary1({ billingParty, loadingPoint, destination, permitFromDate, permitToDate }) {
  const [searchedData, setSearchedData] = useState([]);
  const [searchedDataChallanWise, setSearchedDataChallanWise] = useState([]);
  const [searchedDataPermitWise, setSearchedDataPermitWise] = useState([]);

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
  const [buttonType, setButtonType] = useState("");

  const [dateWiseLoading, setDateWiseLoading] = useState(false);

  const headerMappingDateWise = { loadDate: "Challan Date", tpCount: "Total Challan", weightSum: "Total Quantity", freightSum: "Total Freight", cashAdvance: "Cash Advance", bankAdvance: "Bank Advance", hsdAdvance: "HSD Advance", officeExpSum: "Office Exp.", otherDeductionSum: "Other Ded.", totalDeductionSum: "Total Ded.", netPaybleSum: "Total Payble" };
  const headerMappingPermitWise = { loadDate: "Challan Date", permitNumber: "Permit Number", tpCount: "Total Challan", weightSum: "Total Quantity", freightSum: "Total Freight", cashAdvance: "Cash Advance", bankAdvance: "Bank Advance", hsdAdvance: "HSD Advance", officeExpSum: "Office Exp.", otherDeductionSum: "Other Ded.", totalDeductionSum: "Total Ded.", netPaybleSum: "Total Payble" };
  const headerMappingChallanWise = { loadDate: "Challan Date", challanNumber: "Challan Number", tpCount: "Total Challan", weightSum: "Total Quantity", freightSum: "Total Freight", cashAdvance: "Cash Advance", bankAdvance: "Bank Advance", hsdAdvance: "HSD Advance", officeExpSum: "Office Exp.", otherDeductionSum: "Other Ded.", totalDeductionSum: "Total Ded.", netPaybleSum: "Total Payble" };


  async function getDataByPagenumber(url, fData, page) {
    await axiosInstance.post(url,
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

  async function postFilteredData(url, page) {

    const searchedData = {
      "loadDateStart": permitFromDate ? format(permitFromDate, 'yyyy-MM-dd') : null,
      "loadDateEnd": permitToDate ? format(permitToDate, 'yyyy-MM-dd') : null,
      "loadingPointId": loadingPoint ? loadingPoint : null,
      "destinationId": destination ? destination : null,
      "traderId": billingParty ? billingParty : null,
      "page": page,
      "size": pageSize,
    }

    setInputValues(searchedData);
    getDataByPagenumber(url, searchedData, page);
  }


  // Function to handle the 'Get' button click
  const handleGetClick = async (type) => {
    console.log(type);
    setDateWiseLoading(true);
    setButtonType(type);
    try {

      if (type === "D") {
        await postFilteredData('/api/vi/report/challan-in-market', 0);
        setDateWiseLoading(false);
      } else if (type === "P") {
        await postFilteredData('/api/vi/report/challan-in-market/permit-wise', 0);
        setDateWiseLoading(false);
      } else if (type === "C") {
        await postFilteredData('/api/vi/report/challan-in-market/challan-wise', 0);
        setDateWiseLoading(false);
      }

    } catch (error) {
      setDateWiseLoading(false);
      console.error('Error fetching data:', error);
    }
  };


  // Handle page change
  const handlePageChange = async (page) => {

    if (buttonType === "D") {
      await postFilteredData('/api/vi/report/challan-in-market', page);

    } else if (buttonType === "P") {
      await postFilteredData('/api/vi/report/challan-in-market/permit-wise', page);

    } else if (buttonType === "C") {
      await postFilteredData('/api/vi/report/challan-in-market/challan-wise', page);
    }

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
      const randomProgress = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
      setProgress(randomProgress);

      // Fetch all data in one API call
      const searchedData = {
        "loadDateStart": permitFromDate ? format(permitFromDate, 'yyyy-MM-dd') : null,
        "loadDateEnd": permitToDate ? format(permitToDate, 'yyyy-MM-dd') : null,
        "loadingPointId": loadingPoint ? loadingPoint : null,
        "destinationId": destination ? destination : null,
        "traderId": billingParty ? billingParty : null,
      }

      var url = "";

      if (buttonType === "D") {
        url = '/api/vi/report/challan-in-market-for-excel';

      } else if (buttonType === "P") {
        url = '/api/vi/report/challan-in-market/permit-wise-for-excel';

      } else if (buttonType === "C") {
        url = '/api/vi/report/challan-in-market/challan-wise-for-excel';

      }

      await axiosInstance.post(url,
        searchedData
      )
        .then(function (response) {
          // handle success
          // Simulate more progress
          const randomProgress = Math.floor(Math.random() * (99 - 60 + 1)) + 60;
          setProgress(randomProgress);
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
    if (!inputValues) {
      return;
    }
    setShowModal(true); // Open modal
    fetchData(); // Start fetching data and exporting
  };

  // Function to handle the download button click
  const handleDownload = () => {
    if (excelBlob) {
      saveAs(excelBlob, "challan_in_market.xlsx");
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
  const handleClear = () => {
    window.location.reload();
  }
  return (
    <div>

      <div className="container mt-4">
        <div className="row align-items-center">
          {/* Buttons */}
          <div className="col-sm-2 mb-2">
            <button className="btn btn-sm btn-primary w-100" onClick={() => handleGetClick("P")}>Permit Wise</button>
          </div>
          {/* <div className="col-sm-2 mb-2">
            
            <button type="button" className="btn btn-sm btn-primary w-100" disabled={dateWiseLoading} onClick={() => handleGetClick("D")}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Fetching...
                </>
              ) : (
                'Date-Wise'
              )}
            </button>
          </div> */}
          {/* <div className="col-sm-2 mb-2">
            <button className="btn btn-sm btn-primary w-100" onClick={() => handleGetClick("C")}>Challan Wise</button>
          </div> */}
          <div className="col-sm-2 mb-2">
            <button className="btn btn-sm btn-success w-100" onClick={handleExportClick}>Excel</button>
          </div>
          <div className="col-sm-2 mb-2">
            <button className="btn btn-sm btn-outline-primary w-100" onClick={handleClear}>Clear</button>
          </div>
        </div>
        <div className="row align-items-center mt-4">
          {/* Input fields */}
          <div className="col-sm-2 mb-2">
            <input
              type="text"
              className="form-control form-control-sm bg-dark"
            />
          </div>
          <div className="col-sm-2 mb-2">
            <input
              type="text"
              className="form-control form-control-sm bg-danger text-white"

            />
          </div>
          <div className="col-sm-2 mb-2">
            <input
              type="text"
              className="form-control form-control-sm"

            />
          </div>
          <div className="col-sm-4 mb-2">
            <input
              type="text"
              className="form-control form-control-sm bg-dark"

            />
          </div>
        </div>
        <div>
          <h6> <span>Total Records : </span><span>{totalNumberOfData ? totalNumberOfData : 0}</span></h6>
        </div>
        <hr />

        <div className="table-responsive">

          {
            searchedData ? buttonType === 'D' && <DynamicTable data={searchedData} headerMapping={headerMappingDateWise} /> : ""
          }
          {
            searchedData ? buttonType === 'P' && <DynamicTable data={searchedData} headerMapping={headerMappingPermitWise} /> : ""
          }
          {
            searchedData ? buttonType === 'C' && <DynamicTable data={searchedData} headerMapping={headerMappingChallanWise} /> : ""
          }
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
        <Toaster
          position="bottom-center"
          reverseOrder={true}
        />



      </div>

    </div>
  )
}

export default Summary1

