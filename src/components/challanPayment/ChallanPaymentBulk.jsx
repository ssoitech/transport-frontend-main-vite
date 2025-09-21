import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import ReferenceWiseList from "./challanPaymentBulkSections/ReferenceWiseList";
import ChallanWiseList from "./challanPaymentBulkSections/ChallanWiseList";
import OwnerWiseList from "./challanPaymentBulkSections/OwnerWiseList";
// Reusable components
import ReusableCard from "../reusable/ReusableCard";
import ReusableDatePicker from "../reusable/ReusableDatePicker";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableButton from "../reusable/ReusableButton";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableToast from "../reusable/ReusableToast";
// React Query generic hook
import { useApiQuery } from "../../hooks/api/useApiQuery";

/**
 * ChallanPaymentBulk: Bulk reference payment UI for challans.
 * - Uses reusable components for form, select, date picker, button, and card.
 * - Migrates API logic to useApiQuery for fetching dropdown data.
 * - Business logic for transformation and validation is preserved.
 */
function ChallanPaymentBulk() {
  // Fetch dropdown data using React Query generic hook
  const {
    data: collectionCenters,
    isLoading: isLoadingCenters,
    isError: isErrorCenters,
    error: errorCenters,
  } = useApiQuery({
    key: "collectionCenters",
    url: "/api/v1/get/all/collection-center-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });
  const {
    data: unloadingPoints,
    isLoading: isLoadingUnloading,
    isError: isErrorUnloading,
    error: errorUnloading,
  } = useApiQuery({
    key: "unloadingPoints",
    url: "/api/v1/get/all/unloading-point-names",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });
  const {
    data: appUsers,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
  } = useApiQuery({
    key: "appUsers",
    url: "/api/v1/get/all/usernames-and-ids",
    method: "get",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });

  // Form state
  const [formValues, setFormValues] = useState({
    receivedFromDate: null,
    receivedToDate: null,
    unloadingPoint: "",
    user: "",
    collectionCenter: "",
    orderBy: "",
  });

  // Handle input changes
  const handleInputChange = (name, value) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  // Options for order by select
  const orderByOptions = [
    { label: "Reference Number", value: "" },
    { label: "Challan Holder", value: "challanHolder" },
    { label: "Received Date", value: "receivedDate" },
    { label: "Payble Amount", value: "paybleAmount" },
    { label: "Collection Center", value: "collectionCenter" },
    { label: "Entry Date", value: "entryDate" },
  ];

  return (
    <div className="work-space-container">
      <ReusableCard style={{ marginBottom: 16, padding: 16 }}>
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">Challan Payment - Bulk Reference</span>
        </div>
        {/* Loader and error toasts for dropdowns */}
        {(isLoadingCenters || isLoadingUnloading || isLoadingUsers) && (
          <ReusableLoader message="Loading dropdowns..." />
        )}
        {(isErrorCenters || isErrorUnloading || isErrorUsers) && (
          <ReusableToast
            type="error"
            message={
              errorCenters?.message ||
              errorUnloading?.message ||
              errorUsers?.message ||
              "Error loading dropdowns"
            }
            autoClose={false}
          />
        )}
        <form>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            {/* Received Date From */}
            <div style={{ minWidth: 220 }}>
              <label htmlFor="receivedFromDate">
                Challan Received Date From
              </label>
              <ReusableDatePicker
                id="receivedFromDate"
                name="receivedFromDate"
                value={formValues.receivedFromDate}
                onChange={(date) => handleDateChange("receivedFromDate", date)}
                required
                size="sm"
                placeholder="Select a date"
              />
            </div>
            {/* Received Date To */}
            <div style={{ minWidth: 220 }}>
              <label htmlFor="receivedToDate">Date To</label>
              <ReusableDatePicker
                id="receivedToDate"
                name="receivedToDate"
                value={formValues.receivedToDate}
                onChange={(date) => handleDateChange("receivedToDate", date)}
                required
                size="sm"
                placeholder="Select a date"
              />
            </div>
            {/* Unloading Point */}
            <div style={{ minWidth: 220 }}>
              <label htmlFor="unloadingPoint">Un-Loading Point</label>
              <ReusableSelect
                id="unloadingPoint"
                name="unloadingPoint"
                options={
                  unloadingPoints
                    ? [
                        { label: "All Unloading Points", value: "" },
                        ...unloadingPoints.map((item) => ({
                          label: item.name,
                          value: item.id,
                        })),
                      ]
                    : [{ label: "", value: "" }]
                }
                value={formValues.unloadingPoint}
                onChange={(value) => handleInputChange("unloadingPoint", value)}
                size="sm"
              />
            </div>
            {/* User */}
            <div style={{ minWidth: 180 }}>
              <label htmlFor="user">Select User</label>
              <ReusableSelect
                id="user"
                name="user"
                options={
                  appUsers
                    ? [
                        { label: "All Users", value: "" },
                        ...appUsers.map((item) => ({
                          label: item.name,
                          value: item.id,
                        })),
                      ]
                    : [{ label: "", value: "" }]
                }
                value={formValues.user}
                onChange={(value) => handleInputChange("user", value)}
                size="sm"
              />
            </div>
            {/* Collection Center */}
            <div style={{ minWidth: 220 }}>
              <label htmlFor="collectionCenter">Collection Center</label>
              <ReusableSelect
                id="collectionCenter"
                name="collectionCenter"
                options={
                  collectionCenters
                    ? [
                        { label: "All Collection Center", value: "" },
                        ...collectionCenters.map((item) => ({
                          label: item.name,
                          value: item.id,
                        })),
                      ]
                    : [{ label: "", value: "" }]
                }
                value={formValues.collectionCenter}
                onChange={(value) =>
                  handleInputChange("collectionCenter", value)
                }
                size="sm"
              />
            </div>
            {/* Order By */}
            <div style={{ minWidth: 180 }}>
              <label htmlFor="orderBy">Order By</label>
              <ReusableSelect
                id="orderBy"
                name="orderBy"
                options={orderByOptions}
                value={formValues.orderBy}
                onChange={(value) => handleInputChange("orderBy", value)}
                size="sm"
              />
            </div>
            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <ReusableButton
                type="button"
                variant="primary"
                size="sm"
                style={{ marginTop: 24 }}
              >
                Proceed
              </ReusableButton>
              <ReusableButton
                type="button"
                variant="outline-primary"
                size="sm"
                style={{ marginTop: 24 }}
              >
                Clear
              </ReusableButton>
            </div>
          </div>
        </form>
      </ReusableCard>
      <hr />
      <div>
        <Tabs
          defaultActiveKey="reference-wise"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="reference-wise" title="Reference-Wise List">
            <ReferenceWiseList formValues={formValues} />
          </Tab>
          <Tab eventKey="challan-wise" title="Challan-Wise List">
            <ChallanWiseList formValues={formValues} />
          </Tab>
          <Tab eventKey="Owner-wise" title="Owner-Wise List">
            <OwnerWiseList formValues={formValues} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default ChallanPaymentBulk;
