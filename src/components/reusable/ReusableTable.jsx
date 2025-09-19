import React, { useState, useMemo, useContext } from "react";
const TableThemeContext = React.createContext({
  headerBg: "#f8f9fa",
  rowBg: "#fff",
  rowHoverBg: "#f1f3f5",
  borderColor: "#dee2e6",
  textColor: "#212529",
});
// ...existing code...
import PropTypes from "prop-types";

/**
 * ReusableTable - World-class table component
 * @param {Array} columns - Table columns [{ header, accessor }]
 * @param {Array} data - Table data
 * @param {function} renderRow - Custom row renderer
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 * @param {boolean} sortable - Enable sorting
 * @param {boolean} filterable - Enable filtering
 * @param {object} filterValues - Filter values by column
 * @param {function} onFilterChange - Filter change handler
 * @param {object} theme - Custom theme overrides
 */
const ReusableTable = React.memo(function ReusableTable({
  columns,
  data,
  renderRow,
  className,
  style,
  ariaLabel,
  role,
  sortable,
  filterable,
  filterValues,
  onFilterChange,
  theme,
  ...props
}) {
  const tableTheme = useContext(TableThemeContext);
  const mergedTheme = { ...tableTheme, ...theme };
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortable || !sortCol) return data;
    return [...data].sort((a, b) => {
      if (a[sortCol] < b[sortCol]) return sortDir === "asc" ? -1 : 1;
      if (a[sortCol] > b[sortCol]) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortCol, sortDir, sortable]);

  // Filtering logic
  const filteredData = useMemo(() => {
    if (!filterable || !filterValues) return sortedData;
    return sortedData.filter((row) =>
      columns.every((col) => {
        const val = filterValues[col.accessor];
        if (!val) return true;
        return String(row[col.accessor])
          .toLowerCase()
          .includes(String(val).toLowerCase());
      })
    );
  }, [sortedData, filterable, filterValues, columns]);

  return (
    <table
      className={className}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx} scope="col">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) =>
          renderRow ? (
            renderRow(row, idx)
          ) : (
            <tr key={idx}>
              {columns.map((col, cidx) => (
                <td key={cidx}>{row[col.accessor]}</td>
              ))}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
});

ReusableTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      accessor: PropTypes.string.isRequired,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  renderRow: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
  sortable: PropTypes.bool,
  filterable: PropTypes.bool,
  filterValues: PropTypes.object,
  onFilterChange: PropTypes.func,
  theme: PropTypes.object,
};

ReusableTable.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Table",
  role: "table",
  data: [],
  columns: [],
  sortable: false,
  filterable: false,
  filterValues: {},
  theme: {},
};

export { TableThemeContext };
export default ReusableTable;
