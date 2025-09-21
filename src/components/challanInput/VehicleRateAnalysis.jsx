import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// Reusable components
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableCard from "../reusable/ReusableCard";
import ReusableTable from "../reusable/ReusableTable";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableSection from "../reusable/ReusableSection";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableToast from "../reusable/ReusableToast";
import ReusableDatePicker from "../reusable/ReusableDatePicker";
import PaginationComponent from "../customComponents/PaginationComponent";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";

function VehicleRateAnalysis() {
  const { register, handleSubmit, control } = useForm();
  const [searchedData, setSearchedData] = useState([]);

  // Removed duplicate state declarations for select options; now handled by React Query

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

  // Fetch select options using React Query
  const { data: consignorOptions = [] } = useApiQuery({
    key: "consignorOptions",
    url: "/api/v1/get/all/trader-billing-party-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });
  const { data: consigneeOptions = [] } = useApiQuery({
    key: "consigneeOptions",
    url: "/api/v1/get/all/trader-billing-party-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });
  const { data: billToOptions = [] } = useApiQuery({
    key: "billToOptions",
    url: "/api/v1/get/all/trader-billing-party-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });
  const { data: loadingPointOptions = [] } = useApiQuery({
    key: "loadingPointOptions",
    url: "/api/v1/get/all/loading-point-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });
  const { data: destinationOptions = [] } = useApiQuery({
    key: "destinationOptions",
    url: "/api/v1/get/all/unloading-point-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });

  // React Query mutation for paginated search
  const searchMutation = useApiMutation({
    key: "findDailyReport",
    url: "/api/v1/find-daily-report",
    method: "post",
    onSuccess: (response, variables) => {
      setSearchedData(response.content);
      setTotalNumberOfData(response.totalElements);
      setTotalPages(response.totalPages);
      setCurrentPage(variables.page);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Prepare and trigger paginated search
  function postFilteredData(data, page) {
    const searchedData = {
      consignor: data.consignor ? data.consignor : null,
      consignee: data.consignee ? data.consignee : null,
      billTo: data.billTo ? data.billTo : null,
      loadingPointId: data.loadingPoint ? data.loadingPoint : null,
      destinationId: data.destination ? data.destination : null,
      startDate: data.loadingFromDate
        ? format(data.loadingFromDate, "yyyy-MM-dd")
        : null,
      endDate: data.loadingToDate
        ? format(data.loadingToDate, "yyyy-MM-dd")
        : null,
      page: page,
      size: pageSize,
    };
    setFormData(searchedData);
    searchMutation.mutate(searchedData);
  }

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
  // ---  excel  --------------------------------------------------

  // React Query mutation for Excel export
  const excelExportMutation = useApiMutation({
    key: "findDailyReportForExcel",
    url: "/api/v1/find-daily-report-for-excel",
    method: "post",
    onSuccess: (response) => {
      setProgress(70);
      exportDataToExcel(response);
      setProgress(100);
    },
    onError: (error) => {
      setLoading(false);
      console.log(error);
    },
  });

  // Function to fetch all data in a single API call and export
  const fetchData = async () => {
    setLoading(true);
    setProgress(0);
    setIsExportComplete(false);
    if (!formData) return;
    setProgress(30);
    excelExportMutation.mutate(formData);
  };

  // Function to format header keys from camelCase to "Title Case"
  const formatHeader = (header) => {
    return header
      .replace(/([A-Z])/g, " $1") // Insert space before uppercase letters
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
    XLSX.utils.sheet_add_aoa(worksheet, [["Your Company Name"]], {
      origin: "A1",
    }); // Company name at A1
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Fetched Date: " + new Date().toLocaleDateString()]],
      { origin: "A2" }
    ); // Fetched date at A2

    // Step 3: Add formatted headers starting from row 4 (index 3) to leave space for custom rows
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A3" }); // Data headers at row 4

    // Step 4: Insert data starting from row 5 (index 4), after headers
    XLSX.utils.sheet_add_json(worksheet, allData, {
      origin: "A4",
      skipHeader: true,
    }); // Data starts from row 5

    // Merge the cells for titles (company name and date)

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
    ];

    // Step 6: Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Step 7: Generate the Excel file and create a blob
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
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
  // --------- excel end --------------------------------------------------
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
      <div
        className="alert alert-primary text-center font-weight-bold text-dark p-2"
        role="alert"
      >
        <span className="mb-0 h6">Vehicle Rate Analysis</span>
      </div>

      {/* Filter Form using reusable components */}
      <ReusableForm onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <ReusableSelect
            label="Consignor"
            options={[{ id: "", name: "Select All" }, ...consignorOptions]}
            {...register("consignor")}
            className="form-select form-select-sm border-dark-subtle col-md-2"
          />
          <ReusableSelect
            label="Consignee"
            options={[{ id: "", name: "Select All" }, ...consigneeOptions]}
            {...register("consignee")}
            className="form-select form-select-sm border-dark-subtle col-md-2"
          />
          <ReusableSelect
            label="Bill To"
            options={[{ id: "", name: "Select All" }, ...billToOptions]}
            {...register("billTo")}
            className="form-select form-select-sm border-dark-subtle col-md-2"
          />
          <ReusableSelect
            label="Loading"
            options={[{ id: "", name: "Select All" }, ...loadingPointOptions]}
            {...register("loadingPoint")}
            className="form-select form-select-sm border-dark-subtle col-md-3"
          />
          <ReusableSelect
            label="Unloading"
            options={[{ id: "", name: "Select All" }, ...destinationOptions]}
            {...register("destinationPoint")}
            className="form-select form-select-sm border-dark-subtle col-md-3"
          />
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="reportDate">Permit Date</label>
            <div className="d-flex flex-row justify-content-center">
              <Controller
                control={control}
                name="loadingFromDate"
                render={({ field }) => (
                  <ReusableDatePicker
                    {...field}
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="d-MMM-yyyy"
                    placeholder="Select a date"
                    className="date-picker-input w-100 pl-2"
                  />
                )}
              />
              <div className="mx-3">To</div>
              <Controller
                control={control}
                name="loadingToDate"
                render={({ field }) => (
                  <ReusableDatePicker
                    {...field}
                    selected={field.value}
                    onChange={field.onChange}
                    dateFormat="d-MMM-yyyy"
                    placeholder="Select a date"
                    className="date-picker-input w-100 pl-2"
                  />
                )}
              />
            </div>
          </div>
          <div className="pt-2">
            <ReusableButton
              type="submit"
              variant="primary"
              size="sm"
              className="mt-4 ml-4"
            >
              Proceed
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="primary"
              size="sm"
              className="mt-4 ml-4"
              onClick={handleExportClick}
            >
              Excel
            </ReusableButton>
          </div>
        </div>
      </ReusableForm>

      <div className="mx-auto mt-2">
        <div className="container mt-5">
          <div>
            <h6>
              {" "}
              <span>Total Records : </span>
              <span>{totalNumberOfData ? totalNumberOfData : 0}</span>
            </h6>
          </div>
          <hr />
          <div className="table-responsive">
            <ReusableTable
              columns={[
                { Header: "S.L No", accessor: "slNo" },
                { Header: "Consignor", accessor: "consignor" },
                { Header: "Consignee", accessor: "consignee" },
                { Header: "Biling Party", accessor: "billTo" },
                { Header: "Loading Point", accessor: "loadingPoint" },
                { Header: "Unloading Point", accessor: "destination" },
                {
                  Header: "Permit Date",
                  accessor: "permitDate",
                  Cell: ({ value }) =>
                    value ? format(value, "dd-MMM-yyyy") : "",
                },
                { Header: "Permit Number", accessor: "permitNumber" },
                { Header: "Freight Rate", accessor: "freightRate" },
                { Header: "Payment Rate", accessor: "paymentRate" },
                { Header: "Despatch Challan", accessor: "despatchChallan" },
              ]}
              data={
                searchedData
                  ? searchedData.map((item, idx) => ({
                      ...item,
                      slNo: idx + 1,
                    }))
                  : []
              }
              className="table-bordered table-hover"
            />
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
            style={{ width: "auto" }} // Adjust width to make it smaller
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>

        <div className="mt-2">
          {/* Render the pagination component */}
          <PaginationComponent
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Modal */}
        <div
          className={`modal ${showModal ? "d-block" : "d-none"}`}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-top-center">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Exporting Data</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancel}
                ></button>
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

export default VehicleRateAnalysis;
