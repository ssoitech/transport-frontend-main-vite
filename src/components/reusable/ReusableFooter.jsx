import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableFooter - World-class footer component
 * @param {React.ReactNode} children - Footer content
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableFooter = React.memo(function ReusableFooter({
  children,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <footer
      className={`footer ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {children}
    </footer>
  );
});

ReusableFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableFooter.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Footer",
  role: "contentinfo",
};

export default ReusableFooter;
