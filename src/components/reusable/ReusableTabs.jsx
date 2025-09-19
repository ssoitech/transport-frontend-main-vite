import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableTabs - World-class tabs component
 * @param {Array} tabs - Tab items
 * @param {string|number} activeTab - Active tab
 * @param {function} onTabClick - Tab click handler
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableTabs = React.memo(function ReusableTabs({
  tabs,
  activeTab,
  onTabClick,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <div
      className={`tabs ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      <ul className="tab-list">
        {tabs.map((tab, idx) => (
          <li
            key={idx}
            className={activeTab === tab ? "active" : ""}
            onClick={() => onTabClick(tab)}
            tabIndex={0}
            role="tab"
            aria-selected={activeTab === tab}
            aria-label={`Tab: ${tab}`}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && onTabClick(tab)
            }
          >
            {tab}
          </li>
        ))}
      </ul>
    </div>
  );
});

ReusableTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.node).isRequired,
  activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onTabClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableTabs.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Tabs",
  role: "tablist",
  tabs: [],
};

export default ReusableTabs;
