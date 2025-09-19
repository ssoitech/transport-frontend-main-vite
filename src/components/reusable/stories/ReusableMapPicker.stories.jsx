import React from "react";
import ReusableMapPicker from "../ReusableMapPicker";

export default {
  title: "Reusable/ReusableMapPicker",
  component: ReusableMapPicker,
};

export const Default = () => (
  <ReusableMapPicker
    onLocationSelect={(loc) => alert(`Selected: ${JSON.stringify(loc)}`)}
  />
);
