import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableDatePicker - World-class date picker component
 * @param {string} label - Input label
 * @param {string} name - Input name
 * @param {string|number} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 */
const ReusableDatePicker = React.memo(function ReusableDatePicker({
  label,
  name,
  value,
  onChange,
  className,
  style,
  ariaLabel,
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        style={style}
        aria-label={ariaLabel}
        {...props}
      />
    </div>
  );
});

ReusableDatePicker.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
};

ReusableDatePicker.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Date picker",
};

export default ReusableDatePicker;
