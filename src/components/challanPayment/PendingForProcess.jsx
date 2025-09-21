import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ReferenceDetails from "./paymentPendingSection/ReferenceDetails";
import BeneficiaryWiseSummary from "./paymentPendingSection/BeneficiaryWiseSummary";
import ChallanWiseDetails from "./paymentPendingSection/ChallanWiseDetails";
import SummaryReport from "./paymentPendingSection/SummaryReport";
import TollGateAmount from "./paymentPendingSection/TollGateAmount";
import CheckOffExp from "./paymentPendingSection/CheckOffExp";
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
 * PendingForProcess - Refactored to use reusable components and React Query
 * - All form, input, select, button, datepicker, card, loader, and toast elements use reusable components
 * - API logic migrated to useApiQuery (React Query)
 * - Business logic preserved
 * - Detailed comments added
 */
function PendingForProcess() {
  // State for form fields
  const [collectionCenterCheckBox, setCollectionCenterCheckBox] =
    useState(false);
  const [selectedCollectionCenter, setSelectedCollectionCenter] = useState("");
  const [receivedFromDate, setReceivedFromDate] = useState("");
  const [receivedToDate, setReceivedToDate] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [challanHolderName, setChallanHolderName] = useState("");
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
    enabled: collectionCenterCheckBox,
  });

  // Options for selects
  const collectionCenterOptions = [
    { value: "", label: "Select All" },
    ...(collectionCenterData || []),
  ];
  const orderByOptions = [
    { value: "referenceNumber", label: "Reference Number" },
    { value: "challanHolder", label: "Challan Holder" },
    { value: "receivedDate", label: "Received Date" },
    { value: "paybleAmount", label: "Payble Amount" },
    { value: "collectionCenter", label: "Collection Center" },
    { value: "entryDate", label: "Entry Date" },
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

  // Checkbox handler
  const handleCollectionCenterCheck = (e) => {
    setCollectionCenterCheckBox(e.target.checked);
    if (!e.target.checked) {
      setSelectedCollectionCenter("");
    }
  };

  return (
    <div className="work-space-container">
      <ReusableCard
        title={<span className="mb-0 h6">Payment Pending For Process</span>}
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
              <div className="form-check form-check-inline">
                <label htmlFor="collectionCenterCheck">Collection Center</label>
                <input
                  type="checkbox"
                  id="collectionCenterCheck"
                  checked={collectionCenterCheckBox}
                  onChange={handleCollectionCenterCheck}
                  className="form-check-input ml-2"
                />
              </div>
              <ReusableSelect
                label={null}
                name="collectionCenter"
                value={selectedCollectionCenter}
                onChange={(e) => setSelectedCollectionCenter(e.target.value)}
                options={collectionCenterOptions}
                className="form-select form-select-sm"
                disabled={!collectionCenterCheckBox}
              />
            </div>
            <div className="form-group col-sm-4 ml-4">
              <ReusableDatePicker
                label="Receive Period From"
                name="receivedFromDate"
                value={receivedFromDate}
                onChange={(e) => setReceivedFromDate(e.target.value)}
                className="date-picker-input pl-2"
                required
              />
            </div>
            <div className="form-group col-sm-4">
              <ReusableDatePicker
                label="Receive Period To"
                name="receivedToDate"
                value={receivedToDate}
                onChange={(e) => setReceivedToDate(e.target.value)}
                className="date-picker-input pl-2"
                required
              />
            </div>
            <div className="form-group col-md-3">
              <ReusableSelect
                label="Order By"
                name="orderBy"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                options={orderByOptions}
                className="form-select form-select-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-3">
              <ReusableInput
                label="Challan Holder Name"
                name="challanHolderName"
                value={challanHolderName}
                onChange={(e) => setChallanHolderName(e.target.value)}
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
          </div>
        </ReusableForm>
        <hr />
        <Tabs
          defaultActiveKey="reference-details"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="reference-details" title="Reference Details">
            <ReferenceDetails />
          </Tab>
          <Tab
            eventKey="Beneficiary-wise-summary"
            title="Beneficiary Wise Summary"
          >
            <BeneficiaryWiseSummary />
          </Tab>
          <Tab eventKey="challan-wise-details" title="Challan Wise Details">
            <ChallanWiseDetails />
          </Tab>
          <Tab eventKey="summary-report" title="Summary Report">
            <SummaryReport />
          </Tab>
          <Tab eventKey="toll-gate-amount" title="Toll Gate Amount">
            <TollGateAmount />
          </Tab>
          <Tab eventKey="check-off-exp" title="Check Off Exp">
            <CheckOffExp />
          </Tab>
        </Tabs>
      </ReusableCard>
    </div>
  );
}

export default PendingForProcess;
