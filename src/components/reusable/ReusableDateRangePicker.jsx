import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableDateRangePicker - World-class date range picker component
 * @param {string|number} startDate - Start date value
 * @param {string|number} endDate - End date value
 * @param {function} onStartDateChange - Start date change handler
 * @param {function} onEndDateChange - End date change handler
 * @param {string} label - Input label
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableDateRangePicker = React.memo(function ReusableDateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <div
      className={`date-range-picker ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {label && <label>{label}</label>}
      <input
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        aria-label="Start date"
      />
      <span> to </span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        aria-label="End date"
      />
    </div>
  );
});

ReusableDateRangePicker.propTypes = {
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableDateRangePicker.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Date range picker",
  role: "group",
};

export default ReusableDateRangePicker;
