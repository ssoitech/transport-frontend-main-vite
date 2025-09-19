import React from "react";
import ReusableToast from "../ReusableToast";

export default {
  title: "Reusable/ReusableToast",
  component: ReusableToast,
};

export const Info = () => (
  <ReusableToast message="Info message" type="info" onClose={() => {}} />
);
export const Success = () => (
  <ReusableToast message="Success!" type="success" onClose={() => {}} />
);

export const Warning = () => (
  <ReusableToast message="Warning!" type="warning" onClose={() => {}} />
);
export const EdgeEmpty = () => (
  <ReusableToast message="" type="info" onClose={() => {}} />
);
export const EdgeLongMessage = () => (
  <ReusableToast
    message={"This is a very long toast message. ".repeat(10)}
    type="info"
    onClose={() => {}}
  />
);
export const EdgeError = () => (
  <ReusableToast
    message="Error: Something went wrong."
    type="error"
    onClose={() => {}}
  />
);
export const EdgeOverflow = () => (
  <div style={{ width: 120 }}>
    <ReusableToast
      message="Overflowing toast message"
      type="info"
      onClose={() => {}}
    />
  </div>
);
export const EdgeDisabledClose = () => (
  <ReusableToast message="Can't close this toast" disableClose />
);
export const AccessibilityDemo = () => (
  <ReusableToast
    message="Accessible Toast"
    aria-label="Accessible Toast Notification"
    role="status"
    tabIndex={0}
    onClose={() => {}}
    style={{ outline: "2px solid #007bff" }}
  />
);
export const ThemingDemo = () => (
  <div style={{ background: "#222", padding: 16 }}>
    <ReusableToast
      message="Dark Mode Toast"
      type="info"
      style={{
        background: "#333",
        color: "#fff",
        border: "1px solid #555",
      }}
      onClose={() => {}}
    />
    <ReusableToast
      message="Custom Color Toast"
      type="success"
      style={{
        background: "#28a745",
        color: "#fff",
        border: "1px solid #155724",
      }}
      onClose={() => {}}
    />
    <ReusableToast
      message="Large Font Toast"
      type="warning"
      style={{ fontSize: "1.5rem", padding: "1rem" }}
      onClose={() => {}}
    />
  </div>
);

// Animation/Transition Demo: Toast
export const AnimationDemo = () => {
  const [show, setShow] = React.useState(false);
  return (
    <div>
      <button onClick={() => setShow(true)} style={{ marginBottom: 16 }}>
        Show Animated Toast
      </button>
      {show && (
        <ReusableToast
          message="Toast with fade-in animation!"
          type="info"
          onClose={() => setShow(false)}
          style={{
            transition: "opacity 0.5s cubic-bezier(0.4,0,0.2,1)",
            opacity: show ? 1 : 0,
          }}
        />
      )}
    </div>
  );
};
