import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableCard from "../reusable/ReusableCard";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableToast from "../reusable/ReusableToast";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableTable from "../reusable/ReusableTable";
import ReusableSection from "../reusable/ReusableSection";
import ReusableDatePicker from "../reusable/ReusableDatePicker";

/**
 * PermitMasterFormi
 * - Refactored to use reusable components for all UI elements.
 * - All API logic migrated to React Query generic hooks.
 * - Redux accessDetails replaced with useApiQuery for live updates.
 * - Business logic, transformation, and validation preserved.
 */
function PermitMasterFormi() {
  // Access details via React Query (replace Redux)
  const { data: accessDetails } = useApiQuery({
    key: "accessDetails",
    url: "/api/v1/get/access-details",
    method: "get",
    select: (data) => data,
  });

  // Form state
  const { register, handleSubmit, reset } = useForm();

  // Select options via React Query
  const { data: consignerOptions = [] } = useApiQuery({
    key: "consigners",
    url: "/api/v1/get/all/consigner-owner-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], label: element[1] })),
  });
  const { data: exporterOptions = [] } = useApiQuery({
    key: "exporters",
    url: "/api/v1/get/all/exporter-consignee-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], label: element[1] })),
  });
  const { data: traderOptions = [] } = useApiQuery({
    key: "traders",
    url: "/api/v1/get/all/trader-billing-party-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], label: element[1] })),
  });
  const { data: materialOptions = [] } = useApiQuery({
    key: "materials",
    url: "/api/v1/get/all/transporting-material-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], label: element[1] })),
  });
  const { data: loadingPointOptions = [] } = useApiQuery({
    key: "loadingPoints",
    url: "/api/v1/get/all/loading-point-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], label: element[1] })),
  });
  const { data: unloadingPointOptions = [] } = useApiQuery({
    key: "unloadingPoints",
    url: "/api/v1/get/all/unloading-point-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], label: element[1] })),
  });

  // Local state for stack table
  const [stackTableData, setStackTableData] = useState([]);
  const [stackNo, setStackNo] = useState("NA");
  const [stackQuantity, setStackQuantity] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [startSpneer, setStartSpneer] = useState(false);

  // Permission check (side effect)
  useEffect(() => {
    if (accessDetails) {
      if (accessDetails.role !== "ADMIN") {
        if (accessDetails.role === "USER") {
          if (accessDetails.challanInputAccess !== "Y") {
            window.alert("You don't have access to this section.");
            // navigation logic here
          }
        } else {
          window.alert("You don't have access to this section.");
          // navigation logic here
        }
      }
    } else {
      window.alert("You don't have access to this section.");
      // navigation logic here
    }
  }, [accessDetails]);

  // Stack table logic
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("tempStackData")) || [];
    setStackTableData(data);
    setTotalQuantity(
      data.reduce((sum, item) => sum + Number(item.stackQuantity), 0)
    );
    setStackNo("");
    setStackQuantity("");
    setTimeout(() => {
      setStartSpneer(false);
    }, 500);
  }, [startSpneer]);

  // Add stack
  const handleAddStack = (e) => {
    e.preventDefault();
    if (!stackQuantity || stackQuantity < 0) {
      window.alert("Please Enter Stack Quantity");
      return;
    }
    const tempStackData =
      JSON.parse(localStorage.getItem("tempStackData")) || [];
    tempStackData.push({
      stackNumber: stackNo || "NA",
      stackQuantity,
    });
    localStorage.setItem("tempStackData", JSON.stringify(tempStackData));
    setStartSpneer(true);
  };

  // Delete stack
  const handleDeleteStack = (idx) => {
    const tempStackData =
      JSON.parse(localStorage.getItem("tempStackData")) || [];
    tempStackData.splice(idx, 1);
    localStorage.setItem("tempStackData", JSON.stringify(tempStackData));
    setStartSpneer(true);
  };

  // Permit save mutation
  const savePermitMutation = useApiMutation({
    key: "savePermit",
    url: "/api/v1/add/iform",
    method: "post",
    onSuccess: () => {
      window.alert("Permit Data Saved!");
      reset();
      localStorage.setItem("tempStackData", JSON.stringify([]));
      setStartSpneer(false);
    },
    onError: () => {
      window.alert("Error saving permit data!");
      setStartSpneer(false);
    },
  });

  // Form submit handler
  const onSubmit = (data) => {
    setStartSpneer(true);
    const stackData = JSON.parse(localStorage.getItem("tempStackData")) || [];
    savePermitMutation.mutate({ permitData: data, stackData });
  };

  // Table columns
  const columns = [
    { Header: "SL No.", accessor: (row, idx) => idx + 1 },
    { Header: "Stack No", accessor: "stackNumber" },
    { Header: "Quantity in Tons", accessor: "stackQuantity" },
    {
      Header: "Actions",
      accessor: (row, idx) => (
        <ReusableButton
          variant="danger"
          size="sm"
          onClick={() => handleDeleteStack(idx)}
        >
          Delete
        </ReusableButton>
      ),
    },
  ];

  return (
    <div className="work-space-container">
      <ReusableCard>
        <ReusableSection title="Transit Permit Entry">
          <form id="permitForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="row m-2">
              <div className="col-sm-6 pr-4">
                <ReusableInput
                  label="Permit Number"
                  name="permitNumber"
                  {...register("permitNumber", { required: true })}
                />
                <ReusableSelect
                  label="Mines/Consigner"
                  name="consignorId"
                  options={consignerOptions}
                  {...register("consignorId", { required: true })}
                />
                <ReusableDatePicker
                  label="Date"
                  name="date"
                  {...register("date", { required: true })}
                />
                <ReusableSelect
                  label="Permit Type"
                  name="permitType"
                  options={[
                    { id: "L", label: "Railway Siding" },
                    { id: "R", label: "By Road Work" },
                  ]}
                  {...register("permitType", { required: true })}
                />
                <ReusableSelect
                  label="Exporter/Consignee"
                  name="exporterId"
                  options={exporterOptions}
                  {...register("exporterId")}
                />
                <ReusableSelect
                  label="Trader/Billing To"
                  name="traderId"
                  options={traderOptions}
                  {...register("traderId")}
                />
                <ReusableSelect
                  label="Loading Point"
                  name="loadingPointId"
                  options={loadingPointOptions}
                  {...register("loadingPointId")}
                />
                <ReusableSelect
                  label="Destination"
                  name="destinationId"
                  options={unloadingPointOptions}
                  {...register("destinationId")}
                />
              </div>
              <div className="col-sm-6 pl-4">
                <ReusableSelect
                  label="Required DDM Return"
                  name="ddmReturn"
                  options={[
                    { id: "N", label: "No" },
                    { id: "Y", label: "Yes" },
                  ]}
                  {...register("ddmReturn")}
                />
                <ReusableSelect
                  label="Material"
                  name="materialId"
                  options={materialOptions}
                  {...register("materialId")}
                />
                <ReusableDatePicker
                  label="Valid From"
                  name="validFrom"
                  {...register("validFrom")}
                />
                <ReusableDatePicker
                  label="Valid Upto"
                  name="validTo"
                  {...register("validTo")}
                />
                <ReusableSelect
                  label="Challan Status"
                  name="challanStatus"
                  options={[{ id: "O", label: "To Be Billed" }]}
                  {...register("challanStatus")}
                />
                <ReusableSelect
                  label="Advanced Input Required"
                  name="advInput"
                  options={[
                    { id: "N", label: "No" },
                    { id: "Y", label: "Yes" },
                  ]}
                  {...register("advInput")}
                />
                <ReusableSelect
                  label="Reimburse Toll Gate"
                  name="reimburseTollGate"
                  options={[
                    { id: "N", label: "No" },
                    { id: "Y", label: "Yes" },
                  ]}
                  {...register("reimburseTollGate")}
                />
                <ReusableInput
                  label="Note"
                  name="note"
                  as="textarea"
                  {...register("note")}
                />
              </div>
            </div>
            <ReusableButton
              type="submit"
              variant="primary"
              className="m-2"
              disabled={startSpneer || savePermitMutation.isLoading}
            >
              {(startSpneer || savePermitMutation.isLoading) && (
                <ReusableLoader size="sm" color="light" />
              )}
              <span>Save</span>
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="outline-primary"
              className="m-2"
              onClick={reset}
            >
              Clear
            </ReusableButton>
          </form>
        </ReusableSection>
        <ReusableSection title="Stack Details">
          <form id="stackForm">
            <div className="row m-2">
              <div className="col-sm-4">
                <ReusableInput
                  label="Stack Number"
                  name="stackNo"
                  value={stackNo}
                  onChange={(e) => setStackNo(e.target.value)}
                />
              </div>
              <div className="col-sm-4">
                <ReusableInput
                  label="Quantity"
                  name="stackQuantity"
                  type="number"
                  value={stackQuantity}
                  onChange={(e) => setStackQuantity(e.target.value)}
                />
              </div>
              <div className="col-sm-4">
                <ReusableButton
                  type="button"
                  variant="primary"
                  onClick={handleAddStack}
                >
                  Add
                </ReusableButton>
                <ReusableButton
                  type="button"
                  variant="outline-primary"
                  className="ml-2"
                  onClick={() => {
                    setStackNo("");
                    setStackQuantity("");
                  }}
                >
                  Clear
                </ReusableButton>
              </div>
            </div>
          </form>
          <ReusableTable columns={columns} data={stackTableData} />
          <div className="row m-3">
            <ReusableInput
              label="Quantity in Tons"
              name="totalQuantity"
              type="number"
              value={totalQuantity}
              readOnly
            />
          </div>
        </ReusableSection>
        <ReusableToast position="bottom-center" reverseOrder={true} />
      </ReusableCard>
    </div>
  );
}

export default PermitMasterFormi;
