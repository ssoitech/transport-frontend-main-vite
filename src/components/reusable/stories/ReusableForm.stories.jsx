import React from "react";
import ReusableForm from "../ReusableForm";

export default {
  title: "Reusable/ReusableForm",
  component: ReusableForm,
};

export const Default = () => (
  <ReusableForm
    onSubmit={(e) => {
      e.preventDefault();
      alert("Submitted!");
    }}
  >
    <input name="name" placeholder="Name" />
    <button type="submit">Submit</button>
  </ReusableForm>
);
export const Empty = () => <ReusableForm onSubmit={() => {}}></ReusableForm>;
export const Disabled = () => (
  <ReusableForm onSubmit={() => {}}>
    <input name="name" placeholder="Name" disabled />
    <button type="submit" disabled>
      Submit
    </button>
  </ReusableForm>
);
export const Error = () => (
  <ReusableForm onSubmit={() => {}}>
    <input name="name" placeholder="Name" style={{ borderColor: "#dc3545" }} />
    <div style={{ color: "#dc3545" }}>Error: Name is required.</div>
    <button type="submit">Submit</button>
  </ReusableForm>
);
export const LongContent = () => (
  <ReusableForm onSubmit={() => {}}>
    <textarea
      name="description"
      rows={5}
      defaultValue={
        "This is a very long description that should wrap or overflow as needed."
      }
    />
    <button type="submit">Submit</button>
  </ReusableForm>
);
export const Overflow = () => (
  <div style={{ width: 120 }}>
    <ReusableForm onSubmit={() => {}}>
      <input name="name" placeholder="Name" style={{ width: "100%" }} />
      <button type="submit" style={{ width: "100%" }}>
        Submit
      </button>
    </ReusableForm>
  </div>
);
export const AccessibilityDemo = () => (
  <ReusableForm
    aria-label="Accessible Form"
    role="form"
    onSubmit={(e) => {
      e.preventDefault();
      alert("Form submitted via keyboard!");
    }}
  >
    <input
      name="name"
      placeholder="Name"
      aria-label="Name"
      aria-required="true"
      tabIndex={0}
      autoFocus
    />
    <button type="submit" aria-label="Submit Form">
      Submit
    </button>
    <p>
      Tab to the input and button, observe ARIA attributes and keyboard
      submission.
    </p>
  </ReusableForm>
);
export const ThemingDemo = () => (
  <div style={{ background: "#222", padding: 16 }}>
    <ReusableForm
      onSubmit={(e) => {
        e.preventDefault();
        alert("Dark Mode Submit!");
      }}
      style={{
        background: "#333",
        color: "#fff",
        border: "1px solid #555",
        padding: 16,
      }}
    >
      <input
        name="name"
        placeholder="Dark Mode Name"
        style={{
          background: "#444",
          color: "#fff",
          border: "1px solid #555",
        }}
      />
      <button
        type="submit"
        style={{
          background: "#28a745",
          color: "#fff",
          border: "1px solid #155724",
        }}
      >
        Submit
      </button>
    </ReusableForm>
    <ReusableForm
      onSubmit={(e) => {
        e.preventDefault();
        alert("Large Font Submit!");
      }}
      style={{ fontSize: "1.5rem", padding: "1rem" }}
    >
      <input
        name="name"
        placeholder="Large Font Name"
        style={{ fontSize: "1.2rem" }}
      />
      <button type="submit" style={{ fontSize: "1.2rem" }}>
        Submit
      </button>
    </ReusableForm>
  </div>
);
export const IntegrationDemo = () => (
  <ReusableForm
    onSubmit={(e) => {
      e.preventDefault();
      alert("Form with Input, Select, and Button submitted!");
    }}
    style={{ padding: 24, background: "#f8f9fa", borderRadius: 8 }}
  >
    <div style={{ marginBottom: 16 }}>
      <label htmlFor="name">Name:</label>
      <input
        id="name"
        name="name"
        placeholder="Name"
        style={{ marginLeft: 8 }}
      />
    </div>
    <div style={{ marginBottom: 16 }}>
      <label htmlFor="role">Role:</label>
      <select id="role" name="role" style={{ marginLeft: 8 }}>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
    </div>
    <button
      type="submit"
      style={{
        background: "#007bff",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: 4,
      }}
    >
      Submit
    </button>
  </ReusableForm>
);
