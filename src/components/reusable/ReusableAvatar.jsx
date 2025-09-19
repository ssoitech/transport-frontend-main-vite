import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableAvatar - World-class avatar component
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {number} size - Avatar size in px
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableAvatar = React.memo(function ReusableAvatar({
  src,
  alt,
  size,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`avatar ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      loading="lazy"
      {...props}
    />
  );
});

ReusableAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableAvatar.defaultProps = {
  alt: "avatar",
  size: 40,
  className: "",
  style: {},
  ariaLabel: "User avatar",
  role: "img",
};

export default ReusableAvatar;
