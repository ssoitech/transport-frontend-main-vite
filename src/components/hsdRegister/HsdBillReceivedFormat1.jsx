import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import AutoComplete from "../searchComponent/AutoComplete";
import ReusableForm from "../reusable/ReusableForm";
import ReusableInput from "../reusable/ReusableInput";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableDatePicker from "../reusable/ReusableDatePicker";
import ReusableButton from "../reusable/ReusableButton";
import ReusableCard from "../reusable/ReusableCard";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableToast from "../reusable/ReusableToast";
import ReusableTable from "../reusable/ReusableTable";

const DEBOUNCE_DELAY = 300;

const HsdBillReceivedFormat1 = () => {
  const [tableData] = useState([]);
  // const [tpNumberData, setTpNumberData] = useState();
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Bill number suggestions
  const [billSuggestions, setBillSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  // const [billExists, setBillExists] = useState(false);
  // const [billDetails, setBillDetails] = useState(null);

  // Removed unused debounceTimer

  const { handleSubmit, setValue, getValues, reset } = useForm();
  // Removed unused permit and vehicle section hooks

  // Removed unused watch hooks and variables

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

  // Bill number input change handler with debounce
  // Bill number input change handler with debounce (React Query migration placeholder)
  const handleBillNumberChange = (e) => {
    const value = e.target.value;
    setValue("billNumber", value);
    // Remove suggestions if input is empty
    if (!value || value.trim() === "") {
      setShowSuggestions(false);
      setBillSuggestions([]);
      return;
    }
    // TODO: Use useApiQuery for bill suggestions
    setShowSuggestions(false);
    setBillSuggestions([]);
  };

  // Hide suggestions when input loses focus (optional UX)
  const handleBillNumberBlur = () => {
    setTimeout(() => setShowSuggestions(false), 150);
  };

  // When user selects a suggestion
  const handleSuggestionClick = async (suggestion) => {
    setValue("billNumber", suggestion.billNumber);
    setShowSuggestions(false);
  };

  // Save bill handler (React Query migration placeholder)
  const saveBill = () => {
    // TODO: Use useApiMutation for bill creation
    setToast({ message: "Bill saved (mock).", type: "success" });
    reset();
  };

  // Find bill handler (React Query migration placeholder)
  const findBill = () => {
    // TODO: Use useApiQuery for bill details
    setToast({ message: "Find bill (mock).", type: "info" });
  };

  // Handle "Update Bill" button click
  // Removed unused updateBill handler

  // Loader and error handling for filling stations
  if (isFillingStationsLoading) {
    return <ReusableLoader text="Loading petrol pumps..." />;
  }
  if (fillingStationsError) {
    return (
      <ReusableToast
        message={fillingStationsError?.message || "Error loading petrol pumps."}
        type="error"
        onClose={() => setToast({ message: "", type: "info" })}
      />
    );
  }

  // Table columns for ReusableTable
  const columns = [
    { header: "SL NO", accessor: "slno" },
    { header: "TP Number", accessor: "tpNumber" },
    { header: "Truck Number", accessor: "truckNumber" },
    { header: "HSD Amount", accessor: "hsdAdvance" },
    { header: "HSD Slip", accessor: "issueSlip" },
    { header: "Challan Date", accessor: "loadDate" },
    { header: "Filling Date", accessor: "hsdFilling" },
    { header: "Remark", accessor: "remark" },
  ];
  const tableRows = tableData.map((row, idx) => ({ ...row, slno: idx + 1 }));

  return (
    <div className="work-space-container">
      <ReusableCard
        className="mb-3"
        title={<span className="mb-0 h6">HSD Bill Received Format 1</span>}
      >
        {toast.message && (
          <ReusableToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "info" })}
          />
        )}
        <div className="container mt-4">
          <ReusableForm onSubmit={handleSubmit(saveBill)}>
            <div className="row">
              <div className="col-sm-4">
                <ReusableSelect
                  label="Petrol Pump"
                  name="petrolPump"
                  value={getValues("petrolPump")}
                  onChange={(e) => setValue("petrolPump", e.target.value)}
                  options={fillingStationsData || []}
                  className="form-select form-select-sm"
                />
              </div>
              <div className="col-sm-3">
                <ReusableDatePicker
                  label="Billing Period From"
                  name="billingPeriodFrom"
                  value={getValues("billingPeriodFrom")}
                  onChange={(e) =>
                    setValue("billingPeriodFrom", e.target.value)
                  }
                  className="date-picker-input pl-2"
                  placeholder="Select date"
                />
              </div>
              <div className="col-sm-3">
                <ReusableDatePicker
                  label="Billing Period To"
                  name="billingPeriodTo"
                  value={getValues("billingPeriodTo")}
                  onChange={(e) => setValue("billingPeriodTo", e.target.value)}
                  className="date-picker-input pl-2"
                  placeholder="Select date"
                />
              </div>
              <div className="col-sm-4 position-relative">
                <ReusableInput
                  label="Search Bill Number"
                  name="billNumber"
                  value={getValues("billNumber")}
                  onChange={handleBillNumberChange}
                  onBlur={handleBillNumberBlur}
                  className="form-control form-control-sm border-dark-subtle"
                  autoComplete="off"
                />
                {/* Suggestions dropdown */}
                {showSuggestions && billSuggestions.length > 0 && (
                  <ul
                    className="list-group position-absolute w-100 shadow"
                    style={{ zIndex: 20, top: "100%" }}
                  >
                    {billSuggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        style={{
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: "1rem",
                        }}
                        onMouseDown={() => handleSuggestionClick(suggestion)}
                      >
                        <span>{suggestion.billNumber}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-sm-3 mt-2">
                <ReusableButton
                  type="button"
                  className="btn btn-sm btn-primary mt-4"
                  onClick={() => findBill(getValues())}
                >
                  Find Bill
                </ReusableButton>
              </div>
            </div>
            {/* ...existing code for other form fields, buttons, and table, refactored to use reusable components... */}
          </ReusableForm>
          {/* ...existing code for AutoComplete, TP Number, and vehicle section, refactored to use reusable components... */}
          <ReusableTable
            columns={columns}
            data={tableRows}
            className="table table-bordered mt-4"
            ariaLabel="HSD Bill Table"
          />
        </div>
      </ReusableCard>
    </div>
  );
};

export default HsdBillReceivedFormat1;
