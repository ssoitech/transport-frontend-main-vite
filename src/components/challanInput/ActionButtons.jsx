import React from "react";
import ReusableButton from "../reusable/ReusableButton";
import ReusableLoader from "../reusable/ReusableLoader";

/**
 * ActionButtons: Renders Save, Delete, New, and Stop Payment buttons.
 * Uses reusable button and loader components.
 * Props: onSubmit, startSpinner, isSaving
 */
const ActionButtons = ({ onSubmit, startSpinner, isSaving }) => (
  <div className="button-container">
    <div className="button-item text-center">
      <ReusableButton
        type="submit"
        form="challanForm"
        disabled={startSpinner || isSaving}
      >
        {startSpinner || isSaving ? <ReusableLoader size="small" /> : "Save"}
      </ReusableButton>
      <ReusableButton type="button">Delete</ReusableButton>
      <ReusableButton type="button">New</ReusableButton>
    </div>
    <div className="button-item text-center">
      <ReusableButton type="button" variant="outline-primary" size="small">
        Stop Payment
      </ReusableButton>
    </div>
  </div>
);

export default ActionButtons;
