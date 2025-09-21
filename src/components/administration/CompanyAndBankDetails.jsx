import React from "react";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableCard from "../../components/reusable/ReusableCard";
import ReusableTable from "../../components/reusable/ReusableTable";
import ReusableLoader from "../../components/reusable/ReusableLoader";

/**
 * CompanyAndBankDetails - World-class, robust, maintainable component
 * - Uses reusable card and table for layout and data display
 * - API logic separated using generic React Query hook (SOLID/DRY)
 * - No Redux or direct axios logic
 * - Detailed comments for major functionality
 */
function CompanyAndBankDetails() {
  // Fetch company and bank details using generic useApiQuery hook
  const {
    data: details = [],
    isLoading,
    isError,
    error,
  } = useApiQuery({
    key: "companyBankDetails",
    url: "/api/v1/company-bank-details", // Replace with actual endpoint
    method: "get",
  });

  // Table columns for ReusableTable
  const columns = [
    { header: "Company Name", accessor: "companyName" },
    { header: "Bank Name", accessor: "bankName" },
    { header: "Account Number", accessor: "accountNumber" },
    { header: "IFSC Code", accessor: "ifscCode" },
    // Add more columns as needed
  ];

  // Render row for ReusableTable
  const renderRow = (row) => (
    <tr key={row.id}>
      <td>{row.companyName}</td>
      <td>{row.bankName}</td>
      <td>{row.accountNumber}</td>
      <td>{row.ifscCode}</td>
      {/* Add more cells as needed */}
    </tr>
  );

  return (
    <div className="work-space-container">
      <ReusableCard title="Company and Bank Details">
        {isLoading ? (
          <ReusableLoader />
        ) : isError ? (
          <div className="text-danger">
            {error?.message || "Error loading details."}
          </div>
        ) : (
          <ReusableTable
            columns={columns}
            data={details}
            renderRow={renderRow}
            className="table table-bordered table-hover"
            ariaLabel="Company and Bank Details Table"
          />
        )}
      </ReusableCard>
    </div>
  );
}

export default CompanyAndBankDetails;
