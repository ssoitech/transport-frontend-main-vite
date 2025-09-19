import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableModal - World-class modal component
 * @param {boolean} isOpen - Modal open state
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Modal content
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableModal = React.memo(function ReusableModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  if (!isOpen) return null;
  return (
    <div
      className={`modal-overlay ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      aria-modal="true"
      tabIndex={-1}
      {...props}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h5>{title}</h5>
          <button onClick={onClose} aria-label="Close modal">
            X
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
});

ReusableModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableModal.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Modal",
  role: "dialog",
  title: "",
};

export default ReusableModal;
