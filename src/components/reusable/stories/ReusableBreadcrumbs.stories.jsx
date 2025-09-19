import React from "react";
import ReusableBreadcrumbs from "../ReusableBreadcrumbs";

export default {
  title: "Reusable/ReusableBreadcrumbs",
  component: ReusableBreadcrumbs,
};

const items = ["Home", "Profile", "Settings"];
export const Default = () => (
  <ReusableBreadcrumbs items={items} onItemClick={() => {}} />
);
