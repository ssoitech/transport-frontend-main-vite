import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableSearchBar - World-class search bar component
 * @param {string|number} value - Search value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Input placeholder
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableSearchBar = React.memo(function ReusableSearchBar({
  value,
  onChange,
  placeholder,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <div
      className={`search-bar ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
    >
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
        {...props}
      />
    </div>
  );
});

ReusableSearchBar.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableSearchBar.defaultProps = {
  placeholder: "Search...",
  className: "",
  style: {},
  ariaLabel: "Search",
  role: "search",
};

export default ReusableSearchBar;
