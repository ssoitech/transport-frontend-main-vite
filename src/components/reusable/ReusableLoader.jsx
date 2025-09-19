import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableLoader - World-class loader component
 * @param {string} text - Loading text
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableLoader = React.memo(function ReusableLoader({
  text,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <div
      className={`loader ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      <span className="spinner" />
      <span>{text}</span>
    </div>
  );
});

ReusableLoader.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableLoader.defaultProps = {
  text: "Loading...",
  className: "",
  style: {},
  ariaLabel: "Loading",
  role: "status",
};

export default ReusableLoader;
