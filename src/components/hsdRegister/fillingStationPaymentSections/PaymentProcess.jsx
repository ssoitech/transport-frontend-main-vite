import React, { useState } from "react";
import { useApiQuery, useApiMutation } from "../../../hooks/api/useApiQuery";
import ReusableForm from "../../reusable/ReusableForm";
import ReusableInput from "../../reusable/ReusableInput";
import ReusableButton from "../../reusable/ReusableButton";
import ReusableSelect from "../../reusable/ReusableSelect";
import ReusableDatePicker from "../../reusable/ReusableDatePicker";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableLoader from "../../reusable/ReusableLoader";
import ReusableToast from "../../reusable/ReusableToast";
import ReusableTable from "../../reusable/ReusableTable";
import * as XLSX from "xlsx";

/**
 * PaymentProcess - Refactored to use reusable components and React Query
 * - All form, input, select, button, datepicker, card, loader, toast, and table elements use reusable components
 * - API logic will be migrated to useApiQuery/useApiMutation (React Query)
 * - Business logic preserved
 * - Detailed comments added
 */
function PaymentProcess() {
  // State for form fields, payment info, edit mode, and toast
  const [form, setForm] = useState({
    petrolPump: "",
    voucherNo: "",
    paymentDate: "",
    amountPaid: "",
    paymentMode: "",
    bankNameId: "",
    chequeNo: "",
    chequeDate: "",
    receivedBy: "",
    paidBy: "",
    paymentNote: "",
  });
  const [paymentInfo, setPaymentInfo] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Fetch petrol pump options using React Query
  const {
    data: fillingStationsData,
    isLoading: isFillingStationsLoading,
    error: fillingStationsError,
  } = useApiQuery({
    key: "filling-stations",
    url: "/api/v1/get/filling-stations",
    method: "get",
    select: (data) =>
      Array.isArray(data)
        ? data.map((element) => ({ value: element[0], label: element[1] }))
        : [],
  });

  // Fetch bank options using React Query
  const {
    data: bankOptions,
    isLoading: isBankLoading,
    error: bankError,
  } = useApiQuery({
    key: "bank-names",
    url: "/api/v1/get/all/bank-ids-names",
    method: "get",
    select: (data) =>
      Array.isArray(data)
        ? data.map((element) => ({ value: element[0], label: element[1] }))
        : [],
  });

  // Handle input changes for form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit (placeholder for API mutation)
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Use useApiMutation for payment submission
    setToast({
      message: editMode
        ? "Payment updated (mock)."
        : "Payment submitted (mock).",
      type: "success",
    });
    setEditMode(false);
    setEditRowId(null);
    setForm({
      petrolPump: "",
      voucherNo: "",
      paymentDate: "",
      amountPaid: "",
      paymentMode: "",
      bankNameId: "",
      chequeNo: "",
      chequeDate: "",
      receivedBy: "",
      paidBy: "",
      paymentNote: "",
    });
  };

  // Edit row handler
  const handleEdit = (row) => {
    setEditMode(true);
    setEditRowId(row.id);
    setForm({
      petrolPump: row.petrolPump || "",
      voucherNo: row.voucherNumber || "",
      paymentDate: row.paymentDate || "",
      amountPaid: row.amountPaid || "",
      paymentMode: row.paymentMode || "",
      bankNameId: row.bankNameId || "",
      chequeNo: row.chequeNumber || "",
      chequeDate: row.chequeDate || "",
      receivedBy: row.receivedBy || "",
      paidBy: row.paidBy || "",
      paymentNote: row.paymentNote || "",
    });
  };

  // Delete row handler
  const handleDeleteRow = (rowId) => {
    setPaymentInfo((prev) => prev.filter((row) => row.id !== rowId));
    setToast({ message: "Payment deleted (mock).", type: "warning" });
    setEditMode(false);
    setEditRowId(null);
    setForm({
      petrolPump: "",
      voucherNo: "",
      paymentDate: "",
      amountPaid: "",
      paymentMode: "",
      bankNameId: "",
      chequeNo: "",
      chequeDate: "",
      receivedBy: "",
      paidBy: "",
      paymentNote: "",
    });
  };

  // Clear form handler
  const handleClear = () => {
    setEditMode(false);
    setEditRowId(null);
    setForm({
      petrolPump: "",
      voucherNo: "",
      paymentDate: "",
      amountPaid: "",
      paymentMode: "",
      bankNameId: "",
      chequeNo: "",
      chequeDate: "",
      receivedBy: "",
      paidBy: "",
      paymentNote: "",
    });
  };

  // Excel export handler (.xlsx)
  const handleExcel = () => {
    if (!paymentInfo || paymentInfo.length === 0) {
      setToast({ message: "No data to export!", type: "warning" });
      return;
    }
    // Prepare worksheet data
    const wsData = [
      ["SLNo", "Payment Date", "Paid Amount", "Mode", "Reference", "Status"],
      ...paymentInfo.map((row, idx) => [
        idx + 1,
        row.paymentDate,
        row.amountPaid,
        row.paymentMode,
        row.voucherNumber,
        "Paid",
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "PaymentProcess");
    XLSX.writeFile(wb, "hsd_payment_process.xlsx");
    setToast({ message: "Excel exported successfully!", type: "success" });
  };

  // Table columns for ReusableTable
  const columns = [
    { header: "SLNo", accessor: "slno" },
    { header: "Payment Date", accessor: "paymentDate" },
    { header: "Paid Amount", accessor: "amountPaid" },
    { header: "Mode", accessor: "paymentMode" },
    { header: "Reference", accessor: "voucherNumber" },
    { header: "Status", accessor: "status" },
    {
      header: "Action",
      accessor: "action",
      render: (row) => (
        <ReusableButton
          className="btn btn-sm btn-primary"
          onClick={() => handleEdit(row)}
        >
          Edit
        </ReusableButton>
      ),
    },
  ];

  // Prepare table data with SLNo and Status
  const tableRows = paymentInfo.map((row, idx) => ({
    ...row,
    slno: idx + 1,
    status: "Paid",
  }));

  // Loader and error handling for filling stations and banks
  if (isFillingStationsLoading || isBankLoading) {
    return <ReusableLoader text="Loading options..." />;
  }
  if (fillingStationsError || bankError) {
    return (
      <ReusableToast
        message={
          fillingStationsError?.message ||
          bankError?.message ||
          "Error loading options."
        }
        type="error"
        onClose={() => setToast({ message: "", type: "info" })}
      />
    );
  }

  return (
    <div className="container mt-3">
      <ReusableCard title={<span className="mb-0 h6">Payment Process</span>}>
        {toast.message && (
          <ReusableToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "info" })}
          />
        )}
        <ReusableForm onSubmit={handleSubmit} className="mb-3">
          <div className="row mb-3 align-items-end">
            <div className="col-md-4">
              <ReusableSelect
                label="Select Petrol Pump"
                name="petrolPump"
                value={form.petrolPump}
                onChange={handleFormChange}
                options={fillingStationsData || []}
                className="form-select form-select-sm"
              />
            </div>
            <div className="col-md-2">
              <ReusableButton
                className="btn btn-sm btn-primary w-50"
                type="button"
                onClick={() =>
                  setToast({ message: "Proceed (mock)", type: "info" })
                }
              >
                Proceed
              </ReusableButton>
            </div>
            <div className="col-md-2">
              <ReusableButton
                className="btn btn-sm btn-secondary w-50"
                type="button"
                onClick={handleClear}
              >
                Clear
              </ReusableButton>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <ReusableInput
                label="Total Bill Amount"
                name="totalBillAmount"
                value={form.totalBillAmount || ""}
                disabled
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
            <div className="col-md-4">
              <ReusableInput
                label="Total Paid Amount"
                name="totalPaidAmount"
                value={form.totalPaidAmount || ""}
                disabled
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
            <div className="col-md-4">
              <ReusableInput
                label="Balance Amount Due"
                name="balanceAmountDue"
                value={form.balanceAmountDue || ""}
                disabled
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
          </div>
          <div className="row">
            {/* Left Column: Payment Form */}
            <div className="col-md-4">
              <ReusableCard className="mb-3">
                <ReusableInput
                  label="Voucher No"
                  name="voucherNo"
                  value={form.voucherNo}
                  onChange={handleFormChange}
                  className="form-control form-control-sm"
                />
                <ReusableDatePicker
                  label="Payment Date"
                  name="paymentDate"
                  value={form.paymentDate}
                  onChange={handleFormChange}
                  className="form-control form-control-sm"
                />
                <ReusableInput
                  label="Amount Paid/Drawn"
                  name="amountPaid"
                  value={form.amountPaid}
                  onChange={handleFormChange}
                  type="number"
                  className="form-control form-control-sm"
                />
                <ReusableSelect
                  label="Payment Mode"
                  name="paymentMode"
                  value={form.paymentMode}
                  onChange={handleFormChange}
                  options={[
                    { value: "Bank", label: "Bank" },
                    { value: "Net", label: "Net" },
                    { value: "Cash", label: "Cash" },
                  ]}
                  className="form-select form-select-sm"
                />
                <ReusableSelect
                  label="Bank Name"
                  name="bankNameId"
                  value={form.bankNameId}
                  onChange={handleFormChange}
                  options={bankOptions || []}
                  className="form-select form-select-sm"
                />
                <ReusableInput
                  label="Cheque No."
                  name="chequeNo"
                  value={form.chequeNo}
                  onChange={handleFormChange}
                  className="form-control form-control-sm"
                />
                <ReusableDatePicker
                  label="Cheque Date"
                  name="chequeDate"
                  value={form.chequeDate}
                  onChange={handleFormChange}
                  className="form-control form-control-sm"
                />
                <ReusableInput
                  label="Received By"
                  name="receivedBy"
                  value={form.receivedBy}
                  onChange={handleFormChange}
                  className="form-control form-control-sm"
                />
                <ReusableInput
                  label="Paid By"
                  name="paidBy"
                  value={form.paidBy}
                  onChange={handleFormChange}
                  className="form-control form-control-sm"
                />
                <ReusableInput
                  label="Payment Note"
                  name="paymentNote"
                  value={form.paymentNote}
                  onChange={handleFormChange}
                  className="form-control form-control-sm"
                />
                <div className="d-flex gap-2 mt-2">
                  <ReusableButton
                    className={`btn btn-sm ${
                      editMode ? "btn-warning" : "btn-success"
                    }`}
                    type="submit"
                  >
                    {editMode ? "Update" : "Confirm"}
                  </ReusableButton>
                  <ReusableButton
                    className="btn btn-sm btn-danger"
                    type="button"
                    disabled={!editRowId}
                    onClick={() => handleDeleteRow(editRowId)}
                  >
                    Delete
                  </ReusableButton>
                  <ReusableButton
                    className="btn btn-sm btn-secondary"
                    type="button"
                    onClick={handleClear}
                  >
                    Clear
                  </ReusableButton>
                </div>
              </ReusableCard>
            </div>
            {/* Right Column: Previous Payment Details Table */}
            <div className="col-md-8">
              <ReusableCard className="mb-3">
                <h6 className="mb-3">Previous Payment Details</h6>
                <div
                  className="table-responsive"
                  style={{ maxHeight: 300, overflowY: "auto" }}
                >
                  <ReusableTable
                    columns={columns}
                    data={tableRows}
                    className="table table-bordered table-sm"
                    ariaLabel="Previous Payment Details Table"
                  />
                </div>
                <ReusableButton
                  className="btn btn-success btn-sm mt-3"
                  onClick={handleExcel}
                >
                  Export to Excel
                </ReusableButton>
              </ReusableCard>
            </div>
          </div>
        </ReusableForm>
      </ReusableCard>
    </div>
  );
}

export default PaymentProcess;
