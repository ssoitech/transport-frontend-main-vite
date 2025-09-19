import React from "react";
import ReusableAgGridWrapper, {
  AgGridThemeContext,
} from "../ReusableAgGridWrapper";

export default {
  title: "Reusable/ReusableAgGridWrapper",
  component: ReusableAgGridWrapper,
};

const rowData = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
];
const columnDefs = [
  { header: "Name", accessor: "name" },
  { header: "Age", accessor: "age" },
];

export const Default = () => (
  <ReusableAgGridWrapper rowData={rowData} columnDefs={columnDefs} />
);
export const Sortable = () => (
  <ReusableAgGridWrapper rowData={rowData} columnDefs={columnDefs} sortable />
);
export const Filterable = () => (
  <ReusableAgGridWrapper rowData={rowData} columnDefs={columnDefs} filterable />
);
export const Themed = () => (
  <AgGridThemeContext.Provider
    value={{
      headerBg: "#222",
      textColor: "#fff",
      borderColor: "#444",
      rowBg: "#333",
    }}
  >
    <ReusableAgGridWrapper rowData={rowData} columnDefs={columnDefs} />
  </AgGridThemeContext.Provider>
);
