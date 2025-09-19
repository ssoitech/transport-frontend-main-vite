import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableSection - World-class section component
 * @param {string} title - Section title
 * @param {React.ReactNode} children - Section content
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableSection = React.memo(function ReusableSection({
  title,
  children,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <section
      className={`section ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {title && <h3>{title}</h3>}
      {children}
    </section>
  );
});

ReusableSection.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableSection.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Section",
  role: "region",
};

export default ReusableSection;
