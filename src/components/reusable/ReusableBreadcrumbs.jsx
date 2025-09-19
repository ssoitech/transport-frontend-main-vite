import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableBreadcrumbs - World-class breadcrumbs component
 * @param {Array} items - Breadcrumb items
 * @param {function} onItemClick - Item click handler
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableBreadcrumbs = React.memo(function ReusableBreadcrumbs({
  items,
  onItemClick,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <nav
      className={`breadcrumbs ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          onClick={() => onItemClick(item)}
          tabIndex={0}
          role="link"
          aria-label={`Breadcrumb: ${item}`}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onItemClick(item)
          }
        >
          {item}
          {idx < items.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
});

ReusableBreadcrumbs.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  onItemClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableBreadcrumbs.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Breadcrumbs",
  role: "navigation",
  items: [],
};

export default ReusableBreadcrumbs;
