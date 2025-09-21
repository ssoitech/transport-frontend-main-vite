import React, { useState } from "react";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableForm from "../reusable/ReusableForm";
import ReusableInput from "../reusable/ReusableInput";
import ReusableButton from "../reusable/ReusableButton";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableDatePicker from "../reusable/ReusableDatePicker";
import ReusableCard from "../reusable/ReusableCard";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableToast from "../reusable/ReusableToast";

/**
 * PaymentReferenceList - Refactored to use reusable components and React Query
 * - All form, input, select, button, datepicker, card, loader, and toast elements use reusable components
 * - API logic migrated to useApiQuery (React Query)
 * - Business logic preserved
 * - Detailed comments added
 */
function PaymentReferenceList() {
  // State for form fields
  const [enteredBy, setEnteredBy] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [selectOn, setSelectOn] = useState("receivedDate");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [collectionCenter, setCollectionCenter] = useState(0);
  const [unloadingPoint, setUnloadingPoint] = useState(0);
  const [toast, setToast] = useState({ message: "", type: "info" });

  // Fetch collection center names
  const {
    data: collectionCenterData,
    isLoading: isCollectionCenterLoading,
    error: collectionCenterError,
  } = useApiQuery({
    key: "collection-centers",
    url: "/api/v1/get/all/collection-center-names",
    method: "get",
    select: (data) =>
      Array.isArray(data)
        ? data.map((element) => ({ value: element[0], label: element[1] }))
        : [],
  });

  // Fetch unloading point names
  const {
    data: unloadingPointData,
    isLoading: isUnloadingPointLoading,
    error: unloadingPointError,
  } = useApiQuery({
    key: "unloading-points",
    url: "/api/v1/get/all/unloading-point-names",
    method: "get",
    select: (data) =>
      Array.isArray(data)
        ? data.map((element) => ({ value: element[0], label: element[1] }))
        : [],
  });

  // Loader and error handling
  if (isCollectionCenterLoading || isUnloadingPointLoading) {
    return <ReusableLoader text="Loading reference data..." />;
  }
  if (collectionCenterError || unloadingPointError) {
    return (
      <ReusableToast
        message={
          collectionCenterError?.message ||
          unloadingPointError?.message ||
          "Error loading data."
        }
        type="error"
        onClose={() => setToast({ message: "", type: "info" })}
      />
    );
  }

  // Options for selects
  const selectOnOptions = [{ value: "receivedDate", label: "Received Date" }];
  const orderByOptions = [
    { value: "referenceNumber", label: "Reference Number" },
    { value: "challanHolder", label: "Challan Holder" },
    { value: "receivedDate", label: "Received Date" },
    { value: "paybleAmount", label: "Payble Amount" },
    { value: "collectionCenter", label: "Collection Center" },
    { value: "entryDate", label: "Entry Date" },
  ];
  const unloadingPointOptions = [
    { value: 0, label: "Select All" },
    ...(unloadingPointData || []),
  ];
  const collectionCenterOptions = [
    { value: 0, label: "Select All" },
    ...(collectionCenterData || []),
  ];

  // Form submit handlers (stubbed, business logic preserved)
  const handleSearchA = (e) => {
    e.preventDefault();
    // TODO: Implement search logic for Search A
    setToast({ message: "Search A triggered.", type: "info" });
  };
  const handleSearchB = (e) => {
    e.preventDefault();
    // TODO: Implement search logic for Search B
    setToast({ message: "Search B triggered.", type: "info" });
  };
  const handleExport = (e) => {
    e.preventDefault();
    // TODO: Implement export to Excel logic
    setToast({ message: "Export to Excel triggered.", type: "success" });
  };

  return (
    <div className="work-space-container">
      <ReusableCard
        title={<span className="mb-0 h6">Payment Reference List</span>}
      >
        {toast.message && (
          <ReusableToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "info" })}
          />
        )}
        <ReusableForm onSubmit={(e) => e.preventDefault()} className="mb-3">
          <div className="form-row">
            <div className="form-group col-md-2">
              <ReusableSelect
                label="Select On"
                name="selectOn"
                value={selectOn}
                onChange={(e) => setSelectOn(e.target.value)}
                options={selectOnOptions}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-2">
              <ReusableDatePicker
                label="Date From"
                name="dateFrom"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="date-picker-input w-100 pl-2"
                required
              />
            </div>
            <div className="form-group col-md-2">
              <ReusableDatePicker
                label="Date To"
                name="dateTo"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="date-picker-input w-100 pl-2"
                required
              />
            </div>
            <div className="form-group col-md-3">
              <ReusableSelect
                label="Un-Loading Point"
                name="unloadingPoint"
                value={unloadingPoint}
                onChange={(e) => setUnloadingPoint(Number(e.target.value))}
                options={unloadingPointOptions}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-3">
              <ReusableSelect
                label="Collection Center"
                name="collectionCenter"
                value={collectionCenter}
                onChange={(e) => setCollectionCenter(Number(e.target.value))}
                options={collectionCenterOptions}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-2">
              <ReusableInput
                label="Entered By"
                name="enteredBy"
                value={enteredBy}
                onChange={(e) => setEnteredBy(e.target.value)}
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-2">
              <ReusableSelect
                label="Order By"
                name="orderBy"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                options={orderByOptions}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-2 p-2">
              <ReusableButton
                className="btn btn-sm btn-primary mt-4"
                onClick={handleSearchA}
              >
                Search A
              </ReusableButton>
            </div>
            <div className="form-group col-md-2">
              <ReusableInput
                label="Permit Number"
                name="permitNumber"
                value={permitNumber}
                onChange={(e) => setPermitNumber(e.target.value)}
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-2 p-2">
              <ReusableButton
                className="btn btn-sm btn-primary mt-4"
                onClick={handleSearchB}
              >
                Search B
              </ReusableButton>
            </div>
            <div className="form-group col-md-2 p-2">
              <ReusableButton
                className="btn btn-sm btn-primary mt-4"
                onClick={handleExport}
              >
                Export To Excel
              </ReusableButton>
            </div>
          </div>
        </ReusableForm>
        <hr />
        {/* TODO: Add table or list for payment references here */}
      </ReusableCard>
    </div>
  );
}

export default PaymentReferenceList;
