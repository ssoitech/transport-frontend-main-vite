import React from "react";
import ReusableButton from "../ReusableButton";

export default {
  title: "Reusable/ReusableButton",
  component: ReusableButton,
};

export const Default = () => <ReusableButton>Default Button</ReusableButton>;
export const WithClick = () => (
  <ReusableButton onClick={() => alert("Clicked!")}>Click Me</ReusableButton>
);
export const Disabled = () => (
  <ReusableButton disabled>Disabled Button</ReusableButton>
);
export const LongContent = () => (
  <ReusableButton style={{ width: 200 }}>
    {"This is a very long button label that should overflow or wrap as needed."}
  </ReusableButton>
);
export const Overflow = () => (
  <div style={{ width: 100 }}>
    <ReusableButton style={{ width: "100%" }}>
      {"Overflow Button"}
    </ReusableButton>
  </div>
);
export const ErrorState = () => (
  <ReusableButton style={{ background: "#dc3545", color: "#fff" }}>
    Error Button
  </ReusableButton>
);
export const AccessibilityDemo = () => (
  <div>
    <ReusableButton
      aria-label="Accessible Button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") alert("Activated with keyboard!");
      }}
    >
      Keyboard Accessible Button
    </ReusableButton>
    <p>Try tabbing to the button and pressing Enter.</p>
  </div>
);
export const ThemingDemo = () => (
  <div style={{ background: "#222", padding: 16 }}>
    <ReusableButton
      style={{
        background: "#333",
        color: "#fff",
        border: "1px solid #555",
      }}
    >
      Dark Mode Button
    </ReusableButton>
    <ReusableButton
      style={{
        background: "#28a745",
        color: "#fff",
        border: "1px solid #155724",
      }}
    >
      Custom Color Button
    </ReusableButton>
    <ReusableButton style={{ fontSize: "1.5rem", padding: "1rem" }}>
      Large Font Button
    </ReusableButton>
  </div>
);
