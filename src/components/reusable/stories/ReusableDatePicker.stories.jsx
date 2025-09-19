import React, { useState } from "react";
import ReusableDatePicker from "../ReusableDatePicker";

export default {
  title: "Reusable/ReusableDatePicker",
  component: ReusableDatePicker,
};

export const Default = () => {
  const [value, setValue] = useState("");
  return (
    <ReusableDatePicker
      label="Date"
      name="date"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};
