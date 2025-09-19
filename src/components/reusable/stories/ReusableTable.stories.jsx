import React, { useState } from "react";
import ReusableTable, { TableThemeContext } from "../ReusableTable";

export default {
  title: "Reusable/ReusableTable",
  component: ReusableTable,
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Age", accessor: "age" },
];
const data = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];

export const Default = () => <ReusableTable columns={columns} data={data} />;
export const Sortable = () => (
  <ReusableTable columns={columns} data={data} sortable />
);
export const Filterable = () => {
  const [filterValues, setFilterValues] = useState({});
  return (
    <ReusableTable
      columns={columns}
      data={data}
      filterable
      filterValues={filterValues}
      onFilterChange={(col, val) =>
        setFilterValues((fv) => ({ ...fv, [col]: val }))
      }
    />
  );
};
export const Themed = () => (
  <TableThemeContext.Provider
    value={{
      headerBg: "#222",
      textColor: "#fff",
      borderColor: "#444",
      rowBg: "#333",
    }}
  >
    <ReusableTable columns={columns} data={data} />
  </TableThemeContext.Provider>
);
export const Empty = () => <ReusableTable columns={columns} data={[]} />;
export const Loading = () => (
  <ReusableTable columns={columns} data={[]} style={{ opacity: 0.5 }} />
  // Add a loader overlay in your actual implementation
);
export const Error = () => (
  <div style={{ color: "#dc3545" }}>
    Error loading table data.
    <ReusableTable columns={columns} data={[]} />
  </div>
);
export const LongContent = () => {
  const longData = [
    {
      name: "Alice with a very long name that should wrap or overflow",
      age: 30,
    },
    { name: "Bob with another extremely long name for testing", age: 25 },
  ];
  return <ReusableTable columns={columns} data={longData} />;
};
export const Overflow = () => (
  <div style={{ width: 150 }}>
    <ReusableTable columns={columns} data={data} style={{ width: "100%" }} />
  </div>
);
export const AccessibilityDemo = () => {
  const columns = [
    { header: "Name", accessor: "name", ariaLabel: "Person Name" },
    { header: "Age", accessor: "age", ariaLabel: "Person Age" },
  ];
  const data = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
  ];
  return (
    <div>
      <ReusableTable
        columns={columns}
        data={data}
        aria-label="Accessible Table"
        role="table"
        tabIndex={0}
        style={{ outline: "2px solid #007bff" }}
      />
      <p>
        Try tabbing to the table and use arrow keys for navigation. Columns have
        ARIA labels.
      </p>
    </div>
  );
};
export const ThemingDemo = () => (
  <TableThemeContext.Provider
    value={{
      headerBg: "#222",
      textColor: "#fff",
      borderColor: "#28a745",
      rowBg: "#333",
      fontSize: "1.2rem",
    }}
  >
    <ReusableTable
      columns={columns}
      data={data}
      style={{ fontSize: "1.2rem" }}
    />
    <ReusableTable
      columns={columns}
      data={data}
      style={{
        background: "#f8f9fa",
        color: "#155724",
        border: "2px solid #28a745",
        fontSize: "1.5rem",
      }}
    />
  </TableThemeContext.Provider>
);
export const IntegrationDemo = () => {
  const [page, setPage] = React.useState(1);
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Age", accessor: "age" },
  ];
  const data = [
    { name: "Alice", age: 30 },
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 40 },
    { name: "Diana", age: 22 },
    { name: "Eve", age: 35 },
  ];
  const pageSize = 2;
  const pagedData = data.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div>
      <ReusableTable columns={columns} data={pagedData} />
      <ReusablePagination
        currentPage={page}
        totalPages={Math.ceil(data.length / pageSize)}
        onPageChange={setPage}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

// Integration Demo: Table + Tabs
import ReusableTabs from "../ReusableTabs";
export const TableWithTabsDemo = () => {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Age", accessor: "age" },
  ];
  const allData = {
    "Tab 1": [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 },
    ],
    "Tab 2": [
      { name: "Charlie", age: 40 },
      { name: "Diana", age: 22 },
    ],
    "Tab 3": [{ name: "Eve", age: 35 }],
  };
  const tabs = Object.keys(allData);
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  return (
    <div>
      <ReusableTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <ReusableTable
        columns={columns}
        data={allData[activeTab]}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};
