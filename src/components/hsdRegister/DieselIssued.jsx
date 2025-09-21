import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ChallanWiseIssued from "./dieselIssuedSections/ChallanWiseIssued";
import DateWiseIssued from "./dieselIssuedSections/DateWiseIssued";
import PermitWiseIssued from "./dieselIssuedSections/PermitWiseIssued";
import OnlyPaidChallans from "./dieselIssuedSections/OnlyPaidChallans";
import SearchOnNumber from "./dieselIssuedSections/SearchOnNumber";
import PumpWiseSummary from "./dieselIssuedSections/PumpWiseSummary";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableForm from "../reusable/ReusableForm";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableDatePicker from "../reusable/ReusableDatePicker";
import ReusableButton from "../reusable/ReusableButton";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableToast from "../reusable/ReusableToast";

/**
 * DieselIssued - Refactored to use reusable components and React Query
 * - All form, select, datepicker, button, loader, and toast elements use reusable components
 * - API logic migrated to useApiQuery (React Query)
 * - Business logic preserved
 * - Detailed comments added
 */
function DieselIssued() {
  // State for filters
  const [petrolPump, setPetrolPump] = useState("");
  const [dateType, setDateType] = useState("CD");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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
        ? data.map((element) => ({ value: element[1], label: element[1] }))
        : [],
  });

  // Handle filter changes
  const handleSelectChange = (e) => {
    setPetrolPump(e.target.value);
  };
  const handleDateTypeChange = (e) => {
    setDateType(e.target.value);
  };
  const handleFromDate = (e) => {
    setFromDate(e.target.value);
  };
  const handleToDate = (e) => {
    setToDate(e.target.value);
  };
  const handleClear = () => {
    setPetrolPump("");
    setDateType("CD");
    setFromDate("");
    setToDate("");
    setToast({ message: "Filters cleared.", type: "info" });
  };

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

  return (
    <div className="work-space-container">
      <ReusableCard
        className="mb-3"
        title={<span className="mb-0 h6">Query On Diesel Issued</span>}
      >
        {toast.message && (
          <ReusableToast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ message: "", type: "info" })}
          />
        )}
        <ReusableForm className="row g-2">
          <div className="col-md-4 d-flex align-items-center">
            <ReusableSelect
              label="Petrol Pump"
              name="petrolPump"
              value={petrolPump}
              onChange={handleSelectChange}
              options={fillingStationsData || []}
              className="form-select form-select-sm"
            />
          </div>
          <div className="col-md-2">
            <ReusableSelect
              label="Date Type"
              name="dateType"
              value={dateType}
              onChange={handleDateTypeChange}
              options={[{ value: "CD", label: "Challan Date" }]}
              className="form-select form-select-sm border-dark-subtle w-75"
            />
          </div>
          <div className="col-md-3">
            <ReusableDatePicker
              label="From Date"
              name="fromDate"
              value={fromDate}
              onChange={handleFromDate}
              className="date-picker-input pl-2"
              placeholder="Select from Date"
              id="fromDate"
            />
          </div>
          <div className="col-md-3">
            <ReusableDatePicker
              label="To Date"
              name="toDate"
              value={toDate}
              onChange={handleToDate}
              className="date-picker-input pl-2"
              placeholder="Select To date"
              id="toDate"
            />
          </div>
          <div className="col-md-2">
            <ReusableButton
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleClear}
            >
              Clear
            </ReusableButton>
          </div>
        </ReusableForm>
      </ReusableCard>
      <Tabs
        defaultActiveKey="challan-wise-issued"
        id="fill-tab-example"
        className="mb-3"
        fill
      >
        <Tab eventKey="challan-wise-issued" title="Challan Wise Issued">
          <ChallanWiseIssued
            petrolPumpId={petrolPump}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Tab>
        <Tab eventKey="date-wise-issued" title="Date Wise Issued">
          <DateWiseIssued
            petrolPumpId={petrolPump}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Tab>
        <Tab eventKey="permit-wise-issued" title="Permit Wise Issued">
          <PermitWiseIssued
            petrolPumpId={petrolPump}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Tab>
        <Tab eventKey="only-paid-challans" title="Only Paid Challans">
          <OnlyPaidChallans
            petrolPumpId={petrolPump}
            fromDate={fromDate}
            toDate={toDate}
          />
        </Tab>
        <Tab eventKey="search-on-number" title="Search On Number">
          <SearchOnNumber />
        </Tab>
        <Tab eventKey="pump-wise-summary" title="Pump Wise Summary">
          <PumpWiseSummary />
        </Tab>
      </Tabs>
    </div>
  );
}

export default DieselIssued;
