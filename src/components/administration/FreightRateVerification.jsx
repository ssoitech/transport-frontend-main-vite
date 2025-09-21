import React from "react";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableCard from "../../components/reusable/ReusableCard";
import ReusableTable from "../../components/reusable/ReusableTable";
import ReusableLoader from "../../components/reusable/ReusableLoader";

/**
 * FreightRateVerification - World-class, robust, maintainable component
 * - Uses reusable card and table for layout and data display
 * - API logic separated using generic React Query hook (SOLID/DRY)
 * - No Redux or direct axios logic
 * - Detailed comments for major functionality
 */
function FreightRateVerification() {
  // Fetch freight rate data using generic useApiQuery hook
  const {
    data: freightRates = [],
    isLoading,
    isError,
    error,
  } = useApiQuery({
    key: "freightRateVerification",
    url: "/api/v1/freight-rate-verification", // Replace with actual endpoint
    method: "get",
  });

  // Table columns for ReusableTable
  const columns = [
    { header: "Rate ID", accessor: "rateId" },
    { header: "Source", accessor: "source" },
    { header: "Destination", accessor: "destination" },
    { header: "Rate", accessor: "rate" },
    { header: "Effective Date", accessor: "effectiveDate" },
    // Add more columns as needed
  ];

  // Render row for ReusableTable
  const renderRow = (row) => (
    <tr key={row.rateId}>
      <td>{row.rateId}</td>
      <td>{row.source}</td>
      <td>{row.destination}</td>
      <td>{row.rate}</td>
      <td>{row.effectiveDate}</td>
      {/* Add more cells as needed */}
    </tr>
  );

  return (
    <div className="work-space-container">
      <ReusableCard title="Freight Rate Verification">
        {isLoading ? (
          <ReusableLoader />
        ) : isError ? (
          <div className="text-danger">
            {error?.message || "Error loading freight rates."}
          </div>
        ) : (
          <ReusableTable
            columns={columns}
            data={freightRates}
            renderRow={renderRow}
            className="table table-bordered table-hover"
            ariaLabel="Freight Rate Verification Table"
          />
        )}
      </ReusableCard>
    </div>
  );
}

export default FreightRateVerification;
