import React from "react";
import ReusableInput from "../reusable/ReusableInput";
import ReusableDatePicker from "../reusable/ReusableDatePicker";

/**
 * UnloadInfoForm: Form for unload information fields.
 * Uses reusable input and date picker components.
 * Props: register, unLoadingDate, setUnloadingDate
 */
const UnloadInfoForm = ({ register, unLoadingDate, setUnloadingDate }) => (
  <div className="grid-section-second card">
    <div className="item">
      <label htmlFor="unloadDate" className="form-label">
        Unload Date
      </label>
      <ReusableDatePicker
        selected={unLoadingDate}
        onChange={setUnloadingDate}
        name="unloadDate"
        id="unloadDate"
        required
      />
    </div>
    <div className="item">
      <label htmlFor="deliveryDays" className="form-label">
        Delivery Days
      </label>
      <ReusableInput
        type="number"
        id="deliveryDays"
        name="deliveryDays"
        {...register("deliveryDays")}
      />
    </div>
    {/* Add other fields as needed, using ReusableInput */}
    {/* ...existing code for other fields, replace with reusable components... */}
  </div>
);

export default UnloadInfoForm;
