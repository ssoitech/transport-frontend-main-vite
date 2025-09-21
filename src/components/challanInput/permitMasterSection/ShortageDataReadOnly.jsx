import React from "react";
import "./shortage_calculation.css";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableForm from "../../reusable/ReusableForm";
import ReusableInput from "../../reusable/ReusableInput";
import ReusableButton from "../../reusable/ReusableButton";

/**
 * ShortageDataReadOnly Component
 * - Read-only view for shortage calculation data
 * - Uses reusable UI components for consistency and maintainability
 * - No API or Redux logic; data is passed as props
 * - Follows SOLID/DRY principles and world-class coding standards
 */
function ShortageDataReadOnly({ shortageData }) {
  // Helper to render wheel fields
  const renderWheelFields = (prefix, wheels) =>
    wheels.map((wheel) => (
      <div className="col-sm" key={wheel}>
        <label>{wheel} wheel</label>
        <ReusableInput
          type="text"
          name={`${prefix}${wheel}Wheel`}
          id={`${prefix}${wheel}Wheel`}
          value={
            shortageData
              ? shortageData[`${prefix}${wheel.toLowerCase()}wheel`]
              : ""
          }
          readOnly
          className="form-control form-control-sm border-dark-subtle"
        />
      </div>
    ));

  return (
    <div className="container mb-5">
      <ReusableCard>
        <div className="mb-4 text-center bg-success text-white p-1 rounded">
          <span>Permit Number : </span>
          <span>{shortageData ? shortageData.permitNumber : ""}</span>
        </div>
        <ReusableForm>
          {/* Penalty Type Selection */}
          <div className="row">
            {[
              { id: "check1", value: "B", label: "Penalty On Balance Qty" },
              {
                id: "check2",
                value: "S",
                label: "Penalty On Total Shortage Qty",
              },
              { id: "check3", value: "R", label: "Penalty On a Range" },
            ].map((item) => (
              <div className="col-sm" key={item.id}>
                <div className="form-check">
                  <ReusableInput
                    type="radio"
                    id={item.id}
                    name="penaltyType"
                    value={item.value}
                    checked={
                      shortageData &&
                      shortageData.shortageCalculationMode === item.value
                    }
                    readOnly
                    className="form-check-input border-dark-subtle"
                  />
                  <label className="form-check-label" htmlFor={item.id}>
                    {item.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <hr />
          {/* Exempted Upto (Kg) Section */}
          <div className="row mt-4">
            <div className="col-sm-9">
              <div className="bg-success rounded text-white p-2">
                <span>Exempted Upto (Kg)</span>
              </div>
              <div className="row mt-4 p-2">
                {renderWheelFields("exemptedUpto", [
                  "6",
                  "8",
                  "10",
                  "12",
                  "14",
                  "16",
                  "18",
                  "22",
                ])}
              </div>
            </div>
            <div className="col-sm-1">OR</div>
            <div className="col-sm-2">
              <div className="bg-success text-white p-2 rounded">
                <span>Exempt Upto (%)</span>
              </div>
              <div className="col-sm mt-4 p-2">
                <label>Percent</label>
                <ReusableInput
                  type="text"
                  name="exemptedUptoPercent"
                  id="exemptedUptoPercent"
                  value={shortageData ? shortageData.exemptedUptoPercent : ""}
                  readOnly
                  className="form-control form-control-sm border-dark-subtle"
                />
              </div>
            </div>
          </div>
          {/* Exempted Range Upto (Kg) Section */}
          <div className="row mt-4">
            <div className="col-sm-9">
              <div className="bg-success text-white p-2 rounded">
                <span>Exempted Range Upto (Kg)</span>
              </div>
              <div className="row mt-4 p-2">
                {renderWheelFields("exemptedRangeUpto", [
                  "6",
                  "8",
                  "10",
                  "12",
                  "14",
                  "16",
                  "18",
                  "22",
                ])}
              </div>
            </div>
            <div className="col-sm-3"></div>
          </div>
          {/* Penalty Per Kg Section */}
          <div className="row mt-4">
            <div>
              <span className="bg-success text-white p-2 rounded">
                Penalty Per Kg
              </span>
            </div>
            <div className="row mb-3 mt-4">
              <label
                htmlFor="penaltyPerKgInRupees"
                className="col-sm-2 col-form-label"
              >
                In Rupees
              </label>
              <div className="col-sm-4">
                <ReusableInput
                  type="text"
                  name="penaltyPerKgInRupees"
                  id="penaltyPerKgInRupees"
                  value={shortageData ? shortageData.penaltyPerKgInRupees : ""}
                  readOnly
                  className="form-control form-control-sm border-dark-subtle"
                />
              </div>
            </div>
          </div>
          {/* Office Expenses Recovery Section */}
          <div className="row mt-4">
            <div className="col-sm-9">
              <div className="bg-success text-white p-2 rounded">
                <span>Office Expenses Recovery Per Challan (Fixed Amount)</span>
              </div>
              <div className="row mt-4 p-2">
                {renderWheelFields("oer", [
                  "6",
                  "8",
                  "10",
                  "12",
                  "14",
                  "16",
                  "18",
                  "22",
                ])}
              </div>
            </div>
            <div className="col-sm-1">OR</div>
            <div className="col-sm-2">
              <div className="bg-success text-white p-2 rounded">
                <span>OER (Per Tone)</span>
              </div>
              <div className="col-sm mt-4 p-2">
                <label>Amount</label>
                <ReusableInput
                  type="text"
                  name="oerAmount"
                  id="oerAmount"
                  value={shortageData ? shortageData.oerAmount : ""}
                  readOnly
                  className="form-control form-control-sm border-dark-subtle"
                />
              </div>
            </div>
          </div>
          {/* Save and Clear Buttons (disabled) */}
          <div className="mt-5 text-center">
            <ReusableButton
              type="submit"
              className="btn btn-primary m-2 pl-3 pr-3"
              disabled
            >
              Save
            </ReusableButton>
            <ReusableButton
              type="reset"
              className="btn btn-outline-primary"
              disabled
            >
              Clear
            </ReusableButton>
          </div>
        </ReusableForm>
      </ReusableCard>
    </div>
  );
}

export default ShortageDataReadOnly;
