import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableExportButton - Data export/download button
 * @param {function} onExport - Export handler
 * @param {string} label - Button label
 * @param {string} fileType - File type (csv, xlsx, pdf, etc.)
 * @param {boolean} loading - Loading state
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 */
const ReusableExportButton = React.memo(function ReusableExportButton({
  onExport,
  label,
  fileType,
  loading,
  className,
  style,
  ...props
}) {
  return (
    <button
      type="button"
      className={`export-btn ${className || ""}`}
      style={style}
      onClick={onExport}
      disabled={loading}
      aria-label={`Export as ${fileType}`}
      {...props}
    >
      {loading ? "Exporting..." : label || `Export (${fileType || "file"})`}
    </button>
  );
});

ReusableExportButton.propTypes = {
  onExport: PropTypes.func.isRequired,
  label: PropTypes.node,
  fileType: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

ReusableExportButton.defaultProps = {
  label: "Export",
  fileType: "csv",
  loading: false,
  className: "",
  style: {},
};

export default ReusableExportButton;
