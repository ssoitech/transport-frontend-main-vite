import React from "react";
import ReusableFileUpload from "../ReusableFileUpload";

export default {
  title: "Reusable/ReusableFileUpload",
  component: ReusableFileUpload,
};

export const Default = () => (
  <ReusableFileUpload label="Upload" name="file" onChange={() => {}} />
);
