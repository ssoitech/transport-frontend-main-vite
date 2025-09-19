import React from "react";
import ReusableLoader from "../ReusableLoader";

export default {
  title: "Reusable/ReusableLoader",
  component: ReusableLoader,
};

export const Default = () => <ReusableLoader />;

export const Loading = () => <ReusableLoader loading />;

export const Error = () => <ReusableLoader error="Failed to load" />;

export const LongLoading = () => (
  <ReusableLoader loading message={"Loading...".repeat(10)} />
);

export const Overflow = () => (
  <div style={{ width: 120 }}>
    <ReusableLoader loading />
  </div>
);
export const WithText = () => <ReusableLoader text="Please wait..." />;
export const AccessibilityDemo = () => (
  <ReusableLoader
    aria-label="Loading Spinner"
    role="status"
    tabIndex={0}
    style={{ outline: "2px solid #007bff" }}
    loading
    text="Loading..."
  />
);
