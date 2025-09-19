import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import PropTypes from "prop-types";

/**
 * ReusableChart - World-class chart component
 * @param {string} type - Chart type (line, bar, pie)
 * @param {object} data - Chart data
 * @param {object} options - Chart options
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableChart = React.memo(function ReusableChart({
  type,
  data,
  options,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  if (!data) return null;
  const chartProps = {
    className,
    style,
    "aria-label": ariaLabel,
    role,
    ...props,
  };
  switch (type) {
    case "bar":
      return <Bar data={data} options={options} {...chartProps} />;
    case "pie":
      return <Pie data={data} options={options} {...chartProps} />;
    case "line":
    default:
      return <Line data={data} options={options} {...chartProps} />;
  }
});

ReusableChart.propTypes = {
  type: PropTypes.oneOf(["line", "bar", "pie"]),
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableChart.defaultProps = {
  type: "line",
  options: {},
  className: "",
  style: {},
  ariaLabel: "Chart",
  role: "img",
};

export default ReusableChart;
