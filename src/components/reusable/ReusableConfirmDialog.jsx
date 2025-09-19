import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableConfirmDialog - Custom alert/confirmation dialog
 * @param {boolean} isOpen - Dialog open state
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {function} onConfirm - Confirm handler
 * @param {function} onCancel - Cancel handler
 * @param {string} confirmLabel - Confirm button label
 * @param {string} cancelLabel - Cancel button label
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 */
const ReusableConfirmDialog = React.memo(function ReusableConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  className,
  style,
  ...props
}) {
  if (!isOpen) return null;
  return (
    <div
      className={`confirm-dialog-overlay ${className || ""}`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.2)",
        zIndex: 9999,
        ...style,
      }}
      {...props}
    >
      <div
        className="confirm-dialog-content"
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          maxWidth: 400,
          margin: "100px auto",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {title && <h4>{title}</h4>}
        <div style={{ margin: "16px 0" }}>{message}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onCancel}>
            {cancelLabel || "Cancel"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{ background: "#1976d2", color: "#fff" }}
          >
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
});

ReusableConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.node,
  message: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmLabel: PropTypes.node,
  cancelLabel: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

ReusableConfirmDialog.defaultProps = {
  title: "",
  message: "",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  className: "",
  style: {},
};

export default ReusableConfirmDialog;
