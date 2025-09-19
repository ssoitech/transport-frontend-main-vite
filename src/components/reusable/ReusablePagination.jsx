import React from "react";
import PropTypes from "prop-types";

/**
 * ReusablePagination - World-class pagination component
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Page change handler
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusablePagination = React.memo(function ReusablePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <nav
      className={`pagination ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {pages.map((page) => (
        <button
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={() => onPageChange(page)}
          aria-label={`Go to page ${page}`}
          tabIndex={0}
        >
          {page}
        </button>
      ))}
    </nav>
  );
});

ReusablePagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusablePagination.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Pagination",
  role: "navigation",
};

export default ReusablePagination;
