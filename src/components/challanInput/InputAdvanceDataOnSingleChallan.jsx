import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableCard from "../reusable/ReusableCard";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableToast from "../reusable/ReusableToast";
import ReusableLoader from "../reusable/ReusableLoader";

/**
 * InputAdvanceDataOnSingleChallan
 * - Handles input and update of advance data for a single challan.
 * - Uses React Query for all API/data logic (field staff, brokers, stations, banks, search, update).
 * - UI is built with reusable components for maintainability and consistency.
 */
function InputAdvanceDataOnSingleChallan() {
  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // Fetch select options via React Query
  const { data: fieldStaffOptions = [] } = useApiQuery({
    key: "fieldStaff",
    url: "/api/v1/get/all/field-staff-master",
    method: "get",
    select: (data) => data.map((item) => ({ id: item.id, name: item.name })),
  });
  const { data: brokerOptions = [] } = useApiQuery({
    key: "brokers",
    url: "/api/v1/get/all/fleet-agent-broker-master",
    method: "get",
    select: (data) => data.map((item) => ({ id: item.id, name: item.name })),
  });
  const { data: stationOptions = [] } = useApiQuery({
    key: "stations",
    url: "/api/v1/get/filling-stations",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });
  const { data: bankOptions = [] } = useApiQuery({
    key: "banks",
    url: "/api/v1/get/all/bank-ids-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });

  // Challan search mutation
  const searchMutation = useApiMutation({
    key: "searchChallanAdvance",
    url: "/api/v1/get/one/challan-details/for-advance-input",
    method: "get",
    onSuccess: (response) => {
      if (response) {
        // Populate form fields with response data
        Object.entries(response).forEach(([key, value]) => {
          setValue(key, value);
        });
      } else {
        reset();
      }
    },
  });

  // Advance data update mutation
  const updateMutation = useApiMutation({
    key: "updateAdvanceData",
    url: "/api/v1/update/one/advance-data",
    method: "post",
    onSuccess: () => {
      reset();
    },
  });

  // Form submit handler
  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  // Find button handler
  const handleFind = () => {
    const tpNumber = watch("tpNumber");
    if (tpNumber) {
      searchMutation.mutate(tpNumber.replace(/\//g, "_"));
    }
  };

  // Clear button handler
  const handleClear = () => {
    reset();
  };

  return (
    <div className="work-space-container">
      <ReusableCard>
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-2"
          role="alert"
        >
          <span className="mb-0 h6">Input Advance Data Challan Wise</span>
        </div>
        <form id="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Main form fields for InputAdvanceDataOnSingleChallan */}
          <div className="form-row">
            <ReusableInput
              label="Transit Pass Number"
              name="tpNumber"
              {...register("tpNumber", { required: "TP Number required" })}
              error={errors.tpNumber?.message}
            />
            <ReusableButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleFind}
            >
              Find
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="outline-primary"
              size="sm"
              onClick={handleClear}
            >
              New
            </ReusableButton>
          </div>
          <hr />
          <div className="form-row">
            <ReusableInput
              label="Challan Date"
              name="challanDate"
              type="date"
              {...register("challanDate", {
                required: "Challan Date required",
              })}
              error={errors.challanDate?.message}
            />
            <ReusableInput
              label="Vehicle Number"
              name="vehicleNumber"
              {...register("vehicleNumber", {
                required: "Vehicle Number required",
              })}
              error={errors.vehicleNumber?.message}
            />
            <ReusableInput
              label="Loading Quantity"
              name="loadingQty"
              type="number"
              {...register("loadingQty", {
                required: "Loading Quantity required",
              })}
              error={errors.loadingQty?.message}
            />
          </div>
          <div className="form-row">
            <ReusableInput
              label="Vehicle Rate"
              name="vehicleRate"
              type="number"
              {...register("vehicleRate")}
            />
            <ReusableInput
              label="Loading Point"
              name="loadingPoint"
              {...register("loadingPoint")}
            />
            <ReusableInput
              label="Destination"
              name="destination"
              {...register("destination")}
            />
          </div>
          <hr />
          <div className="form-row">
            <ReusableInput
              label="Payment Rate"
              name="paymentRate"
              {...register("paymentRate")}
            />
            <ReusableInput
              label="Challan No"
              name="challanNumber"
              {...register("challanNumber")}
            />
            <ReusableInput
              label="WS/Inv No."
              name="invNumber"
              {...register("invNumber")}
            />
          </div>
          <div className="form-row">
            <ReusableInput
              label="Driver Welfare"
              name="driverWelfare"
              {...register("driverWelfare")}
            />
            <ReusableSelect
              label="Vehicle Type"
              name="vehicleType"
              options={[
                { id: "", name: "" },
                { id: "nonunion", name: "Non-Union" },
                { id: "union", name: "Union" },
              ]}
              {...register("vehicleType")}
            />
            <ReusableSelect
              label="Field Staff"
              name="fieldStaff"
              options={fieldStaffOptions}
              {...register("fieldStaff")}
            />
          </div>
          <div className="form-row">
            <ReusableInput
              label="Cash Adv."
              name="cashAdv"
              {...register("cashAdv")}
            />
            <ReusableInput
              label="Bank Adv."
              name="bankAdv"
              {...register("bankAdv")}
            />
            <ReusableInput
              label="Cash & Bank"
              name="cashAndBank"
              {...register("cashAndBank")}
            />
          </div>
          <div className="form-row">
            <ReusableInput
              label="Payment Date"
              name="paymentDate"
              type="date"
              {...register("paymentDate")}
            />
            <ReusableSelect
              label="From Bank"
              name="fromBank"
              options={bankOptions}
              {...register("fromBank")}
            />
            <ReusableSelect
              label="Mode"
              name="mode"
              options={[
                { id: "", name: "" },
                { id: "net", name: "On Net" },
                { id: "cheque", name: "Cheque" },
              ]}
              {...register("mode")}
            />
          </div>
          <div className="form-row">
            <ReusableInput
              label="Cheque No"
              name="chequeNo"
              {...register("chequeNo")}
            />
            <ReusableInput
              label="Cheque Date"
              name="chequeDate"
              type="date"
              {...register("chequeDate")}
            />
            <ReusableInput
              label="Remark"
              name="remark"
              as="textarea"
              {...register("remark")}
            />
          </div>
          <div className="form-row">
            <ReusableSelect
              label="Filling Station"
              name="fillingStation"
              options={stationOptions}
              {...register("fillingStation")}
            />
            <ReusableInput
              label="Diessel Slip No"
              name="diesselSlipNo"
              {...register("diesselSlipNo")}
            />
            <ReusableInput
              label="Diessel in Cash"
              name="diesselCash"
              {...register("diesselCash")}
            />
          </div>
          <div className="form-row">
            <ReusableSelect
              label="Agent/Broker"
              name="agent"
              options={brokerOptions}
              {...register("agent")}
            />
            <ReusableInput
              label="Other Ded."
              name="otherDed"
              {...register("otherDed")}
            />
            <ReusableInput
              label="Towards"
              name="towards"
              as="textarea"
              {...register("towards")}
            />
          </div>
          <div className="form-row">
            <ReusableInput
              label="Total Adv."
              name="totalAdv"
              {...register("totalAdv")}
            />
            <ReusableButton
              type="submit"
              variant="primary"
              className="m-2"
              disabled={isSubmitting || updateMutation.isLoading}
            >
              {(isSubmitting || updateMutation.isLoading) && (
                <ReusableLoader size="sm" color="light" />
              )}
              <span>Save</span>
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="outline-primary"
              onClick={handleClear}
            >
              Clear
            </ReusableButton>
          </div>
        </form>
        <ReusableToast position="bottom-center" reverseOrder={true} />
      </ReusableCard>
    </div>
  );
}

export default InputAdvanceDataOnSingleChallan;
