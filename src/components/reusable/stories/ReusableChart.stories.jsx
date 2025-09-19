import React from "react";
import ReusableChart from "../ReusableChart";

export default {
  title: "Reusable/ReusableChart",
  component: ReusableChart,
};

const data = {
  labels: ["Jan", "Feb", "Mar"],
  datasets: [
    {
      label: "Sales",
      data: [10, 20, 30],
      backgroundColor: "rgba(75,192,192,0.4)",
    },
  ],
};

export const Line = () => <ReusableChart type="line" data={data} />;
export const Bar = () => <ReusableChart type="bar" data={data} />;
export const Pie = () => <ReusableChart type="pie" data={data} />;
