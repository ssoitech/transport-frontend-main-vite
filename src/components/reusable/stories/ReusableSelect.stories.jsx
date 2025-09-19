import React from "react";
import ReusableSelect from "../ReusableSelect";

export default {
  title: "Reusable/ReusableSelect",
  component: ReusableSelect,
};

const options = [
  { value: "1", label: "One" },
  { value: "2", label: "Two" },
];

export const Default = () => (
  <ReusableSelect
    label="Number"
    name="number"
    value="1"
    onChange={() => {}}
    options={options}
  />
);
export const WithValue = () => (
  <ReusableSelect
    label="Number"
    name="number"
    value="2"
    onChange={() => {}}
    options={options}
  />
);
export const Empty = () => <ReusableSelect label="Empty" options={[]} />;
export const Disabled = () => (
  <ReusableSelect label="Disabled" options={options} disabled />
);
export const Error = () => (
  <ReusableSelect label="Error" options={options} error="Invalid selection" />
);
export const LongContent = () => (
  <ReusableSelect
    label="Long Content"
    options={[
      {
        value: "long",
        label:
          "A very long option label that should overflow and wrap or truncate",
      },
    ]}
  />
);
export const Overflow = () => (
  <div style={{ width: 120 }}>
    <ReusableSelect label="Overflow" options={options} />
  </div>
);
export const AccessibilityDemo = () => (
  <div>
    <ReusableSelect
      label="Accessible Select"
      name="accessible-select"
      aria-label="Accessible Select"
      aria-required="true"
      tabIndex={0}
      options={[
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ]}
      onChange={() => {}}
      autoFocus
    />
    <p>
      Try tabbing to the select and observe ARIA attributes and keyboard
      navigation.
    </p>
  </div>
);
export const ThemingDemo = () => (
  <div style={{ background: "#222", padding: 16 }}>
    <ReusableSelect
      label="Dark Mode Select"
      name="dark-select"
      options={[
        { value: "1", label: "One" },
        { value: "2", label: "Two" },
      ]}
      style={{
        background: "#333",
        color: "#fff",
        border: "1px solid #555",
      }}
    />
    <ReusableSelect
      label="Custom Color Select"
      name="success-select"
      options={[
        { value: "1", label: "One" },
        { value: "2", label: "Two" },
      ]}
      style={{
        background: "#28a745",
        color: "#fff",
        border: "1px solid #155724",
      }}
    />
    <ReusableSelect
      label="Large Font Select"
      name="large-select"
      options={[
        { value: "1", label: "One" },
        { value: "2", label: "Two" },
      ]}
      style={{ fontSize: "1.5rem", padding: "1rem" }}
    />
  </div>
);
