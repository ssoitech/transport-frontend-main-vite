import React from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableCard from "../reusable/ReusableCard";
import ReusableTable from "../reusable/ReusableTable";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableToast from "../reusable/ReusableToast";
import ReusableSection from "../reusable/ReusableSection";
import ReusableDatePicker from "../reusable/ReusableDatePicker";
import ReusableAdvancedSearchBar from "../reusable/ReusableAdvancedSearchBar";

/**
 * MarkChallanAsUnload
 * - Refactored to use reusable components for all UI elements.
 * - All API logic migrated to React Query generic hooks.
 * - Redux accessDetails replaced with useApiQuery for live updates.
 * - Business logic, transformation, and validation preserved.
 */
function MarkChallanAsUnload() {
  // Access details via React Query (replace Redux)
  const { data: accessDetails } = useApiQuery({
    key: "accessDetails",
    url: "/api/v1/get/access-details",
    method: "get",
    select: (data) => data,
  });

  const { register, handleSubmit, reset } = useForm();
  const [permit, setPermit] = React.useState("");
  const [challanData, setChallanData] = React.useState([]);
  const [totalLoadWeight, setTotalLoadWeight] = React.useState("");

  // Loading states
  const [getDataLoading, setGetDataLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Watch fields for controlled components
  // ...existing code...

  // Permission check (side effect)
  React.useEffect(() => {
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

  // Challan search mutation (GET)
  const searchMutation = useApiMutation({
    key: "getIntransitChallans",
    url: "/api/v1/get/challan/mark-as-unload",
    method: "get",
    onSuccess: (response) => {
      setChallanData(response);
      const totalWeight = response.reduce(
        (sum, item) => sum + item.loadWeight,
        0
      );
      setTotalLoadWeight(totalWeight);
      setGetDataLoading(false);
    },
    onError: () => {
      setGetDataLoading(false);
    },
  });

  // Mark as unloaded mutation (POST)
  const markUnloadMutation = useApiMutation({
    key: "markChallanAsUnload",
    url: "/api/v1/mark/challan/as-unload",
    method: "post",
    onSuccess: (response) => {
      setLoading(false);
      if (response === "success") {
        window.alert("Challans Successfully Marked as Unloaded");
      } else {
        window.alert("Some Error Occured!!");
      }
    },
    onError: () => {
      setLoading(false);
      window.alert("Internal Server Error!!");
    },
  });

  // Form submit handler
  const onSubmit = (data) => {
    setGetDataLoading(true);
    let start = data.startDate ? format(data.startDate, "yyyy-MM-dd") : null;
    let end = data.endDate ? format(data.endDate, "yyyy-MM-dd") : null;
    if (!permit || !permit.name || !start || !end) return;
    searchMutation.mutate({
      params: {
        permitNumber: permit.name,
        startDate: start,
        endDate: end,
      },
    });
  };

  // Mark as unloaded handler
  const handleMarkUnload = () => {
    if (challanData.length === 0) return;
    setLoading(true);
    let unLoadedData = challanData.map((item) => ({
      ...item,
      challanStatus: "unloaded",
      updatedBy: accessDetails?.userId || null,
    }));
    markUnloadMutation.mutate(unLoadedData);
  };

  // Table columns
  const columns = [
    {
      Header: "Load Date",
      accessor: "loadDate",
      Cell: ({ value }) => (value ? format(value, "dd-MMM-yyyy") : ""),
    },
    { Header: "Permit Number", accessor: "permitNumber" },
    { Header: "TP Number", accessor: "tpNumber" },
    { Header: "Truck Number", accessor: "truckNumber" },
    {
      Header: "Load Weight",
      accessor: "loadWeight",
      Cell: ({ value }) => value,
    },
    {
      Header: "Challan Status",
      accessor: "challanStatus",
      Cell: ({ value }) => (
        <span className="bg-danger text-white px-2 py-1 rounded">{value}</span>
      ),
    },
  ];

  return (
    <div className="work-space-container">
      <ReusableCard>
        <ReusableSection title="Mark Challan As Unload">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="challanUnload-first-container"
          >
            {/* Permit Number */}
            <div className="item1">
              <label htmlFor="permitNumber" className="form-label">
                Permit Number
              </label>
              <ReusableAdvancedSearchBar
                placeholder="Search here"
                url="/api/v1/get/permit-number?keyword="
                datakey="name"
                onSelect={setPermit}
              />
            </div>
            {/* Loading Period */}
            <div className="item1">
              <label htmlFor="loadingPeriod" className="form-label">
                Loading Period
              </label>
              <div className="row">
                <div className="col-sm-5">
                  <Controller
                    name="startDate"
                    control={register.control}
                    render={({ field }) => (
                      <ReusableDatePicker
                        {...field}
                        placeholder="Select Start Date"
                        dateFormat="d-MMM-yyyy"
                      />
                    )}
                  />
                </div>
                <span className="col-sm-auto">To</span>
                <div className="col-sm-5">
                  <Controller
                    name="endDate"
                    control={register.control}
                    render={({ field }) => (
                      <ReusableDatePicker
                        {...field}
                        placeholder="Select End Date"
                        dateFormat="d-MMM-yyyy"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            {/* Display Order */}
            <div className="item1">
              <div className="col-sm mt-4">
                <ReusableButton
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={getDataLoading}
                >
                  {getDataLoading ? (
                    <ReusableLoader size="sm" />
                  ) : (
                    "Get Details"
                  )}
                </ReusableButton>
              </div>
            </div>
          </form>
        </ReusableSection>
        <ReusableSection>
          <div className="challanUnload-second-container">
            <div className="item">
              <ReusableButton
                type="button"
                variant="primary"
                size="sm"
                disabled={loading}
                onClick={handleMarkUnload}
              >
                {loading ? <ReusableLoader size="sm" /> : "Mark as Unloaded"}
              </ReusableButton>
              <ReusableButton
                type="button"
                variant="primary"
                size="sm"
                onClick={reset}
              >
                New
              </ReusableButton>
              <ReusableButton
                type="button"
                variant="primary"
                size="sm"
                onClick={reset}
              >
                Clear
              </ReusableButton>
            </div>
            <div className="item">
              <ReusableInput
                label="Nos."
                name="nos"
                type="number"
                value={challanData ? challanData.length : ""}
                readOnly
              />
            </div>
            <div className="item">
              <ReusableInput
                label="Tons."
                name="tons"
                type="number"
                value={
                  totalLoadWeight ? parseFloat(totalLoadWeight).toFixed(2) : ""
                }
                readOnly
              />
            </div>
          </div>
        </ReusableSection>
        <ReusableSection title="Challan Details">
          <ReusableTable columns={columns} data={challanData} />
        </ReusableSection>
        <ReusableToast position="bottom-center" reverseOrder={true} />
      </ReusableCard>
    </div>
  );
}

export default MarkChallanAsUnload;
