import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableNavbar - World-class navbar component
 * @param {string} brand - Brand name or logo
 * @param {Array} links - Navigation links
 * @param {function} onLinkClick - Link click handler
 * @param {function} renderLink - Custom link renderer
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableNavbar = React.memo(function ReusableNavbar({
  brand,
  links,
  onLinkClick,
  renderLink,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <nav
      className={`navbar ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {brand && <div className="navbar-brand">{brand}</div>}
      <ul className="navbar-links">
        {links.map((link, idx) => (
          <li
            key={idx}
            onClick={() => onLinkClick(link)}
            tabIndex={0}
            role="link"
            aria-label={`Nav: ${link}`}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && onLinkClick(link)
            }
          >
            {renderLink ? renderLink(link) : link}
          </li>
        ))}
      </ul>
    </nav>
  );
});

ReusableNavbar.propTypes = {
  brand: PropTypes.node,
  links: PropTypes.arrayOf(PropTypes.node).isRequired,
  onLinkClick: PropTypes.func.isRequired,
  renderLink: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableNavbar.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Navigation",
  role: "navigation",
  links: [],
};

export default ReusableNavbar;
