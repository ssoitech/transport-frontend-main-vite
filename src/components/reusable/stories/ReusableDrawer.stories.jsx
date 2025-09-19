import React, { useState } from "react";
import ReusableDrawer from "../ReusableDrawer";

export default {
  title: "Reusable/ReusableDrawer",
  component: ReusableDrawer,
};

export const Default = () => {
  const [open, setOpen] = useState(true);
  return (
    <ReusableDrawer isOpen={open} onClose={() => setOpen(false)}>
      <span>Drawer Content</span>
    </ReusableDrawer>
  );
};
