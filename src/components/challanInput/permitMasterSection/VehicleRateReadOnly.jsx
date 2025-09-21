import React from "react";
import "./vehicleRateForPayment.css";
import { format } from "date-fns";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableForm from "../../reusable/ReusableForm";
import ReusableInput from "../../reusable/ReusableInput";
import ReusableButton from "../../reusable/ReusableButton";
import ReusableTable from "../../reusable/ReusableTable";

/**
 * VehicleRateReadOnly Component
 * - Read-only view for vehicle rate data
 * - Uses reusable UI components for form and table
 * - No API or Redux logic; data is passed as props
 * - Follows SOLID/DRY principles and world-class coding standards
 */
function VehicleRateReadOnly({ rateData }) {
  // Table columns definition for ReusableTable
  const columns = [
    {
      Header: "SL No.",
      accessor: (row, idx) => idx + 1,
      Cell: ({ row, idx }) => idx + 1,
      width: 80,
    },
    {
      Header: "Effective Date",
      accessor: "effectiveDate",
      Cell: ({ value }) => format(new Date(value), "d-MMM-yyyy"),
      width: 140,
    },
    { Header: "Vehicle Rate", accessor: "vehicleRate", width: 120 },
    { Header: "Union Vehicle Rate", accessor: "unionVehicleRate", width: 140 },
    {
      Header: "Actions",
      accessor: "id",
      Cell: () => (
        <i
          className="bi bi-trash rounded custom-hover-delete-icon p-1"
          style={{ color: "gray", cursor: "not-allowed", opacity: 0.5 }}
        ></i>
      ),
      width: 100,
    },
  ];

  // Get latest rate for form display
  const latestRate = rateData && rateData.length > 0 ? rateData[0] : {};

  return (
    <div className="container card custom-class">
      <ReusableCard>
        <div className="m-4 text-center bg-success text-white p-1 rounded">
          <span>Permit Number : </span>
          <span>{latestRate.permitNumber || ""}</span>
        </div>
        <div className="row">
          <div className="col-sm">
            <ReusableForm>
              <div className="mt-4">
                <div className="row mb-3">
                  <label
                    htmlFor="unionVehicleRate"
                    className="col-sm-5 col-form-label col-form-label-sm"
                  >
                    Union Vehicle Rate (Per ton)
                  </label>
                  <div className="col-sm-7">
                    <ReusableInput
                      type="number"
                      id="unionVehicleRate"
                      name="unionVehicleRate"
                      value={latestRate.unionVehicleRate || ""}
                      readOnly
                      className="form-control form-control-sm border-dark-subtle"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="vehicleRate"
                    className="col-sm-5 col-form-label col-form-label-sm"
                  >
                    Vehicle Rate (Per ton)
                  </label>
                  <div className="col-sm-7">
                    <ReusableInput
                      type="number"
                      id="vehicleRate"
                      name="vehicleRate"
                      value={latestRate.vehicleRate || ""}
                      readOnly
                      className="form-control form-control-sm border-dark-subtle"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <label
                    htmlFor="effectiveDate"
                    className="col-sm-4 col-form-label col-form-label-sm"
                  >
                    Effective Date
                  </label>
                  <div className="col-sm-8">
                    <ReusableInput
                      type="date"
                      id="effectiveDate"
                      name="effectiveDate"
                      value={
                        latestRate.effectiveDate
                          ? format(
                              new Date(latestRate.effectiveDate),
                              "yyyy-MM-dd"
                            )
                          : ""
                      }
                      readOnly
                      className="form-control form-control-sm border-dark-subtle"
                    />
                  </div>
                </div>
                <div className="container mb-2">
                  <div className="mx-auto">
                    <ReusableButton
                      type="button"
                      className="m-2 btn btn-sm btn-primary"
                      disabled
                    >
                      Add
                    </ReusableButton>
                    <ReusableButton
                      type="button"
                      className="m-2 btn btn-sm btn-outline-primary ml-2"
                      disabled
                    >
                      Clear
                    </ReusableButton>
                  </div>
                </div>
              </div>
            </ReusableForm>
          </div>
          <div className="col-sm">
            <div className="overflow-auto mt-4">
              <ReusableTable
                columns={columns}
                data={rateData || []}
                isLoading={false}
                className="table table-striped table-bordered table-hover align-middle"
                rowClassName="font-weight-normal textColor"
              />
            </div>
          </div>
        </div>
      </ReusableCard>
    </div>
  );
}

export default VehicleRateReadOnly;
