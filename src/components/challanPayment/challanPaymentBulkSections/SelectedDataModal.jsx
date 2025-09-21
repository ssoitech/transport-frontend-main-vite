import React, { useEffect, useRef, useState } from "react";
// Reusable components
import ReusableButton from "../../reusable/ReusableButton";
import ReusableInput from "../../reusable/ReusableInput";
import ReusableSelect from "../../reusable/ReusableSelect";
import ReusableTable from "../../reusable/ReusableTable";
import ReusableToast from "../../reusable/ReusableToast";
import { useApiQuery, useApiMutation } from "../../../hooks/api/useApiQuery.js";

const SelectedDataModal = ({
  show,
  handleClose,
  selectedData,
  // Removed unused props: onConfirm, onPrevious
}) => {
  const modalRef = useRef();
  const modalInstance = useRef();
  const [bankNames, setBankNames] = useState([]);
  const [form, setForm] = useState({
    through: "",
    bankName: "",
    chequeNo: "",
    chequeDate: "",
    paymentRefNo: "",
    beneficiary: "",
    challans: "",
    beneficiaryTotal: "",
  });

  // Fetch bank names using React Query
  const { data: bankNamesData = [] } = useApiQuery({
    key: "bankNames",
    url: "/api/banks",
    method: "get",
    select: (data) => data,
    enabled: show,
  });
  useEffect(() => {
    if (show) setBankNames(bankNamesData);
  }, [show, bankNamesData]);

  // Bootstrap modal show/hide
  useEffect(() => {
    if (show) {
      // Create and show modal
      modalInstance.current = new window.bootstrap.Modal(modalRef.current, {
        backdrop: "static",
      });
      modalInstance.current.show();

      // Listen for modal close (from ESC or backdrop)
      const modalNode = modalRef.current;
      modalNode.addEventListener("hidden.bs.modal", handleClose);
      return () => {
        modalNode.removeEventListener("hidden.bs.modal", handleClose);
      };
    } else if (modalInstance.current) {
      // Hide modal if show is false
      modalInstance.current.hide();
    }
  }, [show, handleClose]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Excel export
  const handleExcel = () => {
    // Simple CSV export for demonstration
    if (!selectedData.length) return;
    const header = Object.keys(selectedData[0]).join(",");
    const rows = selectedData.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "selected_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle close button click
  const handleCloseClick = () => {
    if (modalInstance.current) {
      modalInstance.current.hide();
    }
  };

  // Confirm mutation using React Query
  const confirmMutation = useApiMutation({
    key: "submitSelectedData",
    url: "/api/submit",
    method: "post",
    onSuccess: () => {
      handleClose();
    },
  });
  const handleConfirm = () => {
    const payload = { ...form, tableData: selectedData };
    confirmMutation.mutate(payload);
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Selected Data</h5>
            <ReusableButton
              type="button"
              variant="outline-dark"
              className="btn-close"
              aria-label="Close"
              onClick={handleCloseClick}
            />
          </div>
          <div className="modal-body">
            {/* Input Form using reusable components */}
            <form className="row g-3 mb-3">
              <div className="col-md-2">
                <ReusableSelect
                  label="Through"
                  name="through"
                  value={form.through}
                  onChange={handleChange}
                  options={[
                    { id: "", name: "Select" },
                    { id: "Cheque", name: "Cheque" },
                    { id: "Online", name: "Online" },
                  ]}
                  className="form-select"
                />
              </div>
              <div className="col-md-2">
                <ReusableSelect
                  label="Bank Name"
                  name="bankName"
                  value={form.bankName}
                  onChange={handleChange}
                  options={[
                    { id: "", name: "Select" },
                    ...bankNames.map((b) => ({
                      id: b.name || b,
                      name: b.name || b,
                    })),
                  ]}
                  className="form-select"
                />
              </div>
              <div className="col-md-2">
                <ReusableInput
                  label="Check No"
                  type="text"
                  name="chequeNo"
                  value={form.chequeNo}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <ReusableInput
                  label="Check Date"
                  type="date"
                  name="chequeDate"
                  value={form.chequeDate}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <ReusableInput
                  label="Payment Ref. No."
                  type="text"
                  name="paymentRefNo"
                  value={form.paymentRefNo}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-2 d-flex gap-2">
                <ReusableButton
                  type="button"
                  variant="primary"
                  className="w-50 mt-4"
                  onClick={handleConfirm}
                >
                  Confirm
                </ReusableButton>
                <ReusableButton
                  type="button"
                  variant="success"
                  className="w-50 mt-4"
                  onClick={handleExcel}
                >
                  Excel
                </ReusableButton>
              </div>
              <div className="col-md-2">
                <ReusableInput
                  label="Beneficiary"
                  type="number"
                  name="beneficiary"
                  value={form.beneficiary}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <ReusableInput
                  label="Challans"
                  type="number"
                  name="challans"
                  value={form.challans}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-2">
                <ReusableInput
                  label="Beneficiary Total"
                  type="number"
                  name="beneficiaryTotal"
                  value={form.beneficiaryTotal}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </form>
            {/* Table using reusable component */}
            {selectedData && selectedData.length > 0 ? (
              <ReusableTable
                columns={Object.keys(selectedData[0]).map((key) => ({
                  Header: key,
                  accessor: key,
                }))}
                data={selectedData}
                className="table-bordered"
              />
            ) : (
              <div>No data selected.</div>
            )}
          </div>
          <div className="modal-footer">
            <ReusableButton
              type="button"
              variant="outline-dark"
              onClick={handleCloseClick}
            >
              Close
            </ReusableButton>
          </div>
        </div>
      </div>
      {/* Toast notifications (if needed) */}
      <ReusableToast position="bottom-center" reverseOrder={true} />
    </div>
  );
};

export default SelectedDataModal;
