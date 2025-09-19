import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableInput - World-class input component
 * @param {string} label - Input label
 * @param {string} name - Input name
 * @param {string|number} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} type - Input type
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 */
const ReusableInput = React.memo(function ReusableInput({
  label,
  name,
  value,
  onChange,
  type,
  className,
  style,
  ariaLabel,
  ...props
}) {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        className={className}
        style={style}
        aria-label={ariaLabel}
        {...props}
      />
    </div>
  );
});

ReusableInput.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
};

ReusableInput.defaultProps = {
  type: "text",
  className: "",
  style: {},
  ariaLabel: "Input",
};

export default ReusableInput;
