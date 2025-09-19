import React from "react";
import ReusableAdvancedSearchBar from "../ReusableAdvancedSearchBar";

export default {
  title: "Reusable/AdvancedSearchBar",
  component: ReusableAdvancedSearchBar,
};

const fields = [
  { name: "name", label: "Name", type: "text" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
  },
  { name: "date", label: "Date", type: "date" },
];

export const Default = (args) => {
  const [values, setValues] = React.useState({});
  return (
    <ReusableAdvancedSearchBar
      fields={fields}
      values={values}
      onChange={(name, value) => setValues((v) => ({ ...v, [name]: value }))}
      onSearch={() => alert("Search: " + JSON.stringify(values))}
      onReset={() => setValues({})}
      {...args}
    />
  );
};
