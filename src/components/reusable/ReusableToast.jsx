import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableToast - World-class toast/notification component
 * @param {string} message - Toast message
 * @param {string} type - Toast type (info, success, error, warning)
 * @param {function} onClose - Close handler
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableToast = React.memo(function ReusableToast({
  message,
  type,
  onClose,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  if (!message) return null;
  return (
    <div
      className={`toast toast-${type} ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close notification">
        X
      </button>
    </div>
  );
});

ReusableToast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["info", "success", "error", "warning"]),
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableToast.defaultProps = {
  type: "info",
  className: "",
  style: {},
  ariaLabel: "Notification",
  role: "alert",
};

export default ReusableToast;
