import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableForm - World-class form component
 * @param {React.ReactNode} children - Form content
 * @param {function} onSubmit - Submit handler
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableForm = React.memo(function ReusableForm({
  children,
  onSubmit,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={className}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {children}
    </form>
  );
});

ReusableForm.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableForm.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Form",
  role: "form",
};

export default ReusableForm;
