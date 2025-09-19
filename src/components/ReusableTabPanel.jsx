import React, { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";

// Example Theme Context (replace with your actual theme context)
const ThemeContext = React.createContext({
  activeTabColor: "#007bff",
  inactiveTabColor: "#f8f9fa",
  tabTextColor: "#0056b3",
  tabFontSize: "14px",
});

/**
 * ReusableTabPanel - Accessible, themeable tab navigation component
 * @param {Array} tabs - Array of { label: string, content: ReactNode }
 * @param {number} defaultIndex - Initial active tab index
 * @param {function} onTabChange - Callback when tab changes
 */
function ReusableTabPanel({ tabs, defaultIndex = 0, onTabChange }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const tabRefs = useRef([]);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (onTabChange) onTabChange(activeIndex);
  }, [activeIndex, onTabChange]);

  // Keyboard navigation
  const handleKeyDown = (e, idx) => {
    if (e.key === "ArrowRight") {
      const next = (idx + 1) % tabs.length;
      setActiveIndex(next);
      tabRefs.current[next].focus();
    } else if (e.key === "ArrowLeft") {
      const prev = (idx - 1 + tabs.length) % tabs.length;
      setActiveIndex(prev);
      tabRefs.current[prev].focus();
    }
  };

  return (
    <div className="tab-container" role="tablist" aria-label="Tab Panel">
      <div
        className="nav nav-tabs"
        style={{ display: "flex", borderBottom: "none" }}
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.label}
            ref={(el) => (tabRefs.current[idx] = el)}
            role="tab"
            aria-selected={activeIndex === idx}
            aria-controls={`tabpanel-${idx}`}
            tabIndex={activeIndex === idx ? 0 : -1}
            className="nav-link"
            style={{
              backgroundColor:
                activeIndex === idx ? "transparent" : theme.inactiveTabColor,
              color:
                activeIndex === idx ? theme.tabTextColor : theme.activeTabColor,
              borderBottom:
                activeIndex === idx
                  ? `3px solid ${theme.activeTabColor}`
                  : "none",
              fontSize: theme.tabFontSize,
              flex: 1,
              textAlign: "center",
            }}
            onClick={() => setActiveIndex(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, idx) => (
        <div
          key={tab.label}
          id={`tabpanel-${idx}`}
          role="tabpanel"
          aria-labelledby={`tab-${idx}`}
          hidden={activeIndex !== idx}
          style={{ padding: "1rem" }}
        >
          {activeIndex === idx && tab.content}
        </div>
      ))}
    </div>
  );
}

ReusableTabPanel.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    })
  ).isRequired,
  defaultIndex: PropTypes.number,
  onTabChange: PropTypes.func,
};

export default React.memo(ReusableTabPanel);
