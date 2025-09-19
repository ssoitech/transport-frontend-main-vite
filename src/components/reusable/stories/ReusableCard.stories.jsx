import React from "react";
import ReusableCard from "../ReusableCard";

export default {
  title: "Reusable/ReusableCard",
  component: ReusableCard,
};

export const Default = () => (
  <ReusableCard title="Card Title" footer={<span>Footer</span>}>
    <span>Card Content</span>
  </ReusableCard>
);
export const Empty = () => <ReusableCard title="Empty Card" />;
export const LongContent = () => (
  <ReusableCard title="Long Content Card">
    {"This is a very long card content. ".repeat(20)}
  </ReusableCard>
);
export const Overflow = () => (
  <div style={{ width: 120 }}>
    <ReusableCard title="Overflow Card">
      <span>Overflow Content</span>
    </ReusableCard>
  </div>
);
export const Error = () => (
  <ReusableCard title="Error Card">
    <span style={{ color: "#dc3545" }}>Error: Something went wrong.</span>
  </ReusableCard>
);
export const DisabledFooter = () => (
  <ReusableCard
    title="Card Title"
    footer={<span style={{ color: "#ccc" }}>Disabled Footer</span>}
  >
    <span>Card Content</span>
  </ReusableCard>
);
export const AccessibilityDemo = () => (
  <ReusableCard
    title="Accessible Card"
    aria-label="Accessible Card"
    tabIndex={0}
    footer={<span aria-label="Card Footer">Footer</span>}
    style={{ outline: "2px solid #007bff" }}
  >
    <span aria-label="Card Content">Card Content</span>
    <p>Tab to the card to see focus ring and ARIA attributes.</p>
  </ReusableCard>
);
export const ThemingDemo = () => (
  <div style={{ background: "#222", padding: 16 }}>
    <ReusableCard
      title="Dark Mode Card"
      style={{
        background: "#333",
        color: "#fff",
        border: "1px solid #555",
      }}
      footer={<span style={{ color: "#aaa" }}>Dark Footer</span>}
    >
      <span>Dark Mode Content</span>
    </ReusableCard>
    <ReusableCard
      title="Custom Color Card"
      style={{
        background: "#28a745",
        color: "#fff",
        border: "1px solid #155724",
      }}
      footer={<span style={{ color: "#fff" }}>Success Footer</span>}
    >
      <span>Success Content</span>
    </ReusableCard>
    <ReusableCard
      title="Large Font Card"
      style={{ fontSize: "1.5rem", padding: "1rem" }}
      footer={<span style={{ fontSize: "1.2rem" }}>Large Footer</span>}
    >
      <span>Large Font Content</span>
    </ReusableCard>
  </div>
);
