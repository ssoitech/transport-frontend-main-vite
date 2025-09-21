import React from "react";
import ReusableInput from "../reusable/ReusableInput";
import ReusableDatePicker from "../reusable/ReusableDatePicker";

/**
 * LoadingInfoForm: Form for loading information fields.
 * Uses reusable input and date picker components.
 * Props: register, loadingDate, setLoadingDate
 */
const LoadingInfoForm = ({ register, loadingDate, setLoadingDate }) => (
  <div className="grid-container-first card">
    <div className="item">
      <label htmlFor="stackNo" className="form-label">
        Stack No
      </label>
      <ReusableInput
        type="text"
        id="stackNo"
        name="stackNo"
        {...register("stackNo")}
      />
    </div>
    <div className="item">
      <label htmlFor="loadDate" className="form-label">
        Load Date
      </label>
      <ReusableDatePicker
        selected={loadingDate}
        onChange={setLoadingDate}
        name="loadDate"
        id="loadDate"
      />
    </div>
    {/* Add other fields as needed, using ReusableInput */}
    {/* ...existing code for other fields, replace with reusable components... */}
  </div>
);

export default LoadingInfoForm;
