import React, { useState } from "react";
import ReusableDateRangePicker from "../ReusableDateRangePicker";

export default {
  title: "Reusable/ReusableDateRangePicker",
  component: ReusableDateRangePicker,
};

export const Default = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  return (
    <ReusableDateRangePicker
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      label="Date Range"
    />
  );
};
