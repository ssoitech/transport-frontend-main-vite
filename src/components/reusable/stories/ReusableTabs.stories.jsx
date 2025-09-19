import React, { useState } from "react";
import ReusableTabs from "../ReusableTabs";

export default {
  title: "Reusable/ReusableTabs",
  component: ReusableTabs,
  argTypes: {
    tabs: { control: "array", description: "Array of tab labels" },
    activeTab: { control: "text", description: "Currently active tab" },
    disabledTabs: { control: "array", description: "Indices of disabled tabs" },
    style: { control: "object", description: "Custom style object" },
    onTabClick: { action: "tab-click", description: "Callback for tab click" },
    renderTab: { control: false, description: "Custom tab renderer function" },
  },
};

const Template = (args) => <ReusableTabs {...args} />;

export const ControlsDemo = Template.bind({});
ControlsDemo.args = {
  tabs: ["Tab 1", "Tab 2", "Tab 3"],
  activeTab: "Tab 1",
  disabledTabs: [],
  style: {},
};

const tabs = ["Tab 1", "Tab 2", "Tab 3"];
export const Default = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <ReusableTabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
  );
};

export const Empty = () => (
  <ReusableTabs tabs={[]} activeTab={null} onTabClick={() => {}} />
);

export const LongContent = () => {
  const longTabs = [
    "Very long tab label that should overflow or wrap",
    "Tab 2",
    "Tab 3",
  ];
  const [activeTab, setActiveTab] = useState(longTabs[0]);
  return (
    <ReusableTabs
      tabs={longTabs}
      activeTab={activeTab}
      onTabClick={setActiveTab}
    />
  );
};

export const Overflow = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <div style={{ width: 120 }}>
      <ReusableTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
    </div>
  );
};

export const Error = () => {
  const errorTabs = ["Error Tab", "Tab 2", "Tab 3"];
  const [activeTab, setActiveTab] = useState(errorTabs[0]);
  return (
    <ReusableTabs
      tabs={errorTabs}
      activeTab={activeTab}
      onTabClick={setActiveTab}
    />
  );
};

export const DisabledTab = () => {
  // Assuming ReusableTabs supports a 'disabledTabs' prop as array of indices
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <ReusableTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabClick={setActiveTab}
      disabledTabs={[1]}
    />
  );
};

export const AccessibilityDemo = () => {
  const tabs = ["Tab 1", "Tab 2", "Tab 3"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  return (
    <div>
      <ReusableTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
        aria-label="Accessible Tabs"
        role="tablist"
        tabIndex={0}
        style={{ outline: "2px solid #007bff" }}
      />
      <p>
        Tab to the tabs and use arrow keys for navigation. ARIA attributes and
        roles are set.
      </p>
    </div>
  );
};

// Custom Renderer Demo: Tabs
export const CustomRendererDemo = () => {
  const tabs = ["Tab 1", "Tab 2", "Tab 3"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  return (
    <ReusableTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabClick={setActiveTab}
      renderTab={(tab, idx, active) => (
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
          {tab}
          {active && (
            <span style={{ marginLeft: 8, fontSize: 12 }}>(Active)</span>
          )}
        </span>
      )}
    />
  );
};

// Integration Demo: Tabs + Table
import ReusableTable from "../ReusableTable";
export const TabsWithTableDemo = () => {
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Age", accessor: "age" },
  ];
  const allData = {
    "Tab 1": [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 },
    ],
    "Tab 2": [
      { name: "Charlie", age: 40 },
      { name: "Diana", age: 22 },
    ],
    "Tab 3": [{ name: "Eve", age: 35 }],
  };
  const tabs = Object.keys(allData);
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  return (
    <div>
      <ReusableTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <ReusableTable
        columns={columns}
        data={allData[activeTab]}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export const ResponsiveDemo = () => {
  const tabs = ["Home", "Profile", "Settings"];
  const [activeTab, setActiveTab] = React.useState(tabs[0]);
  return (
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
        <ReusableTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            padding: 8,
            fontSize: "1rem",
          }}
        />
      </div>
      <div style={{ padding: 16 }}>
        <p style={{ fontSize: "0.95rem" }}>
          Resize the Storybook preview to see the Tabs adapt to mobile width.
        </p>
      </div>
    </div>
  );
};

/**
 * ## Props Table
 * | Prop         | Type     | Default | Description                          |
 * |--------------|----------|---------|--------------------------------------|
 * | tabs         | array    |         | Array of tab labels                  |
 * | activeTab    | string   |         | Currently active tab                 |
 * | disabledTabs | number[] | []      | Indices of disabled tabs             |
 * | style        | object   | {}      | Custom style object                  |
 * | onTabClick   | func     |         | Callback for tab click               |
 * | renderTab    | func     |         | Custom tab renderer (advanced)       |
 *
 * ## Usage Notes
 * - Use `tabs` for navigation or content sections.
 * - `activeTab` highlights the selected tab.
 * - Pass a `style` object for custom colors, fonts, or layout.
 * - Use `renderTab` for advanced custom rendering of tabs.
 *
 * ## Best Practices
 * - Keep tab labels short for better mobile usability.
 * - Use semantic HTML and ARIA attributes for accessibility.
 * - Avoid excessive custom styling that breaks layout.
 * - Test with keyboard navigation and screen readers.
 */
