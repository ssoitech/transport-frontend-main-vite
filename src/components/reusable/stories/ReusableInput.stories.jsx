import React from "react";
import ReusableInput from "../ReusableInput";

export default {
  title: "Reusable/ReusableInput",
  component: ReusableInput,
};

export const Default = () => (
  <ReusableInput label="Name" name="name" value="" onChange={() => {}} />
);
export const WithValue = () => (
  <ReusableInput label="Name" name="name" value="John" onChange={() => {}} />
);
export const Empty = () => <ReusableInput label="Empty" placeholder="" />;
export const Disabled = () => (
  <ReusableInput label="Disabled" placeholder="Can't type here" disabled />
);
export const Error = () => (
  <ReusableInput label="Error" error="Invalid input" />
);
export const LongContent = () => (
  <ReusableInput
    label="Long Content"
    value={"A very long input value ".repeat(10)}
  />
);
export const Overflow = () => (
  <div style={{ width: 120 }}>
    <ReusableInput label="Overflow" value="Overflowing input value" />
  </div>
);
export const AccessibilityDemo = () => (
  <div>
    <ReusableInput
      label="Accessible Input"
      name="accessible-input"
      aria-label="Accessible Input"
      aria-required="true"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          // Focus management demo
        }
      }}
      onChange={() => {}}
      autoFocus
    />
    <p>Try tabbing to the input and observe ARIA attributes.</p>
  </div>
);
export const ThemingDemo = () => (
  <div style={{ background: "#222", padding: 16 }}>
    <ReusableInput
      label="Dark Mode Input"
      name="dark-input"
      style={{ background: "#333", color: "#fff", border: "1px solid #555" }}
      autoFocus
    />
    <ReusableInput
      label="Custom Color Input"
      name="success-input"
      style={{
        background: "#28a745",
        color: "#fff",
        border: "1px solid #155724",
      }}
    />
    <ReusableInput
      label="Large Font Input"
      name="large-input"
      style={{ fontSize: "1.5rem", padding: "1rem" }}
    />
  </div>
);
