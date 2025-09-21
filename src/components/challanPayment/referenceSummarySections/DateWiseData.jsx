import React, { useEffect, useState } from "react";
import { format } from "date-fns";
// Reusable components
import ReusableDatePicker from "../../reusable/ReusableDatePicker";
import ReusableButton from "../../reusable/ReusableButton";
import ReusableInput from "../../reusable/ReusableInput";
import ReusableSelect from "../../reusable/ReusableSelect";
import ReusableCard from "../../reusable/ReusableCard";

/**
 * DateWiseData: Date range and filter selection UI for reference summary sections.
 * - Uses reusable components for select, date picker, button, and input.
 * - Business logic for date selection and transformation is preserved.
 */
function DateWiseData({ fromDate, toDate }) {
  // State for filter selection
  const [selectOn, setSelectOn] = useState("rd");
  // State for date range
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  // Handlers for date pickers
  const handleDateFromChange = (date) => {
    setDateFrom(format(date, "yyyy-MM-dd"));
  };
  const handleDateToChange = (date) => {
    setDateTo(format(date, "yyyy-MM-dd"));
  };

  // Sync date range with props when filter changes
  useEffect(() => {
    if (selectOn === "rd") {
      setDateFrom(fromDate);
      setDateTo(toDate);
    }
  }, [selectOn, fromDate, toDate]);

  // Options for select dropdown
  const selectOptions = [
    { label: "Received Date", value: "rd" },
    { label: "xyz", value: "xyz" },
  ];

  return (
    <ReusableCard style={{ padding: 16, marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}
      >
        {/* Select filter type */}
        <div style={{ minWidth: 160 }}>
          <label htmlFor="selectOn">Select On</label>
          <ReusableSelect
            id="selectOn"
            name="selectOn"
            options={selectOptions}
            value={selectOn}
            onChange={(e) => setSelectOn(e.target.value || e)}
            size="sm"
          />
        </div>
        {/* Date From picker */}
        <div style={{ minWidth: 160 }}>
          <label htmlFor="dateFrom">Date From</label>
          <ReusableDatePicker
            id="dateFrom"
            name="dateFrom"
            value={dateFrom}
            onChange={handleDateFromChange}
            required
            size="sm"
            placeholder="Select a date"
          />
        </div>
        {/* Date To picker */}
        <div style={{ minWidth: 160 }}>
          <label htmlFor="dateTo">Date To</label>
          <ReusableDatePicker
            id="dateTo"
            name="dateTo"
            value={dateTo}
            onChange={handleDateToChange}
            required
            size="sm"
            placeholder="Select a date"
          />
        </div>
        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <ReusableButton
            type="button"
            variant="primary"
            size="sm"
            style={{ marginTop: 24 }}
          >
            Proceed
          </ReusableButton>
          <ReusableButton
            type="button"
            variant="outline-primary"
            size="sm"
            style={{ marginTop: 24 }}
          >
            To Excel
          </ReusableButton>
        </div>
        {/* Numeric input */}
        <div style={{ minWidth: 120 }}>
          <ReusableInput
            type="number"
            id="inputField5"
            size="sm"
            style={{ marginTop: 24 }}
          />
        </div>
      </div>
    </ReusableCard>
  );
}

export default DateWiseData;
