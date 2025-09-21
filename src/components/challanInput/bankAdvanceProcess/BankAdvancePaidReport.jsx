import React from "react";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableSection from "../../reusable/ReusableSection";
import ReusableTable from "../../reusable/ReusableTable";
import ReusableLoader from "../../reusable/ReusableLoader";
import { useApiQuery } from "../../../hooks/api/useApiQuery";

/**
 * BankAdvancePaidReport Component
 * - Refactored to use reusable card, section, table, and loader components
 * - API logic for report data uses generic useApiQuery hook (SOLID, DRY)
 * - Follows world-class coding standards and maintainability
 */
function BankAdvancePaidReport() {
  // Example: Fetch report data using React Query generic hook
  const {
    data: reportData,
    isLoading,
    error,
  } = useApiQuery({
    key: "bank-advance-paid-report",
    url: "/api/bank-advance-paid-report", // Replace with actual endpoint
    method: "get",
    select: (data) => data || [],
  });

  // Table columns for report
  const columns = [
    { Header: "TP Number", accessor: "tpNumber" },
    { Header: "Vehicle Number", accessor: "vehicleNumber" },
    { Header: "Paid Amount", accessor: "paidAmount" },
    { Header: "Payment Type", accessor: "paymentType" },
    { Header: "Bank Name", accessor: "bankName" },
    { Header: "Paid On", accessor: "paidOn" },
    { Header: "Status", accessor: "status" },
  ];

  return (
    <ReusableSection title="Bank Advance Paid Report">
      <ReusableCard>
        {/* Loader for async data */}
        {isLoading && <ReusableLoader />}
        {/* Error display */}
        {error && <div className="text-danger">Error loading report.</div>}
        {/* Main report table */}
        <ReusableTable columns={columns} data={reportData || []} />
      </ReusableCard>
    </ReusableSection>
  );
}

export default BankAdvancePaidReport;
