import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableCard from "../reusable/ReusableCard";
import ReusableTable from "../reusable/ReusableTable";
import ReusableToast from "../reusable/ReusableToast";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableSelect from "../reusable/ReusableSelect";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

/**
 * FreightVsAdvance
 * - Handles search, filter, and export for Freight vs Advance report.
 * - Uses React Query for all API/data logic (select options, search, export).
 * - UI is built with reusable components for maintainability and consistency.
 */
function FreightVsAdvance() {
  ModuleRegistry.registerModules([AllCommunityModule]);
  const { register, handleSubmit, control } = useForm();
  // Removed unused searchedData state
  const [rowData, setRowData] = useState([]);
  // Removed unused noDataFound state
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // Removed unused inputValues state
  const [loading, setLoading] = useState(false);
  const [isExportComplete, setIsExportComplete] = useState(false);
  const [excelBlob, setExcelBlob] = useState(null);
  // Removed unused pageSize state

  // Select options via React Query
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

  // Search API mutation
  const searchMutation = useApiMutation({
    key: "searchFreightVsAdvance",
    url: "/api/v1/search/frieght-vs-advance",
    method: "post",
    onSuccess: (response) => {
      if (!response) {
        setRowData([]);
      } else {
        setRowData(response);
      }
    },
    onError: () => {
      // Error handling for search
    },
  });

  // Excel export API mutation
  const exportMutation = useApiMutation({
    key: "exportFreightVsAdvance",
    url: "/api/v1/find-daily-report-for-excel",
    method: "post",
    onSuccess: (response) => {
      setProgress(70);
      exportDataToExcel(response);
    },
    onError: () => {
      setLoading(false);
    },
  });

  // Submit handler
  const onSubmit = async (data) => {
    // Removed setInputValues (unused)
    setFormData({
      consignor: data.consignor || null,
      consignee: data.consignee || null,
      billTo: data.billTo || null,
      loadingPointId: data.loadingPoint || null,
      destinationId: data.destination || null,
      startDate: data.loadingFromDate
        ? format(data.loadingFromDate, "yyyy-MM-dd")
        : null,
      endDate: data.loadingToDate
        ? format(data.loadingToDate, "yyyy-MM-dd")
        : null,
      permitNo: data.permitNo || null,
    });
    searchMutation.mutate({
      consignor: data.consignor || null,
      consignee: data.consignee || null,
      billTo: data.billTo || null,
      loadingPointId: data.loadingPoint || null,
      destinationId: data.destination || null,
      startDate: data.loadingFromDate
        ? format(data.loadingFromDate, "yyyy-MM-dd")
        : null,
      endDate: data.loadingToDate
        ? format(data.loadingToDate, "yyyy-MM-dd")
        : null,
      permitNo: data.permitNo || null,
    });
  };

  // Excel export handler
  const handleExportClick = () => {
    if (!formData) return;
    setShowModal(true);
    setLoading(true);
    setProgress(30);
    exportMutation.mutate(formData);
  };

  // Format header keys from camelCase to Title Case
  const formatHeader = (header) => {
    return header
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  // Export data to Excel
  const exportDataToExcel = async (allData) => {
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
    await Promise.resolve();
    setExcelBlob(blob);
    setIsExportComplete(true);
    setLoading(false);
  };

  // Download Excel file
  const handleDownload = () => {
    if (!excelBlob) return;
    saveAs(excelBlob, "FreightVsAdvance.xlsx");
    setShowModal(false);
    setIsExportComplete(false);
  };

  // Cancel modal
  const handleCancel = () => {
    setShowModal(false);
    setLoading(false);
    setIsExportComplete(false);
  };

  // Table columns
  const columnDefs = [
    {
      headerName: "Sl No",
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      width: 100,
    },
    {
      headerName: "Challan No.",
      field: "challanNumber",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Challan Date",
      field: "challanDate",
      sortable: true,
      filter: true,
    },
    {
      headerName: "TP Number",
      field: "tpNumber",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Truck Number",
      field: "truckNumber",
      sortable: true,
      filter: true,
    },
    { headerName: "Load Qty", field: "loadWeight", sortable: true },
    { headerName: "Rate", field: "vehicleRate", sortable: true },
    { headerName: "Freight", field: "freight", sortable: true },
    { headerName: "Cash Adv.", field: "cashAdvance", sortable: true },
    { headerName: "Bank Adv.", field: "bankAdvance", sortable: true },
    { headerName: "HSD Adv.", field: "hsdAdvance", sortable: true },
    { headerName: "Total Adv.", field: "totalAdvance", sortable: true },
    { headerName: "Balance", field: "balance", sortable: true },
    { headerName: "Status", field: "challanStatus", sortable: true },
    { headerName: "Truck Owner Name", field: "truckOwner", sortable: true },
    { headerName: "PAN", field: "truckOwnerPanNumber", sortable: true },
    {
      headerName: "Contact No",
      field: "truckOwnerContactNumber",
      sortable: true,
    },
    {
      headerName: "Bank Account Number",
      field: "accountNumber",
      sortable: true,
    },
    { headerName: "IFSC", field: "ifscCode", sortable: true },
    {
      headerName: "Consignor",
      field: "consignorName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Consignee",
      field: "exporterName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Billing Party",
      field: "traderName",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Loading Point",
      field: "loadingPoint",
      sortable: true,
      filter: true,
    },
    {
      headerName: "Unloading Point",
      field: "unloadingPoint",
      sortable: true,
      filter: true,
    },
  ];

  return (
    <div className="work-space-container">
      <ReusableCard>
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-2"
          role="alert"
        >
          <span className="mb-0 h6">Freight Vs Advance</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="billingParty">Consignor</label>
              <ReusableSelect
                {...register("consignor")}
                options={[{ id: "", name: "Select All" }, ...consignorOptions]}
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt.id}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="billingParty">Consignee</label>
              <ReusableSelect
                {...register("consignee")}
                options={[{ id: "", name: "Select All" }, ...consigneeOptions]}
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt.id}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="billingParty">Bill To</label>
              <ReusableSelect
                {...register("billTo")}
                options={[{ id: "", name: "Select All" }, ...billToOptions]}
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt.id}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="loadingPoint">Loading</label>
              <ReusableSelect
                {...register("loadingPoint")}
                options={[
                  { id: "", name: "Select All" },
                  ...loadingPointOptions,
                ]}
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt.id}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="destinationPoint">Unloading</label>
              <ReusableSelect
                {...register("destination")}
                options={[
                  { id: "", name: "Select All" },
                  ...destinationOptions,
                ]}
                getOptionLabel={(opt) => opt.name}
                getOptionValue={(opt) => opt.id}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="permitNo">Permit No.</label>
              <ReusableInput
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="permitNo"
                {...register("permitNo")}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="reportDate">Loading Date</label>
              <div className="d-flex flex-row justify-content-center">
                <Controller
                  control={control}
                  name="loadingFromDate"
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
                  name="loadingToDate"
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
        </form>
      </ReusableCard>
      <hr />
      <div className="mx-auto mt-2">
        <ReusableCard>
          <div
            className="ag-theme-alpine"
            style={{ height: "500px", width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              domLayout="autoHeight"
              suppressClipboardApi={true}
            />
          </div>
        </ReusableCard>
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
                variant="secondary"
                size="sm"
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
              <ReusableButton variant="secondary" onClick={handleCancel}>
                Cancel
              </ReusableButton>
              <ReusableButton
                variant="success"
                onClick={handleDownload}
                disabled={!isExportComplete}
              >
                Download
              </ReusableButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreightVsAdvance;
