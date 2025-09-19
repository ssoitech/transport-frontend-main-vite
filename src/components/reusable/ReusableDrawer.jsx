import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableDrawer - World-class drawer component
 * @param {boolean} isOpen - Drawer open state
 * @param {function} onClose - Close handler
 * @param {React.ReactNode} children - Drawer content
 * @param {string} position - Drawer position (left/right)
 * @param {object} style - Inline styles
 * @param {string} className - Custom class
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableDrawer = React.memo(function ReusableDrawer({
  isOpen,
  onClose,
  children,
  position,
  style,
  className,
  ariaLabel,
  role,
  ...props
}) {
  if (!isOpen) return null;
  return (
    <div
      className={`drawer drawer-${position} ${className || ""}`}
      style={{
        position: "fixed",
        top: 0,
        [position]: 0,
        width: "300px",
        height: "100%",
        background: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        ...style,
      }}
      aria-label={ariaLabel}
      role={role}
      aria-modal="true"
      tabIndex={-1}
      {...props}
    >
      <button
        style={{ position: "absolute", top: 10, left: 10 }}
        onClick={onClose}
        aria-label="Close drawer"
      >
        Close
      </button>
      <div style={{ marginTop: 40 }}>{children}</div>
    </div>
  );
});

ReusableDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  position: PropTypes.oneOf(["left", "right"]),
  style: PropTypes.object,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableDrawer.defaultProps = {
  position: "right",
  style: {},
  className: "",
  ariaLabel: "Drawer",
  role: "dialog",
};

export default ReusableDrawer;
