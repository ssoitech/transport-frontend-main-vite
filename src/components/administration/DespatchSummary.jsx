import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableCard from "../../components/reusable/ReusableCard";
import ReusableTable from "../../components/reusable/ReusableTable";
import ReusableSelect from "../../components/reusable/ReusableSelect";
import ReusableButton from "../../components/reusable/ReusableButton";
import ReusableLoader from "../../components/reusable/ReusableLoader";
import PaginationComponent from "../customComponents/PaginationComponent";

/**
 * DespatchSummary - World-class, robust, maintainable summary component
 * - Uses reusable components for form, select, table, button, loader, and card
 * - API logic separated using generic React Query hooks (SOLID/DRY)
 * - No Redux or direct axios logic
 * - Detailed comments for major functionality
 */
function DespatchSummary() {
  const { register, handleSubmit, control } = useForm();
  // permitFromDate and permitToDate are managed by react-hook-form Controller
  const [formData, setFormData] = useState();
  const [inputValues, setInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const [excelBlob, setExcelBlob] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch select options using useApiQuery hooks
  const { data: billingOptions = [] } = useApiQuery({
    key: "billingOptions",
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

  // Fetch paginated report data using useApiMutation
  const { mutate: fetchReportData, data: reportData } = useApiMutation({
    key: "fetchReportData",
    url: "/api/v1/find-daily-report",
    method: "post",
    onSuccess: () => {
      setFormData(inputValues);
    },
  });

  // Fetch Excel data using useApiMutation
  const {
    mutate: fetchExcelData,
    // excelData is not used
  } = useApiMutation({
    key: "fetchExcelData",
    url: "/api/v1/find-daily-report-for-excel",
    method: "post",
    onSuccess: (response) => {
      exportDataToExcel(response);
    },
  });

  // Helper to build search payload
  const buildSearchPayload = (data, page) => ({
    traderId: data.billingParty || null,
    loadingPointId: data.loadingPoint || null,
    destinationId: data.destination || null,
    startDate: data.permitFromDate
      ? format(data.permitFromDate, "yyyy-MM-dd")
      : null,
    endDate: data.permitToDate ? format(data.permitToDate, "yyyy-MM-dd") : null,
    page,
    size: pageSize,
  });

  // Handle form submission
  const onSubmit = (data) => {
    setInputValues(data);
    const payload = buildSearchPayload(data, 0);
    fetchReportData(payload);
  };

  // Handle page change
  const handlePageChange = (page) => {
    const payload = buildSearchPayload(inputValues, page);
    fetchReportData(payload);
    setCurrentPage(page);
  };

  // Handler for changing page size
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    // Optionally re-fetch data with new page size
    // fetchReportData(buildSearchPayload(inputValues, 0));
  };

  // Function to fetch all data in a single API call for Excel
  const fetchData = () => {
    setLoading(true);
    setProgress(30);
    setIsExportComplete(false);
    if (!formData) return;
    fetchExcelData(formData);
    setProgress(100);
    setLoading(false);
  };

  // Function to format header keys from camelCase to "Title Case"
  const formatHeader = (header) => {
    return header
      .replace(/([A-Z])/g, " $1") // Insert space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim(); // Remove any leading or trailing spaces
  };

  // Function to export the data to Excel
  const exportDataToExcel = (allData) => {
    if (!allData || allData.length === 0) return;
    const rawHeaders = Object.keys(allData[0]);
    const headers = rawHeaders.map(formatHeader);
    const worksheet = XLSX.utils.json_to_sheet(allData, { header: rawHeaders });
    XLSX.utils.sheet_add_aoa(worksheet, [["Your Company Name"]], {
      origin: "A1",
    });
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [["Fetched Date: " + new Date().toLocaleDateString()]],
      { origin: "A2" }
    );
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A3" });
    XLSX.utils.sheet_add_json(worksheet, allData, {
      origin: "A4",
      skipHeader: true,
    });
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    setExcelBlob(blob);
    setIsExportComplete(true);
    setLoading(false);
  };

  // Handle export button click
  const handleExportClick = () => {
    if (!formData) return;
    setShowModal(true);
    fetchData();
  };

  // Handle download button click
  const handleDownload = () => {
    if (excelBlob) {
      saveAs(excelBlob, "daily_report.xlsx");
      setShowModal(false);
      setExcelBlob(null);
      setIsExportComplete(false);
      setProgress(0);
    }
  };

  // Handle modal close
  const handleCancel = () => {
    setShowModal(false);
    setProgress(0);
  };

  // Table columns for ReusableTable
  const columns = [
    { header: "S.L No", accessor: "slNo" },
    { header: "Billing Party Name", accessor: "billing_party_name" },
    { header: "Permit Number", accessor: "permit_number" },
    { header: "Loading Point Name", accessor: "loading_point_name" },
    { header: "Unloading Point Name", accessor: "unloading_point_name" },
    { header: "TP Count", accessor: "tp_count" },
    { header: "Weight Sum", accessor: "weight_sum" },
    { header: "Freight Amount", accessor: "freight_amount" },
    { header: "Cash Advance", accessor: "cash_advance" },
    { header: "Bank Advance", accessor: "bank_advance" },
    { header: "HSD Advance", accessor: "hsd_advance" },
  ];

  // Render row for ReusableTable
  const renderRow = (row, index) => (
    <tr key={index} className="p-1">
      <td className="text-center">{index + 1}</td>
      <td>{row.billing_party_name}</td>
      <td>{row.permit_number}</td>
      <td>{row.loading_point_name}</td>
      <td>{row.unloading_point_name}</td>
      <td className="text-center">{row.tp_count}</td>
      <td>{row.weight_sum ? parseFloat(row.weight_sum).toFixed(3) : 0.0}</td>
      <td>
        {row.freight_amount ? parseFloat(row.freight_amount).toFixed(2) : 0.0}
      </td>
      <td>
        {row.cash_advance ? parseFloat(row.cash_advance).toFixed(2) : 0.0}
      </td>
      <td>
        {row.bank_advance ? parseFloat(row.bank_advance).toFixed(2) : 0.0}
      </td>
      <td>{row.hsd_advance ? parseFloat(row.hsd_advance).toFixed(2) : 0.0}</td>
    </tr>
  );

  // Get paginated data for table
  const searchedData = reportData?.content || [];
  const totalNumberOfData = reportData?.totalElements || 0;
  const totalPages = reportData?.totalPages || 1;

  return (
    <div className="work-space-container">
      <ReusableCard title="Despatch summary">
        <ReusableForm onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="billingParty">Billing</label>
              <ReusableSelect
                name="billingParty"
                options={[
                  { value: "", label: "Select All" },
                  ...billingOptions.map((option) => ({
                    value: option.id,
                    label: option.name,
                  })),
                ]}
                {...register("billingParty")}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="loadingPoint">Loading Point</label>
              <ReusableSelect
                name="loadingPoint"
                options={[
                  { value: "", label: "Select All Points/Plots" },
                  ...loadingPointOptions.map((option) => ({
                    value: option.id,
                    label: option.name,
                  })),
                ]}
                {...register("loadingPoint")}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="destination">Destination</label>
              <ReusableSelect
                name="destination"
                options={[
                  { value: "", label: "Select All Points/Plots" },
                  ...destinationOptions.map((option) => ({
                    value: option.id,
                    label: option.name,
                  })),
                ]}
                {...register("destination")}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="reportDate">Despatch Date</label>
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
              <ReusableButton
                type="submit"
                className="btn btn-sm btn-primary mt-4 ml-4"
              >
                Proceed
              </ReusableButton>
              <ReusableButton
                type="button"
                className="btn btn-sm btn-primary mt-4 ml-4"
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
                <span>Total Records : </span>
                <span>{totalNumberOfData}</span>
              </h6>
            </div>
            <hr />
            <div className="table-responsive">
              <ReusableTable
                columns={columns}
                data={searchedData}
                renderRow={renderRow}
                className="table table-bordered table-hover"
                ariaLabel="Despatch Summary Table"
              />
            </div>
          </div>
          {/* Page size dropdown */}
          <div className="d-flex justify-content-end mb-3">
            <label htmlFor="pageSize" className="form-label me-2 my-auto">
              Records per page:
            </label>
            <ReusableSelect
              name="pageSize"
              options={[
                { value: 10, label: "10" },
                { value: 25, label: "25" },
                { value: 50, label: "50" },
                { value: 100, label: "100" },
                { value: 200, label: "200" },
              ]}
              value={pageSize}
              onChange={handlePageSizeChange}
              className="form-select form-select-sm"
              style={{ width: "auto" }}
            />
          </div>
          <div className="mt-2">
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
                  <ReusableButton
                    type="button"
                    className="btn-close"
                    onClick={handleCancel}
                  />
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
                  <ReusableButton
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    Cancel
                  </ReusableButton>
                  <ReusableButton
                    className="btn btn-success"
                    onClick={handleDownload}
                    disabled={!isExportComplete}
                  >
                    Download
                  </ReusableButton>
                </div>
              </div>
            </div>
          </div>
          {/* modal end */}
        </div>
      </ReusableCard>
    </div>
  );
}

export default DespatchSummary;
