import React from "react";
import ReusableSidebar from "../ReusableSidebar";

export default {
  title: "Reusable/ReusableSidebar",
  component: ReusableSidebar,
  argTypes: {
    items: {
      control: "array",
      description: "Sidebar items (label, icon, disabled)",
    },
    activeItem: { control: "text", description: "Currently active item" },
    style: { control: "object", description: "Custom style object" },
    onItemClick: {
      action: "item-click",
      description: "Callback for item click",
    },
    renderItem: {
      control: false,
      description: "Custom item renderer function",
    },
  },
};

const Template = (args) => <ReusableSidebar {...args} />;

export const ControlsDemo = Template.bind({});
ControlsDemo.args = {
  items: [
    { label: "Home", icon: "🏠" },
    { label: "Profile", icon: "👤" },
    { label: "Settings", icon: "⚙️" },
  ],
  activeItem: "Home",
  style: {},
};

const items = ["Home", "Profile", "Settings"];
export const Default = () => (
  <ReusableSidebar items={items} onItemClick={() => {}} />
);
export const WithActive = () => (
  <ReusableSidebar items={items} onItemClick={() => {}} activeItem="Profile" />
);
export const Empty = () => <ReusableSidebar items={[]} />;
export const LongContent = () => (
  <ReusableSidebar
    items={[
      {
        label: "Very long sidebar item label that should overflow or wrap",
        icon: "📄",
      },
    ]}
  />
);
export const Overflow = () => (
  <div style={{ height: 60 }}>
    <ReusableSidebar items={items} onItemClick={() => {}} />
  </div>
);
export const Error = () => (
  <ReusableSidebar items={[{ label: "Error Item", icon: "❌" }]} />
);
export const DisabledItem = () => (
  <ReusableSidebar
    items={[
      { label: "Home", icon: "🏠" },
      { label: "Settings", icon: "⚙️", disabled: true },
    ]}
  />
);
export const AccessibilityDemo = () => (
  <ReusableSidebar
    items={[
      { label: "Home", icon: "🏠" },
      { label: "Settings", icon: "⚙️" },
    ]}
    aria-label="Accessible Sidebar"
    role="navigation"
    tabIndex={0}
    style={{ outline: "2px solid #007bff" }}
    onItemClick={() => {}}
  />
);

// Integration Demo: Sidebar + Navbar
import ReusableNavbar from "../ReusableNavbar";
export const IntegrationDemo = () => (
  <div style={{ display: "flex", flexDirection: "row", height: 200 }}>
    <ReusableSidebar
      items={[
        { label: "Home", icon: "🏠" },
        { label: "Profile", icon: "👤" },
        { label: "Settings", icon: "⚙️" },
      ]}
      activeItem="Home"
      style={{ minWidth: 120, borderRight: "1px solid #eee" }}
      onItemClick={() => {}}
    />
    <div style={{ flex: 1 }}>
      <ReusableNavbar
        brand="Integration Demo"
        links={["Home", "Profile", "Settings"]}
        style={{ borderBottom: "1px solid #eee" }}
        onLinkClick={() => {}}
      />
      <div style={{ padding: 16 }}>
        <p>Sidebar and Navbar working together in a layout.</p>
      </div>
    </div>
  </div>
);

// Custom Renderer Demo: Sidebar
export const CustomRendererDemo = () => (
  <ReusableSidebar
    items={[
      { label: "Home", icon: "🏠" },
      { label: "Profile", icon: "👤" },
      { label: "Settings", icon: "⚙️" },
    ]}
    renderItem={(item, idx, active) => (
      <div
        key={idx}
        style={{
          padding: "8px 16px",
          background: active ? "#007bff" : "#f8f9fa",
          color: active ? "#fff" : "#333",
          fontWeight: active ? "bold" : "normal",
          borderRadius: 4,
          margin: 2,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ marginRight: 8 }}>{item.icon}</span>
        {item.label}
        {active && (
          <span style={{ marginLeft: 8, fontSize: 12 }}>(Active)</span>
        )}
      </div>
    )}
    activeItem="Profile"
    onItemClick={() => {}}
  />
);

// Responsive Demo: Sidebar
export const ResponsiveDemo = () => (
  <div
    style={{
      maxWidth: 400,
      margin: "0 auto",
      border: "1px solid #eee",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <div style={{ width: "100%", minWidth: 0 }}>
      <ReusableSidebar
        items={[
          { label: "Home", icon: "🏠" },
          { label: "Profile", icon: "👤" },
          { label: "Settings", icon: "⚙️" },
        ]}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 8,
          fontSize: "1rem",
        }}
        onItemClick={() => {}}
      />
    </div>
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: "0.95rem" }}>
        Resize the Storybook preview to see the Sidebar adapt to mobile width.
      </p>
    </div>
  </div>
);

/**
 * ## Props Table
 * | Prop         | Type     | Default | Description                          |
 * |--------------|----------|---------|--------------------------------------|
 * | items        | array    |         | Sidebar items (label, icon, disabled)|
 * | activeItem   | string   |         | Currently active item                |
 * | style        | object   | {}      | Custom style object                  |
 * | onItemClick  | func     |         | Callback for item click              |
 * | renderItem   | func     |         | Custom item renderer (advanced)      |
 *
 * ## Usage Notes
 * - Use `items` for navigation or menu options.
 * - `activeItem` highlights the selected item.
 * - Pass a `style` object for custom colors, fonts, or layout.
 * - Use `renderItem` for advanced custom rendering of items.
 *
 * ## Best Practices
 * - Keep item labels short for better mobile usability.
 * - Use semantic HTML and ARIA attributes for accessibility.
 * - Avoid excessive custom styling that breaks layout.
 * - Test with keyboard navigation and screen readers.
 */
