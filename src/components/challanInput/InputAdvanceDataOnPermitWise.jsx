import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Swal from "sweetalert2";
import AutoComplete from "../searchComponent/AutoComplete";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableCard from "../reusable/ReusableCard";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableToast from "../reusable/ReusableToast";
import ReusableLoader from "../reusable/ReusableLoader";

/**
 * InputAdvanceDataOnPermitWise
 * - Handles input and update of advance data for a permit/challan.
 * - Uses React Query for all API/data logic (field staff, brokers, stations, banks, search, update).
 * - UI is built with reusable components for maintainability and consistency.
 */
function InputAdvanceDataOnPermitWise() {
  const [tpNumberData, setTpNumberData] = useState();
  const [fieldStaffId, setFieldStaffId] = useState();
  const [brokerId, setBrokerId] = useState();
  const [petrolPumpId, setPetrolPumpId] = useState(152);
  const [bankDetailsId, setBankDetailsId] = useState();
  const [tpNoFindButtonDesabled, setTpNoFindButtonDesabled] = useState(false);
  // Removed unused tpNoFieldDisable state
  const [startSpneer, setStartSpneer] = useState(false);
  const { control, getValues, setValue, watch, register, handleSubmit, reset } =
    useForm();

  // Fetch select options via React Query
  const { data: allFieldStaffNames = [] } = useApiQuery({
    key: "fieldStaff",
    url: "/api/v1/get/all/field-staff-master",
    method: "get",
    select: (data) => data,
  });
  const { data: allBrokersName = [] } = useApiQuery({
    key: "brokers",
    url: "/api/v1/get/all/fleet-agent-broker-master",
    method: "get",
    select: (data) => data,
  });
  const { data: allFillingStationsName = [] } = useApiQuery({
    key: "stations",
    url: "/api/v1/get/filling-stations",
    method: "get",
    select: (data) =>
      data.map((element) => ({ nameId: element[0], name: element[1] })),
  });
  const { data: allBankDetails = [] } = useApiQuery({
    key: "banks",
    url: "/api/v1/get/all/bank-ids-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ nameId: element[0], name: element[1] })),
  });

  // Search API mutation
  const searchMutation = useApiMutation({
    key: "searchChallanAdvance",
    url: "/api/v1/get/one/challan-details/for-advance-input",
    method: "get",
    onSuccess: (response) => {
      if (!response) {
        setTpNoFindButtonDesabled(false);
        reset();
        Swal.fire({
          icon: "error",
          title: "No TP Found",
          confirmButtonText: "OK",
        });
      } else {
        // Removed setTpNoFieldDisable (unused)
        // Set all form values as per business logic
        setValue("tpNumber", tpNumberData ? tpNumberData.name : null);
        setValue("challanDate", response.permit_date || null);
        setValue("vehicleNumber", response.truck_number || "");
        setValue(
          "loadingQty",
          response.load_weight
            ? parseFloat(Number(response.load_weight)).toFixed(3)
            : 0.0
        );
        setValue(
          "vehicleRate",
          response.challan_vehicle_rate
            ? parseFloat(Number(response.challan_vehicle_rate)).toFixed(2)
            : parseFloat(Number(response.permit_vehicle_rate)).toFixed(2)
        );
        setValue("loadingPoint", response.loading_point_name || "");
        setValue("destination", response.un_loading_point_name || "");
        setValue(
          "paymentRate",
          response.payment_rate
            ? parseFloat(Number(response.payment_rate)).toFixed(2)
            : response.challan_vehicle_rate
            ? parseFloat(Number(response.challan_vehicle_rate)).toFixed(2)
            : parseFloat(Number(response.permit_vehicle_rate)).toFixed(2)
        );
        setValue("challanNumber", response.challan_number || "");
        setValue("invNumber", response.inv_number || "");
        setValue(
          "driverWelfare",
          response.driver_welfare
            ? parseFloat(Number(response.driver_welfare)).toFixed(2)
            : 0.0
        );
        setValue("vehicleType", response.truck_type || "");
        setFieldStaffId(response.field_staff_id);
        setValue(
          "cashAdv",
          response.cash_advance
            ? parseFloat(Number(response.cash_advance)).toFixed(2)
            : 0.0
        );
        setValue(
          "bankAdv",
          response.bank_advance
            ? parseFloat(Number(response.bank_advance)).toFixed(2)
            : 0.0
        );
        setValue(
          "cashAndBank",
          parseFloat(
            Number(getValues("cashAdv")) + Number(getValues("bankAdv"))
          ).toFixed(2)
        );
        setValue("paymentDate", response.payment_date || null);
        setBankDetailsId(response.from_bank_id);
        setValue("mode", response.mode);
        if (response.mode === "cheque") {
          setValue("chequeNo", response.cheque_no);
          setValue("chequeDate", response.cheque_date);
        }
        setValue("remark", response.remark || "");
        setPetrolPumpId(response.petrol_pump_id);
        setValue("diesselSlipNo", response.issue_slip || "");
        setValue(
          "diesselCash",
          response.hsd_advance
            ? parseFloat(Number(response.hsd_advance)).toFixed(2)
            : 0.0
        );
        setBrokerId(response.agent_broker_id);
        setValue(
          "otherDed",
          response.other_deduction
            ? parseFloat(Number(response.other_deduction)).toFixed(2)
            : 0.0
        );
        setValue("towards", response.deduction_towards || "");
        setValue(
          "totalAdv",
          parseFloat(
            Number(getValues("cashAdv")) +
              Number(getValues("bankAdv")) +
              Number(getValues("diesselCash"))
          ).toFixed(2)
        );
        setTpNoFindButtonDesabled(false);
      }
    },
    onError: () => {
      setTpNoFindButtonDesabled(false);
      reset();
      Swal.fire({
        icon: "error",
        title: "No TP Found",
        confirmButtonText: "OK",
      });
    },
  });

  // Update API mutation
  const updateMutation = useApiMutation({
    key: "updateAdvanceData",
    url: "/api/v1/update/one/advance-data",
    method: "post",
    onSuccess: (response) => {
      setStartSpneer(false);
      if (response === "updated") {
        Swal.fire({
          icon: "success",
          title: "Successfully Updated!",
          confirmButtonText: "close",
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "Something Went Wrong!!",
          confirmButtonText: "close",
        });
      }
    },
    onError: () => {
      setStartSpneer(false);
      Swal.fire({
        icon: "error",
        text: "Some Error Occured!!",
        confirmButtonText: "close",
      });
    },
  });

  // Form submit handler
  const handleAdvancedDataSubmit = async (data) => {
    setStartSpneer(true);
    if (!data.tpNumber) {
      setStartSpneer(false);
      return;
    }
    updateMutation.mutate(data);
  };

  // TP number search handler
  const handleGetDataByTpNo = async () => {
    setTpNoFindButtonDesabled(true);
    const tpNo = getValues("tpNumber") || tpNumberData?.name;
    if (!tpNo) {
      setTpNoFindButtonDesabled(false);
      Swal.fire({ title: "Please Enter TP Number", confirmButtonText: "OK" });
      reset();
      return;
    }
    const formattedTpNum = tpNo.replace(/\//g, "_");
    searchMutation.mutate(formattedTpNum);
  };

  // New/Clear handler
  const handleNew = () => {
    reset();
    // Removed setTpNoFieldDisable (unused)
    setStartSpneer(false);
  };

  // Form value calculations
  const cashAdv = watch("cashAdv");
  const bankAdv = watch("bankAdv");
  const diesselCash = watch("diesselCash");
  useEffect(() => {
    setValue(
      "cashAndBank",
      parseFloat(
        Number(getValues("cashAdv")) + Number(getValues("bankAdv"))
      ).toFixed(2)
    );
    setValue(
      "totalAdv",
      parseFloat(
        Number(getValues("cashAdv")) +
          Number(getValues("bankAdv")) +
          Number(getValues("diesselCash"))
      ).toFixed(2)
    );
  }, [cashAdv, bankAdv, diesselCash, getValues, setValue]);

  const mode = watch("mode");
  useEffect(() => {
    if (mode !== "cheque") {
      setValue("chequeNo", "");
      setValue("chequeDate", null);
    }
  }, [mode, setValue]);

  return (
    <div className="work-space-container">
      <ReusableCard>
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-2"
          role="alert"
        >
          <span className="mb-0 h6">Input Advance Data Challan Wise</span>
        </div>
        <form id="form" onSubmit={handleSubmit(handleAdvancedDataSubmit)}>
          <div className="form-row">
            <label htmlFor="tpNumber" className="form-label">
              Transit Pass Number
            </label>
            <div className="row">
              <div className="col-auto">
                <AutoComplete
                  placeholder={"Search here"}
                  url={"/api/v1/get/tp-number?keyword="}
                  datakey={"name"}
                  customLoading={<>Loading..</>}
                  onSelect={(res) => setTpNumberData(res)}
                  onChange={() => {}}
                  onBlur={() => {}}
                  onFocus={() => {}}
                  customStyles={{}}
                />
                <ReusableInput
                  hidden={true}
                  type="text"
                  id="tpNumber"
                  name="tpNumber"
                  value={tpNumberData ? tpNumberData.name : ""}
                  {...register("tpNumber")}
                />
              </div>
              <div className="col-auto">
                <ReusableButton
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleGetDataByTpNo}
                  disabled={tpNoFindButtonDesabled}
                >
                  Find
                </ReusableButton>
              </div>
              <div className="col-auto">
                <ReusableButton
                  type="button"
                  variant="outline-primary"
                  size="sm"
                  onClick={handleNew}
                >
                  New
                </ReusableButton>
              </div>
            </div>
          </div>
          <hr />
          {/* first section */}
          <div className="pl-4 pr-4">
            <div className="form-row">
              <div className="form-group col-md-4">
                <p htmlFor="ownerName" className="mb-2">
                  Challan Date
                </p>
                <Controller
                  name="challanDate"
                  control={control}
                  defaultValue={null}
                  render={({ field }) => (
                    <DatePicker
                      placeholderText="Select date"
                      className="date-picker-input pl-2"
                      onChange={(date) =>
                        field.onChange(
                          date ? date.toISOString().split("T")[0] : ""
                        )
                      }
                      selected={field.value ? new Date(field.value) : null}
                      dateFormat="d-MMM-yyyy"
                    />
                  )}
                />
              </div>
              <div className="form-group col-md-4">
                <label
                  htmlFor="vehicleNumber"
                  className="col-form-label col-form-label-sm"
                >
                  Vehicle Number
                </label>
                <ReusableInput
                  type="text"
                  className="form-control form-control-sm custom-border w-75"
                  id="vehicleNumber"
                  name="vehicleNumber"
                  {...register("vehicleNumber")}
                />
              </div>
              <div className="form-group col-md-4">
                <label
                  htmlFor="loadingQty"
                  className="col-form-label col-form-label-sm"
                >
                  Loading Quantity
                </label>
                <ReusableInput
                  type="number"
                  className="form-control form-control-sm custom-border w-75"
                  id="loadingQty"
                  name="loadingQty"
                  {...register("loadingQty")}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label
                  htmlFor="vehicleRate"
                  className="col-form-label col-form-label-sm"
                >
                  Vehicle Rate
                </label>
                <ReusableInput
                  type="number"
                  className="form-control form-control-sm custom-border w-75"
                  id="vehicleRate"
                  name="vehicleRate"
                  {...register("vehicleRate")}
                />
              </div>
              <div className="form-group col-md-4">
                <label
                  htmlFor="loadingPoint"
                  className="col-form-label col-form-label-sm"
                >
                  Loading Point
                </label>
                <ReusableInput
                  type="text"
                  className="form-control form-control-sm custom-border w-75"
                  id="loadingPoint"
                  name="loadingPoint"
                  {...register("loadingPoint")}
                />
              </div>
              <div className="form-group col-md-4">
                <label
                  htmlFor="destination"
                  className="col-form-label col-form-label-sm"
                >
                  Destination
                </label>
                <ReusableInput
                  type="text"
                  className="form-control form-control-sm custom-border w-75"
                  id="destination"
                  name="destination"
                  {...register("destination")}
                />
              </div>
            </div>
          </div>
          <hr />
          {/* first row */}
          <div className="form-row mt-2">
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="paymentRate"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Payment Rate
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="paymentRate"
                    name="paymentRate"
                    {...register("paymentRate")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="challanNumber"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Challan No
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="challanNumber"
                    name="challanNumber"
                    {...register("challanNumber")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="invNumber"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  WS/Inv No.
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="invNumber"
                    name="invNumber"
                    {...register("invNumber")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* second row */}
          <div className="form-row">
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="driverWelfare"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Driver Welfare
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="driverWelfare"
                    name="driverWelfare"
                    {...register("driverWelfare")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="vehicleType"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Vehicle Type
                </label>
                <div className="col-sm-8">
                  <ReusableSelect
                    className="form-select form-select-sm w-75 border-dark-subtle"
                    id="vehicleType"
                    name="vehicleType"
                    options={[
                      { id: "", name: "" },
                      { id: "nonunion", name: "Non-Union" },
                      { id: "union", name: "Union" },
                    ]}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.id}
                    value={watch("vehicleType")}
                    {...register("vehicleType")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="fieldStaff"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Field Staff
                </label>
                <div className="col-sm-8">
                  <ReusableSelect
                    className="form-select form-select-sm w-75 border-dark-subtle"
                    id="fieldStaff"
                    name="fieldStaff"
                    options={[{ id: "", name: "" }, ...allFieldStaffNames]}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.id}
                    value={fieldStaffId}
                    {...register("fieldStaff")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* third row */}
          <div className="form-row">
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="cashAdv"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Cash Adv.
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="cashAdv"
                    name="cashAdv"
                    {...register("cashAdv")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="bankAdv"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Bank Adv.
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="bankAdv"
                    name="bankAdv"
                    {...register("bankAdv")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="cashAndBank"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Cash & Bank
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="cashAndBank"
                    name="cashAndBank"
                    {...register("cashAndBank")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* fourth row */}
          <div className="form-row">
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="paymentDate"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Payment Date
                </label>
                <div className="col-sm-8">
                  <Controller
                    name="paymentDate"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select date"
                        className="date-picker-input pl-2 w-75"
                        onChange={(date) =>
                          field.onChange(
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
                        selected={field.value ? new Date(field.value) : null}
                        dateFormat="d-MMM-yyyy"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="fromBank"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  From Bank
                </label>
                <div className="col-sm-8">
                  <ReusableSelect
                    className="form-select form-select-sm w-75 border-dark-subtle"
                    id="fromBank"
                    name="fromBank"
                    options={[{ nameId: "", name: "" }, ...allBankDetails]}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.nameId}
                    value={bankDetailsId}
                    {...register("fromBank")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="mode"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Mode
                </label>
                <div className="col-sm-8">
                  <ReusableSelect
                    className="form-select form-select-sm w-75 border-dark-subtle"
                    id="mode"
                    name="mode"
                    options={[
                      { id: "", name: "" },
                      { id: "net", name: "On Net" },
                      { id: "cheque", name: "Cheque" },
                    ]}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.id}
                    value={watch("mode")}
                    {...register("mode")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* fifth row */}
          <div className="form-row">
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="chequeNo"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Cheque No
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="chequeNo"
                    name="chequeNo"
                    disabled={watch("mode") === "cheque" ? false : true}
                    {...register("chequeNo")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="chequeDate"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Cheque Date
                </label>
                <div className="col-sm-8">
                  <Controller
                    name="chequeDate"
                    control={control}
                    defaultValue={null}
                    render={({ field }) => (
                      <DatePicker
                        placeholderText="Select date"
                        className="date-picker-input pl-2 w-75"
                        onChange={(date) =>
                          field.onChange(
                            date ? date.toISOString().split("T")[0] : ""
                          )
                        }
                        selected={field.value ? new Date(field.value) : null}
                        dateFormat="d-MMM-yyyy"
                        disabled={watch("mode") === "cheque" ? false : true}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="remark"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Remark
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    as="textarea"
                    className="form-control form-control-sm custom-border w-75"
                    id="remark"
                    name="remark"
                    {...register("remark")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* sixth row */}
          <div className="form-row">
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="fillingStation"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Filling Station
                </label>
                <div className="col-sm-8">
                  <ReusableSelect
                    className="form-select form-select-sm w-75 border-dark-subtle"
                    id="fillingStation"
                    name="fillingStation"
                    options={[
                      { nameId: "", name: "" },
                      ...allFillingStationsName,
                    ]}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.nameId}
                    value={petrolPumpId}
                    {...register("fillingStation")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="diesselSlipNo"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Diessel Slip No
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="diesselSlipNo"
                    name="diesselSlipNo"
                    {...register("diesselSlipNo")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="diesselCash"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Diessel in Cash
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="diesselCash"
                    name="diesselCash"
                    {...register("diesselCash")}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* seventh row */}
          <div className="form-row">
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="agent"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Agent/Broker
                </label>
                <div className="col-sm-8">
                  <ReusableSelect
                    className="form-select form-select-sm w-75 border-dark-subtle"
                    id="agent"
                    name="agent"
                    options={[{ id: "", name: "" }, ...allBrokersName]}
                    getOptionLabel={(opt) => opt.name}
                    getOptionValue={(opt) => opt.id}
                    value={brokerId}
                    {...register("agent")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="otherDed"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Other Ded.
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="otherDed"
                    name="otherDed"
                    {...register("otherDed")}
                  />
                </div>
              </div>
            </div>
            <div className="form-group col-sm-4">
              <div className="form-group row">
                <label
                  htmlFor="towards"
                  className="col-sm-4 col-form-label col-form-label-sm"
                >
                  Towards
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    as="textarea"
                    className="form-control form-control-sm custom-border w-75"
                    id="towards"
                    name="towards"
                    {...register("towards")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-sm-6 mt-1 p-2">
              <div className="form-group row">
                <label
                  htmlFor="totalAdv"
                  className="col-sm-4 col-form-label text-black"
                >
                  Total Adv.
                </label>
                <div className="col-sm-8">
                  <ReusableInput
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="totalAdv"
                    name="totalAdv"
                    {...register("totalAdv")}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-6 text-left">
              <ReusableButton
                type="submit"
                variant="primary"
                className="m-2"
                disabled={startSpneer}
              >
                {startSpneer && <ReusableLoader size="sm" color="light" />}
                <span>Save</span>
              </ReusableButton>
              <ReusableButton
                type="button"
                variant="outline-primary"
                onClick={handleNew}
              >
                Clear
              </ReusableButton>
            </div>
          </div>
        </form>
        <ReusableToast position="bottom-center" reverseOrder={true} />
      </ReusableCard>
    </div>
  );
}

export default InputAdvanceDataOnPermitWise;
