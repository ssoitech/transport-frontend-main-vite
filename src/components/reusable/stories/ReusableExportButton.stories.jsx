import React from "react";
import ReusableExportButton from "../ReusableExportButton";

export default {
  title: "Reusable/ExportButton",
  component: ReusableExportButton,
};

export const Default = (args) => (
  <ReusableExportButton
    onExport={() => alert("Export triggered")}
    label="Export Data"
    fileType="xlsx"
    loading={false}
    {...args}
  />
);

export const EdgeLoading = (args) => (
  <ReusableExportButton
    onExport={() => alert("Export triggered")}
    label="Export Data"
    fileType="xlsx"
    loading={true}
    {...args}
  />
);

export const EdgeError = (args) => (
  <ReusableExportButton
    onExport={() => alert("Export triggered")}
    label="Export Data"
    fileType="xlsx"
    error="Failed to export"
    {...args}
  />
);

export const EdgeDisabled = (args) => (
  <ReusableExportButton
    onExport={() => alert("Export triggered")}
    label="Export Data"
    fileType="xlsx"
    disabled={true}
    {...args}
  />
);

export const EdgeLongLabel = (args) => (
  <ReusableExportButton
    onExport={() => alert("Export triggered")}
    label={"Export Data to Excel File with a Very Long Label"}
    fileType="xlsx"
    {...args}
  />
);

export const EdgeOverflow = (args) => (
  <div style={{ width: 120 }}>
    <ReusableExportButton
      onExport={() => alert("Export triggered")}
      label="Export Data"
      fileType="xlsx"
      {...args}
    />
  </div>
);

export const AccessibilityDemo = (args) => (
  <ReusableExportButton
    onExport={() => alert("Export triggered")}
    label="Accessible Export"
    fileType="xlsx"
    aria-label="Export Data Button"
    role="button"
    tabIndex={0}
    style={{ outline: "2px solid #007bff" }}
    {...args}
  />
);
