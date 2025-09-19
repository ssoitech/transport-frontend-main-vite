import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableSidebar - World-class sidebar component
 * @param {Array} items - Sidebar items
 * @param {function} onItemClick - Item click handler
 * @param {string|number} activeItem - Active item
 * @param {function} renderItem - Custom item renderer
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableSidebar = React.memo(function ReusableSidebar({
  items,
  onItemClick,
  activeItem,
  renderItem,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <aside
      className={`sidebar ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      <ul>
        {items.map((item, idx) => (
          <li
            key={idx}
            className={activeItem === item ? "active" : ""}
            onClick={() => onItemClick(item)}
            tabIndex={0}
            role="menuitem"
            aria-label={`Sidebar: ${item}`}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && onItemClick(item)
            }
          >
            {renderItem ? renderItem(item) : item}
          </li>
        ))}
      </ul>
    </aside>
  );
});

ReusableSidebar.propTypes = {
  items: PropTypes.arrayOf(PropTypes.node).isRequired,
  onItemClick: PropTypes.func.isRequired,
  activeItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  renderItem: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableSidebar.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Sidebar",
  role: "complementary",
  items: [],
};

export default ReusableSidebar;
