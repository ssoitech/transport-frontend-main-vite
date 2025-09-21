import React from "react";
import AutoComplete from "../searchComponent/AutoComplete";
import { useForm, Controller } from "react-hook-form";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableInput from "../reusable/ReusableInput";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableButton from "../reusable/ReusableButton";
import ReusableCard from "../reusable/ReusableCard";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableToast from "../reusable/ReusableToast";
// import ReusableDatePicker from '../reusable/ReusableDatePicker'; // If available

/**
 * NrTruckPosting Component
 * - Uses reusable components for all UI elements
 * - API data is fetched using generic useApiQuery hook (React Query)
 * - No direct axios or Redux logic
 * - SOLID/DRY principles, robust error handling, maintainable code
 * - Detailed comments for major functionalities
 */
function NrTruckPosting() {
  // React Hook Form for form state management
  const { register, handleSubmit, reset } = useForm();

  // Example: Fetch truck posting data using generic React Query hook
  const {
    data: truckData,
    error,
    isLoading,
  } = useApiQuery({
    key: "nr-truck-posting",
    url: "/api/v1/nr-truck-posting", // Replace with actual endpoint
    method: "get",
    enabled: true,
    select: (data) => data?.truckPostings || [], // Transform response if needed
    retry: 2,
    staleTime: 60000,
    cacheTime: 300000,
  });

  // Example: Mutation for saving truck posting (replace with actual endpoint and logic)
  const { mutate: saveTruckPosting, isLoading: isSaving } = useApiMutation({
    key: "save-nr-truck-posting",
    url: "/api/v1/nr-truck-posting", // Replace with actual endpoint
    method: "post",
    onSuccess: () => {
      ReusableToast.success("Truck posting saved successfully!");
      reset();
    },
    onError: () => {
      ReusableToast.error("Error saving truck posting.");
    },
  });

  // Handler for form submit
  const onSubmit = (formData) => {
    saveTruckPosting(formData);
  };

  return (
    <div className="work-space-container">
      <ReusableCard title="NR Truck Posting">
        {/* Alert Section */}
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">NR Truck Posting</span>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div className="row">
              <div className="col-12 col-md-5">
                {/* Transit Pass Number Search */}
                <ReusableInput
                  label="Transit Pass Number"
                  id="tpNumber"
                  {...register("tpNumber")}
                />
                <AutoComplete
                  placeholder={"Search here"}
                  url={"/api/v1/get/tp-number?keyword="}
                  datakey={"name"}
                  customLoading={<ReusableLoader />}
                  onChange={() => {}}
                  onBlur={() => {}}
                  onFocus={() => {}}
                  customStyles={{}}
                />
                <ReusableButton
                  label="Find"
                  size="sm"
                  variant="primary"
                  className="mb-2 w-100"
                />

                {/* Unloading Information Section */}
                <ReusableCard
                  title="Unloading Information"
                  className="mt-3"
                  style={{
                    backgroundColor: "#D6EFD8",
                    border: "1px solid #D6EFD8",
                    borderRadius: "10px",
                  }}
                >
                  <ReusableInput
                    label="Posting Date"
                    id="challanDate"
                    {...register("challanDate")}
                    type="date"
                  />
                  <ReusableSelect
                    label="Type Of Vehicle"
                    id="truckType"
                    options={[
                      { label: "Not Known", value: "nonunion" },
                      { label: "Known", value: "union" },
                    ]}
                    {...register("truckType")}
                    size="sm"
                    className="w-75 border-dark-subtle"
                  />
                  <ReusableInput
                    label="NR Cause/Note"
                    id="causeTextArea"
                    {...register("causeTextArea")}
                    type="textarea"
                    rows={4}
                    placeholder="Enter the cause here..."
                  />
                </ReusableCard>

                {/* Action Buttons */}
                <div className="container mt-3">
                  <div className="row text-center">
                    <div className="col-6 col-md-3 mb-2">
                      <ReusableButton
                        label="New"
                        size="sm"
                        variant="primary"
                        className="w-100"
                      />
                    </div>
                    <div className="col-6 col-md-3 mb-2">
                      <ReusableButton
                        label="Save"
                        size="sm"
                        variant="secondary"
                        className="w-100"
                        type="submit"
                        isLoading={isSaving}
                      />
                    </div>
                    <div className="col-6 col-md-3 mb-2">
                      <ReusableButton
                        label="Delete"
                        size="sm"
                        variant="danger"
                        className="w-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-7">
                <ReusableCard
                  title="Loading Information"
                  className="p-3"
                  style={{
                    backgroundColor: "#D6EFD8",
                    border: "1px solid #D6EFD8",
                    borderRadius: "10px",
                  }}
                >
                  <ReusableInput
                    label="Loading Date"
                    id="loadingDate"
                    {...register("loadingDate")}
                    type="date"
                  />
                  <ReusableSelect
                    label="Mines/Crusher"
                    id="mines"
                    options={[
                      { label: "Not Known", value: "nonunion" },
                      { label: "Known", value: "union" },
                    ]}
                    {...register("mines")}
                    size="sm"
                    className="w-75 border-dark-subtle"
                  />
                  <ReusableSelect
                    label="Exporter"
                    id="exporter"
                    options={[
                      { label: "Not Known", value: "nonunion" },
                      { label: "Known", value: "union" },
                    ]}
                    {...register("exporter")}
                    size="sm"
                    className="w-75 border-dark-subtle"
                  />
                  <ReusableSelect
                    label="Loading Point"
                    id="loadingPoint"
                    options={[
                      { label: "Not Known", value: "nonunion" },
                      { label: "Known", value: "union" },
                    ]}
                    {...register("loadingPoint")}
                    size="sm"
                    className="w-75 border-dark-subtle"
                  />
                  <ReusableSelect
                    label="Unloading Point"
                    id="unloadingPoint"
                    options={[
                      { label: "Not Known", value: "nonunion" },
                      { label: "Known", value: "union" },
                    ]}
                    {...register("unloadingPoint")}
                    size="sm"
                    className="w-75 border-dark-subtle"
                  />
                  <ReusableSelect
                    label="Material"
                    id="material"
                    options={[
                      { label: "Not Known", value: "nonunion" },
                      { label: "Known", value: "union" },
                    ]}
                    {...register("material")}
                    size="sm"
                    className="w-75 border-dark-subtle"
                  />
                  <ReusableInput
                    label="Challan No"
                    id="challanNo"
                    {...register("challanNo")}
                  />
                  <ReusableInput
                    label="Truck No"
                    id="truckNo"
                    {...register("truckNo")}
                  />
                  <ReusableInput
                    label="Despatched Qty"
                    id="despatchedQty"
                    {...register("despatchedQty")}
                    type="number"
                  />
                  <ReusableInput
                    label="HSD Issued"
                    id="hsdIssued"
                    {...register("hsdIssued")}
                    type="number"
                  />
                  <ReusableInput
                    label="Advance"
                    id="Advance"
                    {...register("Advance")}
                    type="number"
                  />
                  <ReusableInput
                    label="Driver Welfare Comm."
                    id="driverWelfare"
                    {...register("driverWelfare")}
                    type="number"
                  />
                  <ReusableInput
                    label="Challan Amt Collected"
                    id="challanAmtCollected"
                    {...register("challanAmtCollected")}
                    type="number"
                  />
                  <ReusableInput
                    label="TP Number"
                    id="tpNumber"
                    {...register("tpNumber")}
                    type="number"
                  />
                  <ReusableInput
                    label="Trans. Rate"
                    id="transeRate"
                    {...register("transeRate")}
                    type="number"
                  />
                  <ReusableSelect
                    label="Petrol Pump"
                    id="petrolPump"
                    options={[
                      { label: "Not Known", value: "nonunion" },
                      { label: "Known", value: "union" },
                    ]}
                    {...register("petrolPump")}
                    size="sm"
                    className="w-75 border-dark-subtle"
                  />

                  <hr />
                  <ReusableInput
                    label="Owner Name"
                    id="ownerName"
                    {...register("ownerName")}
                  />
                  <ReusableInput
                    label="TDS %"
                    id="tds"
                    {...register("tds")}
                    type="number"
                  />
                </ReusableCard>

                <div className="container mt-3">
                  <div className="row">
                    <div className="col-md-6">
                      <ReusableInput
                        label="Total Owned Truck/s"
                        id="totalTrucks"
                        {...register("totalTrucks")}
                        type="number"
                      />
                    </div>
                    <div className="col-md-6">
                      <ReusableInput
                        label="Total Truck/s Loaded"
                        id="totalTruckLoaded"
                        {...register("totalTruckLoaded")}
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Loader and error handling for truck posting data */}
        {isLoading && <ReusableLoader />}
        {error && (
          <p className="text-danger">Error: {error.message || error}</p>
        )}
        {/* Display truck posting data if available */}
        {!isLoading && !error && truckData && (
          <ReusableCard title="Truck Posting Data" className="mt-4">
            {/* You can use ReusableTable or other reusable components to display truckData here */}
            {/* Example: <ReusableTable columns={columns} data={truckData} /> */}
            <pre>{JSON.stringify(truckData, null, 2)}</pre>
          </ReusableCard>
        )}
      </ReusableCard>
    </div>
  );
}

export default NrTruckPosting;
