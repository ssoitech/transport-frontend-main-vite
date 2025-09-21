import React from "react";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableCard from "../reusable/ReusableCard";
import ReusableTable from "../reusable/ReusableTable";
import ReusableLoader from "../reusable/ReusableLoader";

/**
 * ManageLedgerCustomer Component
 * - Uses reusable components for all UI elements
 * - API data is fetched using generic useApiQuery hook (React Query)
 * - No direct axios or Redux logic
 * - SOLID/DRY principles, robust error handling, maintainable code
 * - Detailed comments for major functionalities
 */
function ManageLedgerCustomer() {
  // Fetch ledger customer data using generic React Query hook
  const {
    data: ledgerData,
    error,
    isLoading,
  } = useApiQuery({
    key: "ledger-customer",
    url: "/api/v1/ledger-customer", // Replace with actual endpoint
    method: "get",
    enabled: true,
    select: (data) => data?.customers || [], // Transform response if needed
    retry: 2,
    staleTime: 60000,
    cacheTime: 300000,
  });

  // Table columns definition for ReusableTable
  const columns = [
    { Header: "Customer Name", accessor: "name" },
    { Header: "Ledger Balance", accessor: "balance" },
    {
      Header: "Status",
      accessor: (row) => (row.status ? "Active" : "Inactive"),
    },
  ];

  return (
    <div className="work-space-container">
      <ReusableCard title="Manage Ledger Customer">
        {/* Loader and error handling */}
        {isLoading && <ReusableLoader />}
        {error && (
          <p className="text-danger">Error: {error.message || error}</p>
        )}
        {/* Table display */}
        {!isLoading && !error && (
          <ReusableTable
            columns={columns}
            data={ledgerData || []}
            striped
            bordered
            responsive
            className="table table-bordered table-striped"
          />
        )}
        {/* If no data available */}
        {!isLoading && !error && (!ledgerData || ledgerData.length === 0) && (
          <p className="text-warning">No ledger customer data available.</p>
        )}
      </ReusableCard>
    </div>
  );
}

export default ManageLedgerCustomer;
