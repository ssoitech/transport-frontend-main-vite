import React from "react";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableCard from "../../components/reusable/ReusableCard";
import ReusableTable from "../../components/reusable/ReusableTable";
import ReusableLoader from "../../components/reusable/ReusableLoader";

/**
 * EntryJobPerformance - World-class, robust, maintainable component
 * - Uses reusable card and table for layout and data display
 * - API logic separated using generic React Query hook (SOLID/DRY)
 * - No Redux or direct axios logic
 * - Detailed comments for major functionality
 */
function EntryJobPerformance() {
  // Fetch job performance data using generic useApiQuery hook
  const {
    data: performanceData = [],
    isLoading,
    isError,
    error,
  } = useApiQuery({
    key: "entryJobPerformance",
    url: "/api/v1/job-performance", // Replace with actual endpoint
    method: "get",
  });

  // Table columns for ReusableTable
  const columns = [
    { header: "Job ID", accessor: "jobId" },
    { header: "Employee Name", accessor: "employeeName" },
    { header: "Performance Score", accessor: "performanceScore" },
    { header: "Date", accessor: "date" },
    // Add more columns as needed
  ];

  // Render row for ReusableTable
  const renderRow = (row) => (
    <tr key={row.jobId}>
      <td>{row.jobId}</td>
      <td>{row.employeeName}</td>
      <td>{row.performanceScore}</td>
      <td>{row.date}</td>
      {/* Add more cells as needed */}
    </tr>
  );

  return (
    <div className="work-space-container">
      <ReusableCard title="Entry Job Performance">
        {isLoading ? (
          <ReusableLoader />
        ) : isError ? (
          <div className="text-danger">
            {error?.message || "Error loading job performance."}
          </div>
        ) : (
          <ReusableTable
            columns={columns}
            data={performanceData}
            renderRow={renderRow}
            className="table table-bordered table-hover"
            ariaLabel="Entry Job Performance Table"
          />
        )}
      </ReusableCard>
    </div>
  );
}

export default EntryJobPerformance;
