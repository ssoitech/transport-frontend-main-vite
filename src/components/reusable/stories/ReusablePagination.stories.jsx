import React, { useState } from "react";
import ReusablePagination from "../ReusablePagination";

export default {
  title: "Reusable/ReusablePagination",
  component: ReusablePagination,
};

export const Default = () => {
  const [page, setPage] = useState(1);
  return (
    <ReusablePagination
      currentPage={page}
      totalPages={5}
      onPageChange={setPage}
    />
  );
};

export const EdgeEmpty = () => (
  <ReusablePagination currentPage={1} totalPages={0} onPageChange={() => {}} />
);

export const EdgeLongPages = () => (
  <ReusablePagination
    currentPage={1}
    totalPages={100}
    onPageChange={() => {}}
  />
);

export const EdgeOverflow = () => (
  <div style={{ width: 120 }}>
    <ReusablePagination
      currentPage={1}
      totalPages={10}
      onPageChange={() => {}}
    />
  </div>
);

export const EdgeError = () => (
  <ReusablePagination
    currentPage={1}
    totalPages={10}
    onPageChange={() => {}}
    error="Failed to load pages"
  />
);

export const EdgeDisabledPage = () => (
  <ReusablePagination
    currentPage={1}
    totalPages={10}
    onPageChange={() => {}}
    disabledPages={[2, 3]}
  />
);

export const AccessibilityDemo = () => {
  const [page, setPage] = React.useState(1);
  return (
    <ReusablePagination
      currentPage={page}
      totalPages={5}
      onPageChange={setPage}
      aria-label="Pagination Navigation"
      role="navigation"
      tabIndex={0}
      style={{ outline: "2px solid #007bff" }}
    />
  );
};

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
