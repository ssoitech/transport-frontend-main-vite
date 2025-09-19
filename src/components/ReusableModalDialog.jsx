import React, { useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";

// Example Theme Context (replace with your actual theme context)
const ThemeContext = React.createContext({
  modalBg: "#fff",
  modalHeaderBg: "#007bff",
  modalHeaderColor: "#fff",
  modalBorderRadius: "8px",
});

/**
 * ReusableModalDialog - Accessible, themeable modal dialog
 * @param {boolean} open - Whether modal is open
 * @param {function} onClose - Callback to close modal
 * @param {string} title - Modal title
 * @param {ReactNode} children - Modal content
 * @param {ReactNode} footer - Modal footer (optional)
 */
function ReusableModalDialog({ open, onClose, title, children, footer }) {
  const theme = useContext(ThemeContext);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [open]);

  // Trap focus inside modal
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    // Add tab trapping if needed
  };

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      role="presentation"
      onClick={onClose}
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onKeyDown={handleKeyDown}
        style={{
          background: theme.modalBg,
          borderRadius: theme.modalBorderRadius,
          minWidth: "320px",
          maxWidth: "500px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
          outline: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-header"
          style={{
            background: theme.modalHeaderBg,
            color: theme.modalHeaderColor,
            padding: "1rem",
            borderTopLeftRadius: theme.modalBorderRadius,
            borderTopRightRadius: theme.modalBorderRadius,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span id="modal-title" style={{ fontWeight: "bold" }}>
            {title}
          </span>
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: theme.modalHeaderColor,
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
        <div className="modal-body" style={{ padding: "1rem" }}>
          {children}
        </div>
        {footer && (
          <div
            className="modal-footer"
            style={{ padding: "1rem", borderTop: "1px solid #eee" }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

ReusableModalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

export default React.memo(ReusableModalDialog);
