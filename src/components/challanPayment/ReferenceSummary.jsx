import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import PermitWiseData from "./referenceSummarySections/PermitWiseData";
import OwnerWiseData from "./referenceSummarySections/OwnerWiseData";
import DateWiseData from "./referenceSummarySections/DateWiseData";
import CollectionCenterWiseData from "./referenceSummarySections/CollectionCenterWiseData";
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
 * ReferenceSummary - Refactored to use reusable components and React Query
 * - All form, input, select, button, datepicker, card, loader, and toast elements use reusable components
 * - API logic migrated to useApiQuery (React Query)
 * - Business logic preserved
 * - Detailed comments added
 */
function ReferenceSummary() {
  // State for form fields
  const [centerValue, setCenterValue] = useState(0);
  const [receivedFromDate, setReceivedFromDate] = useState("");
  const [receivedToDate, setReceivedToDate] = useState("");
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

  // Options for selects
  const collectionCenterOptions = [
    { value: 0, label: "Select All" },
    ...(collectionCenterData || []),
  ];

  // Loader and error handling
  if (isCollectionCenterLoading) {
    return <ReusableLoader text="Loading collection centers..." />;
  }
  if (collectionCenterError) {
    return (
      <ReusableToast
        message={
          collectionCenterError?.message || "Error loading collection centers."
        }
        type="error"
        onClose={() => setToast({ message: "", type: "info" })}
      />
    );
  }

  // Date change handlers
  const handleFromDateChange = (e) => {
    setReceivedFromDate(e.target.value);
  };
  const handleToDateChange = (e) => {
    setReceivedToDate(e.target.value);
  };

  return (
    <div className="work-space-container">
      <ReusableCard
        title={<span className="mb-0 h6">Payment Reference Summary</span>}
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
            <div className="form-group col-sm-3">
              <ReusableSelect
                label="Collection Center"
                name="collectionCenter"
                value={centerValue}
                onChange={(e) => setCenterValue(Number(e.target.value))}
                options={collectionCenterOptions}
                className="form-select form-select-sm"
              />
            </div>
            <div className="form-group col-sm-4 ml-4">
              <ReusableDatePicker
                label="Receive Period From"
                name="receivedFromDate"
                value={receivedFromDate}
                onChange={handleFromDateChange}
                className="date-picker-input pl-2"
                required
              />
            </div>
            <div className="form-group col-sm-4">
              <ReusableDatePicker
                label="Receive Period To"
                name="receivedToDate"
                value={receivedToDate}
                onChange={handleToDateChange}
                className="date-picker-input pl-2"
                required
              />
            </div>
          </div>
        </ReusableForm>
        <hr />
        <Tabs
          defaultActiveKey="permit-wise"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="permit-wise" title="Permit Wise">
            <PermitWiseData />
          </Tab>
          <Tab eventKey="owner-wise" title="Owner / Beneficiary Wise">
            <OwnerWiseData />
          </Tab>
          <Tab eventKey="date-wise" title="Date Wise">
            <DateWiseData
              center={centerValue}
              fromDate={receivedFromDate}
              toDate={receivedToDate}
            />
          </Tab>
          <Tab eventKey="collection-center-wise" title="Collection Center Wise">
            <CollectionCenterWiseData />
          </Tab>
        </Tabs>
      </ReusableCard>
    </div>
  );
}

export default ReferenceSummary;
