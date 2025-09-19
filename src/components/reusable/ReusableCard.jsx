import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableCard - World-class card component
 * @param {string} title - Card title
 * @param {React.ReactNode} children - Card content
 * @param {React.ReactNode} footer - Card footer
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableCard = React.memo(function ReusableCard({
  title,
  children,
  footer,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <div
      className={`card ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {title && <div className="card-header">{title}</div>}
      <div className="card-body">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
});

ReusableCard.propTypes = {
  title: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableCard.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Card",
  role: "region",
};

export default ReusableCard;
