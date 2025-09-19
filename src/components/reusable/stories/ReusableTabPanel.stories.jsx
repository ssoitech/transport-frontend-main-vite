import React from "react";
import ReusableTabPanel from "../../ReusableTabPanel";

export default {
  title: "Reusable Components/TabPanel",
  component: ReusableTabPanel,
};

const tabData = [
  {
    label: "Summary 1",
    content: <div>Content for Summary 1</div>,
  },
  {
    label: "Summary 2",
    content: <div>Content for Summary 2</div>,
  },
  {
    label: "Summary 3",
    content: <div>Content for Summary 3</div>,
  },
];

export const Default = () => (
  <ReusableTabPanel tabs={tabData} defaultIndex={0} />
);

export const WithCallback = () => (
  <ReusableTabPanel
    tabs={tabData}
    defaultIndex={1}
    onTabChange={(idx) => alert(`Tab changed to ${tabData[idx].label}`)}
  />
);

// Example with theming/context
const CustomThemeContext = React.createContext({
  activeTabColor: "#28a745",
  inactiveTabColor: "#f8f9fa",
  tabTextColor: "#155724",
  tabFontSize: "16px",
});

export const Themed = () => (
  <CustomThemeContext.Provider
    value={{
      activeTabColor: "#28a745",
      inactiveTabColor: "#f8f9fa",
      tabTextColor: "#155724",
      tabFontSize: "16px",
    }}
  >
    <ReusableTabPanel tabs={tabData} defaultIndex={0} />
  </CustomThemeContext.Provider>
);
export const Empty = () => <ReusableTabPanel tabs={[]} defaultIndex={0} />;
export const LongContent = () => (
  <ReusableTabPanel
    tabs={[
      {
        label: "Long Content",
        content: <div>{"Very long panel content ".repeat(20)}</div>,
      },
    ]}
    defaultIndex={0}
  />
);
export const Overflow = () => (
  <div style={{ width: 120 }}>
    <ReusableTabPanel
      tabs={[{ label: "Overflow", content: <span>Overflow Content</span> }]}
      defaultIndex={0}
    />
  </div>
);
export const Error = () => (
  <ReusableTabPanel
    tabs={[
      {
        label: "Error",
        content: (
          <span style={{ color: "#dc3545" }}>Error: Something went wrong.</span>
        ),
      },
    ]}
    defaultIndex={0}
  />
);
export const DisabledPanel = () => (
  <ReusableTabPanel
    tabs={[{ label: "Disabled", content: <span>Panel Content</span> }]}
    defaultIndex={0}
    disabled
  />
);
export const AccessibilityDemo = () => (
  <ReusableTabPanel
    tabs={[
      { label: "Tab 1", content: <div>Content 1</div> },
      { label: "Tab 2", content: <div>Content 2</div> },
    ]}
    defaultIndex={0}
    aria-label="Accessible Tab Panel"
    role="tabpanel"
    tabIndex={0}
    style={{ outline: "2px solid #007bff" }}
  />
);
