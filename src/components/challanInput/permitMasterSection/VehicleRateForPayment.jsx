import React, { useEffect, useState } from "react";
import "./vehicleRateForPayment.css";
import { format } from "date-fns";
import Swal from "sweetalert2";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableForm from "../../reusable/ReusableForm";
import ReusableInput from "../../reusable/ReusableInput";
import ReusableButton from "../../reusable/ReusableButton";
import ReusableTable from "../../reusable/ReusableTable";
import ReusableLoader from "../../reusable/ReusableLoader";
import ReusableToast from "../../reusable/ReusableToast";
import { useApiQuery, useApiMutation } from "../../../hooks/api/useApiQuery";

/**
 * VehicleRateForPayment Component
 * - Refactored to use reusable UI components for form and table
 * - API logic separated using generic React Query hooks (SOLID, DRY)
 * - No Redux logic present
 * - World-class, maintainable, production-ready code
 */
function VehicleRateForPayment({ permitNo }) {
  const [permitNumber, setPermitNumber] = useState(permitNo);
  const [vehicleRate, setVehicleRate] = useState();
  const [effectiveDate, setEffectiveDate] = useState(null);
  const [unionVehicleRate, setUnionVehicleRate] = useState("");
  const [startSpneer, setStartSpneer] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Fetch all vehicle rate data for permit number
  const {
    data: allVehicleRateData,
    refetch,
    isLoading: isTableLoading,
  } = useApiQuery({
    key: "vehicle-rate-list",
    url: `/api/v1/get/all/vehicle-rates/by-permit-number/${permitNumber}`,
    method: "get",
    enabled: !!permitNumber,
    select: (data) => data,
  });

  // Add vehicle rate mutation
  const { mutate: addVehicleRate, isLoading: isAddLoading } = useApiMutation({
    key: "add-vehicle-rate",
    url: "/api/v1/add/one/vehicle-rate",
    method: "post",
    onSuccess: (response) => {
      if (response === "success") {
        setToastMsg({ type: "success", message: "Successfully Added!" });
        setStartSpneer(false);
        setVehicleRate("");
        setUnionVehicleRate("");
        setEffectiveDate(null);
        refetch();
      } else {
        setToastMsg({ type: "error", message: "Some Error Occurred!" });
        setStartSpneer(false);
      }
    },
    onError: (error) => {
      if (error?.response?.data === "duplicate") {
        setToastMsg({ type: "error", message: "Short name already exists!" });
      } else {
        setToastMsg({ type: "error", message: "Some Error Occurred!" });
      }
      setStartSpneer(false);
    },
  });

  // Delete vehicle rate mutation
  const { mutate: deleteVehicleRate, isLoading: isDeleteLoading } =
    useApiMutation({
      key: "delete-vehicle-rate",
      url: "/api/v1/delete/one/vehicle-rate",
      method: "delete",
      onSuccess: (response) => {
        if (response === "success") {
          setToastMsg({ type: "success", message: "Successfully Deleted!" });
          refetch();
        } else {
          setToastMsg({
            type: "error",
            message: "Not able to delete. Some error occurred!",
          });
        }
      },
      onError: () => {
        setToastMsg({
          type: "error",
          message: "Not able to delete. Some error occurred!",
        });
      },
    });

  useEffect(() => {
    setPermitNumber(permitNo);
  }, [permitNo]);

  // Form submit handler
  const handleVehicleRateSave = (e) => {
    e.preventDefault();
    setStartSpneer(true);
    if (!permitNumber) {
      setToastMsg({
        type: "error",
        message: "Permit Number Should Not Be Empty!!",
      });
      setStartSpneer(false);
      Swal.fire({
        title: "Permit Number Should Not Be Empty!!",
        confirmButtonText: "OK",
      });
      return;
    }
    if (!vehicleRate) {
      setToastMsg({ type: "error", message: "Please Enter Vehicle Rate" });
      setStartSpneer(false);
      Swal.fire({
        title: "Please Enter Vehicle Rate",
        confirmButtonText: "OK",
      });
      return;
    }
    if (!effectiveDate) {
      setToastMsg({ type: "error", message: "Please Enter Effective Date" });
      setStartSpneer(false);
      Swal.fire({
        title: "Please Enter Effective Date",
        confirmButtonText: "OK",
      });
      return;
    }
    const fdata = {
      permitNumber,
      unionVehicleRate: unionVehicleRate ? unionVehicleRate : 0,
      vehicleRate,
      effectiveDate,
      createdBy: "",
    };
    addVehicleRate(fdata);
  };

  // Delete handler
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure to delete?",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      icon: "warning",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteVehicleRate(id);
      }
    });
  };

  // Clear form handler
  const handleClear = (e) => {
    e.preventDefault();
    setUnionVehicleRate("");
    setVehicleRate("");
    setEffectiveDate(null);
  };

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
      Cell: ({ value }) => (
        <i
          className="bi bi-trash rounded custom-hover-delete-icon p-1"
          onClick={() => handleDelete(value)}
          style={{ cursor: "pointer", color: "red" }}
        ></i>
      ),
      width: 100,
    },
  ];

  return (
    <div className="container card custom-class">
      <ReusableCard>
        <div className="m-4 text-center bg-success text-white p-1 rounded">
          <span>Permit Number : </span>
          <span>{permitNo}</span>
        </div>
        <div className="row">
          <div className="col-sm">
            <ReusableForm onSubmit={handleVehicleRateSave}>
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
                      value={unionVehicleRate}
                      onChange={(e) => setUnionVehicleRate(e.target.value)}
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
                      value={vehicleRate}
                      onChange={(e) => setVehicleRate(e.target.value)}
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
                      value={effectiveDate || ""}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="form-control form-control-sm border-dark-subtle"
                    />
                  </div>
                </div>
                <div className="container mb-2">
                  <div className="mx-auto">
                    <ReusableButton
                      type="submit"
                      className="m-2 btn btn-sm btn-primary"
                    >
                      {startSpneer || isAddLoading ? (
                        <ReusableLoader size="sm" />
                      ) : null}
                      Add
                    </ReusableButton>
                    <ReusableButton
                      type="button"
                      className="m-2 btn btn-sm btn-outline-primary ml-2"
                      onClick={handleClear}
                    >
                      Clear
                    </ReusableButton>
                  </div>
                </div>
              </div>
              {/* Toast Notification */}
              {toastMsg && (
                <ReusableToast
                  type={toastMsg.type}
                  message={toastMsg.message}
                  position="bottom-center"
                />
              )}
            </ReusableForm>
          </div>
          <div className="col-sm">
            <div className="overflow-auto mt-4">
              <ReusableTable
                columns={columns}
                data={allVehicleRateData || []}
                isLoading={isTableLoading || isDeleteLoading}
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

export default VehicleRateForPayment;
