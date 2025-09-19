import React from "react";
import ReusableNavbar from "../ReusableNavbar";

export default {
  title: "Reusable/ReusableNavbar",
  component: ReusableNavbar,
  argTypes: {
    brand: { control: "text", description: "Brand name or element" },
    links: { control: "array", description: "Array of link labels" },
    activeLink: { control: "text", description: "Currently active link" },
    disabledLinks: {
      control: "array",
      description: "Indices of disabled links",
    },
    style: { control: "object", description: "Custom style object" },
    onLinkClick: {
      action: "link-click",
      description: "Callback for link click",
    },
  },
};

const Template = (args) => <ReusableNavbar {...args} />;

export const ControlsDemo = Template.bind({});
ControlsDemo.args = {
  brand: "Brand",
  links: ["Home", "Profile", "Settings"],
  activeLink: "Home",
  disabledLinks: [],
  style: {},
};

const links = ["Home", "Profile", "Settings"];
export const Default = () => (
  <ReusableNavbar brand="Brand" links={links} onLinkClick={() => {}} />
);

export const Empty = () => (
  <ReusableNavbar brand="Brand" links={[]} onLinkClick={() => {}} />
);

export const LongContent = () => (
  <ReusableNavbar
    brand="Brand"
    links={[
      "Very long link label that should overflow or wrap",
      "Profile",
      "Settings",
    ]}
    onLinkClick={() => {}}
  />
);

export const Overflow = () => (
  <div style={{ width: 120 }}>
    <ReusableNavbar brand="Brand" links={links} onLinkClick={() => {}} />
  </div>
);

export const ThemingDemo = () => (
  <div style={{ background: "#222", padding: 16 }}>
    <ReusableNavbar
      brand="Dark Mode Brand"
      links={["Home", "Profile", "Settings"]}
      style={{
        background: "#333",
        color: "#fff",
        border: "1px solid #555",
      }}
      onLinkClick={() => {}}
    />
    <ReusableNavbar
      brand="Custom Color Brand"
      links={["Home", "Profile", "Settings"]}
      style={{
        background: "#28a745",
        color: "#fff",
        border: "1px solid #155724",
      }}
      onLinkClick={() => {}}
    />
    <ReusableNavbar
      brand="Large Font Brand"
      links={["Home", "Profile", "Settings"]}
      style={{ fontSize: "1.5rem", padding: "1rem" }}
      onLinkClick={() => {}}
    />
  </div>
);

export const CustomRendererDemo = () => (
  <ReusableNavbar
    brand={
      <span style={{ color: "#007bff", fontWeight: "bold" }}>Custom Brand</span>
    }
    links={["Home", "Profile", "Settings"]}
    renderLink={(link, idx, active) => (
      <span
        key={idx}
        style={{
          padding: "8px 12px",
          background: active ? "#007bff" : "#f8f9fa",
          color: active ? "#fff" : "#333",
          borderRadius: 4,
          margin: 2,
          fontWeight: active ? "bold" : "normal",
          cursor: "pointer",
        }}
      >
        {link}
        {active && (
          <span style={{ marginLeft: 8, fontSize: 12 }}>(Active)</span>
        )}
      </span>
    )}
    activeLink="Profile"
    onLinkClick={() => {}}
  />
);

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
      <ReusableNavbar
        brand={<span style={{ fontSize: "1.2rem" }}>Mobile Brand</span>}
        links={["Home", "Profile", "Settings"]}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          padding: 8,
          fontSize: "1rem",
        }}
        onLinkClick={() => {}}
      />
    </div>
    <div style={{ padding: 16 }}>
      <p style={{ fontSize: "0.95rem" }}>
        Resize the Storybook preview to see the Navbar adapt to mobile width.
      </p>
    </div>
  </div>
);

/**
 * ## Props Table
 * | Prop         | Type     | Default | Description                          |
 * |--------------|----------|---------|--------------------------------------|
 * | brand        | string   |         | Brand name or element                |
 * | links        | string[] |         | Array of link labels                 |
 * | activeLink   | string   |         | Currently active link                |
 * | disabledLinks| number[] | []      | Indices of disabled links            |
 * | style        | object   | {}      | Custom style object                  |
 * | onLinkClick  | func     |         | Callback for link click              |
 * | renderLink   | func     |         | Custom link renderer (advanced)      |
 *
 * ## Usage Notes
 * - Use `brand` for your app or company name/logo.
 * - `links` should be an array of strings for navigation.
 * - Use `activeLink` to highlight the current page.
 * - `disabledLinks` disables specific links by index.
 * - Pass a `style` object for custom colors, fonts, or layout.
 * - Use `renderLink` for advanced custom rendering of links.
 *
 * ## Best Practices
 * - Keep link labels short for better mobile usability.
 * - Use semantic HTML and ARIA attributes for accessibility.
 * - Avoid excessive custom styling that breaks layout.
 * - Test with keyboard navigation and screen readers.
 */
