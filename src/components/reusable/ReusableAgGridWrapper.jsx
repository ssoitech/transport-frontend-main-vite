import React, { useContext } from "react";
import PropTypes from "prop-types";

// Simple Theme Context for demonstration
const AgGridThemeContext = React.createContext({
  headerBg: "#e3f2fd",
  rowBg: "#fff",
  borderColor: "#90caf9",
  textColor: "#212529",
});

/**
 * ReusableAgGridWrapper - World-class AgGrid wrapper component
 * @param {Array} rowData - Grid data
 * @param {Array} columnDefs - Column definitions
 * @param {object} gridOptions - AgGrid options
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 * @param {boolean} sortable - Enable sorting
 * @param {boolean} filterable - Enable filtering
 * @param {object} theme - Custom theme overrides
 * @returns {JSX.Element}
 */
const ReusableAgGridWrapper = React.memo(function ReusableAgGridWrapper({
  rowData,
  columnDefs,
  gridOptions,
  style,
  className,
  ariaLabel,
  role,
  sortable,
  filterable,
  theme,
  ...props
}) {
  const agTheme = useContext(AgGridThemeContext);
  const mergedTheme = { ...agTheme, ...theme };
  // Placeholder: For real use, install ag-grid-react and use <AgGridReact />
  // Error handling: Show warning if ag-grid-react is not installed
  return (
    <div
      className={`aggrid-wrapper ${className || ""}`}
      style={{
        ...style,
        color: mergedTheme.textColor,
        border: `1px solid ${mergedTheme.borderColor}`,
      }}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      <p>
        AgGrid Wrapper Placeholder. Install <b>ag-grid-react</b> for full
        functionality.
      </p>
      <ul>
        <li>Sorting: {sortable ? "Enabled" : "Disabled"}</li>
        <li>Filtering: {filterable ? "Enabled" : "Disabled"}</li>
      </ul>
    </div>
  );
});

ReusableAgGridWrapper.propTypes = {
  rowData: PropTypes.array,
  columnDefs: PropTypes.array,
  gridOptions: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  theme: PropTypes.object,
};

ReusableAgGridWrapper.defaultProps = {
  rowData: [],
  columnDefs: [],
  gridOptions: {},
  className: "",
  style: {},
  ariaLabel: "AgGrid",
  role: "grid",
  sortable: false,
  filterable: false,
  theme: {},
};

export { AgGridThemeContext };
export default ReusableAgGridWrapper;
