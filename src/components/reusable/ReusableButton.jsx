import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableButton - World-class button component
 * @param {React.ReactNode} children - Button content
 * @param {function} onClick - Click handler
 * @param {string} type - Button type
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 */
const ReusableButton = React.memo(function ReusableButton({
  children,
  onClick,
  type,
  className,
  style,
  ariaLabel,
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={style}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
});

ReusableButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
};

ReusableButton.defaultProps = {
  type: "button",
  className: "",
  style: {},
  ariaLabel: "Button",
};

export default ReusableButton;
