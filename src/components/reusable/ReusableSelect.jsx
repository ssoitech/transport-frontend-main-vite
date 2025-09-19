import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableSelect - World-class select component
 * @param {Array} options - Select options [{ value, label }]
 * @param {string|number} value - Selected value
 * @param {function} onChange - Change handler
 * @param {string} label - Select label
 * @param {string} name - Select name
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 */
const ReusableSelect = React.memo(function ReusableSelect({
  options,
  value,
  onChange,
  label,
  name,
  className,
  style,
  ariaLabel,
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        style={style}
        aria-label={ariaLabel}
        {...props}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
});

ReusableSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
};

ReusableSelect.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Select",
  options: [],
};

export default ReusableSelect;
