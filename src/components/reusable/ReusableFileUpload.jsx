import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableFileUpload - World-class file upload component
 * @param {string} label - Input label
 * @param {string} name - Input name
 * @param {function} onChange - Change handler
 * @param {string} accept - Accepted file types
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableFileUpload = React.memo(function ReusableFileUpload({
  label,
  name,
  onChange,
  accept,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <div
      className={`form-group ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
    >
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type="file"
        id={name}
        name={name}
        accept={accept}
        onChange={onChange}
        {...props}
      />
    </div>
  );
});

ReusableFileUpload.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableFileUpload.defaultProps = {
  accept: "*",
  className: "",
  style: {},
  ariaLabel: "File upload",
  role: "group",
};

export default ReusableFileUpload;
