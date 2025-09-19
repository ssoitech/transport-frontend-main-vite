import React, { useState } from "react";
import ReusableModal from "../ReusableModal";

export default {
  title: "Reusable/ReusableModal",
  component: ReusableModal,
};

export const Default = () => {
  const [open, setOpen] = useState(true);
  return (
    <ReusableModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Modal Title"
    >
      <span>Modal Content</span>
    </ReusableModal>
  );
};

export const EdgeEmpty = () => {
  const [open, setOpen] = useState(true);
  return (
    <ReusableModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Empty Modal"
    />
  );
};

export const EdgeLongContent = () => {
  const [open, setOpen] = useState(true);
  return (
    <ReusableModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Long Content Modal"
    >
      <div style={{ maxHeight: 200, overflowY: "auto" }}>
        {"This is a very long modal content. ".repeat(20)}
      </div>
    </ReusableModal>
  );
};

export const EdgeError = () => {
  const [open, setOpen] = useState(true);
  return (
    <ReusableModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Error Modal"
    >
      <div style={{ color: "#dc3545" }}>Error: Something went wrong.</div>
    </ReusableModal>
  );
};

export const EdgeOverflow = () => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ width: 120 }}>
      <ReusableModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Overflow Modal"
      >
        <span>Overflow Content</span>
      </ReusableModal>
    </div>
  );
};

export const EdgeDisabledClose = () => {
  const [open] = useState(true);
  return (
    <ReusableModal isOpen={open} onClose={null} title="Can't close this modal">
      <span>Modal Content</span>
    </ReusableModal>
  );
};

// Animation/Transition Demo: Modal
export const AnimationDemo = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>
        Open Animated Modal
      </button>
      <ReusableModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Animated Modal"
        style={{
          transition: "opacity 0.4s cubic-bezier(0.4,0,0.2,1)",
          opacity: open ? 1 : 0,
        }}
      >
        <div
          style={{
            transition: "transform 0.4s",
            transform: open ? "translateY(0)" : "translateY(-40px)",
          }}
        >
          <span>Modal with fade and slide animation.</span>
        </div>
      </ReusableModal>
    </div>
  );
};

// Integration Demo: Modal + Form
import ReusableForm from "../ReusableForm";
export const IntegrationDemo = () => {
  const [open, setOpen] = useState(true);
  return (
    <ReusableModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Form in Modal"
    >
      <ReusableForm
        onSubmit={(e) => {
          e.preventDefault();
          alert("Modal Form Submitted!");
        }}
        style={{ padding: 8 }}
      >
        <input
          name="modalName"
          placeholder="Name"
          style={{ marginBottom: 8 }}
        />
        <button type="submit">Submit</button>
      </ReusableForm>
    </ReusableModal>
  );
};

export const AccessibilityDemo = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <ReusableModal
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Accessible Modal"
      aria-label="Accessible Modal Dialog"
      role="dialog"
      tabIndex={0}
      style={{ outline: "2px solid #007bff" }}
    >
      <span aria-label="Modal Content">Modal Content</span>
      <p>Tab to the modal and observe ARIA attributes and focus management.</p>
    </ReusableModal>
  );
};

export const ThemingDemo = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <div style={{ background: "#222", padding: 16 }}>
      <ReusableModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Dark Mode Modal"
        style={{
          background: "#333",
          color: "#fff",
          border: "1px solid #555",
        }}
      >
        <span>Dark Mode Content</span>
      </ReusableModal>
      <ReusableModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Large Font Modal"
        style={{ fontSize: "1.5rem", padding: "1rem" }}
      >
        <span style={{ fontSize: "1.2rem" }}>Large Font Content</span>
      </ReusableModal>
    </div>
  );
};
