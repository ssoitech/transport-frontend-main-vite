import React from "react";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableCard from "../reusable/ReusableCard";
import ReusableTable from "../reusable/ReusableTable";
import ReusableLoader from "../reusable/ReusableLoader";

/**
 * StopPaymentProcess Component
 * - Uses reusable components for all UI elements
 * - API data is fetched using generic useApiQuery hook (React Query)
 * - No direct axios or Redux logic
 * - SOLID/DRY principles, robust error handling, maintainable code
 * - Detailed comments for major functionalities
 */
function StopPaymentProcess() {
  // Fetch stop payment process data using generic React Query hook
  const {
    data: stopPaymentData,
    error,
    isLoading,
  } = useApiQuery({
    key: "stop-payment-process",
    url: "/api/v1/stop-payment-process", // Replace with actual endpoint
    method: "get",
    enabled: true,
    select: (data) => data?.processes || [], // Transform response if needed
    retry: 2,
    staleTime: 60000,
    cacheTime: 300000,
  });

  // Table columns definition for ReusableTable
  const columns = [
    { Header: "Process ID", accessor: "id" },
    { Header: "Customer Name", accessor: "customerName" },
    { Header: "Amount", accessor: "amount" },
    {
      Header: "Status",
      accessor: (row) => (row.status ? "Stopped" : "Active"),
    },
  ];

  return (
    <div className="work-space-container">
      <ReusableCard title="Stop Payment Process">
        {/* Loader and error handling */}
        {isLoading && <ReusableLoader />}
        {error && (
          <p className="text-danger">Error: {error.message || error}</p>
        )}
        {/* Table display */}
        {!isLoading && !error && (
          <ReusableTable
            columns={columns}
            data={stopPaymentData || []}
            striped
            bordered
            responsive
            className="table table-bordered table-striped"
          />
        )}
        {/* If no data available */}
        {!isLoading &&
          !error &&
          (!stopPaymentData || stopPaymentData.length === 0) && (
            <p className="text-warning">
              No stop payment process data available.
            </p>
          )}
      </ReusableCard>
    </div>
  );
}

export default StopPaymentProcess;
