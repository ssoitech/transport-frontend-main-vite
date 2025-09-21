import React from "react";
import ReusableSection from "../../reusable/ReusableSection";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableTable from "../../reusable/ReusableTable";
import { useApiQuery } from "../../../hooks/api/useApiQuery";

/**
 * DataTableChallanStatus Component
 * - Refactored to use reusable section, card, and table components
 * - API logic for table data uses generic useApiQuery hook (SOLID, DRY)
 * - Follows world-class coding standards and maintainability
 */
function DataTableChallanStatus() {
  // Example: Fetch table data using React Query generic hook
  const {
    data: tableData = [
      {
        name: "Tiger Nixon",
        position: "System Architect",
        office: "Edinburgh",
        age: 61,
        startDate: "2011/04/25",
        salary: "$320,800",
      },
      {
        name: "Garrett Winters",
        position: "Accountant",
        office: "Tokyo",
        age: 63,
        startDate: "2011/07/25",
        salary: "$170,750",
      },
      // Add more rows as needed
    ],
    isLoading,
    error,
  } = useApiQuery({
    key: "challan-status-table",
    url: "/api/challan-status-table", // Replace with actual endpoint
    method: "get",
    select: (data) => data || [],
    enabled: false, // Set to true to enable API call
  });

  // Table column definitions for ReusableTable
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Position", accessor: "position" },
    { Header: "Office", accessor: "office" },
    { Header: "Age", accessor: "age" },
    { Header: "Start date", accessor: "startDate" },
    { Header: "Salary", accessor: "salary" },
  ];

  return (
    <ReusableSection title="Challan Status Table">
      <ReusableCard>
        <ReusableTable
          columns={columns}
          data={tableData}
          isLoading={isLoading}
        />
        {/* You can add more reusable components or features here as needed */}
      </ReusableCard>
    </ReusableSection>
  );
}

export default DataTableChallanStatus;
