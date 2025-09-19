import React, { useState } from "react";
import ReusableConfirmDialog from "../ReusableConfirmDialog";

export default {
  title: "Reusable/ConfirmDialog",
  component: ReusableConfirmDialog,
};

export const Default = (args) => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button onClick={() => setOpen(true)}>Show Dialog</button>
      <ReusableConfirmDialog
        isOpen={open}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
        onConfirm={() => {
          setOpen(false);
          alert("Confirmed!");
        }}
        onCancel={() => {
          setOpen(false);
          alert("Cancelled!");
        }}
        {...args}
      />
    </>
  );
};
