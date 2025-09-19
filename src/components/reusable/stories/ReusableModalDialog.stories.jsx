import React, { useState } from "react";
import ReusableModalDialog from "../../ReusableModalDialog";

export default {
  title: "Reusable Components/ModalDialog",
  component: ReusableModalDialog,
};

export const Default = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <ReusableModalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Default Modal"
      >
        <div>This is the modal content.</div>
      </ReusableModalDialog>
    </>
  );
};

export const WithFooter = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <ReusableModalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Modal With Footer"
        footer={<button onClick={() => setOpen(false)}>Close</button>}
      >
        <div>Modal with custom footer actions.</div>
      </ReusableModalDialog>
    </>
  );
};

// Example with theming/context
const CustomThemeContext = React.createContext({
  modalBg: "#f8f9fa",
  modalHeaderBg: "#28a745",
  modalHeaderColor: "#fff",
  modalBorderRadius: "16px",
});

export const Themed = () => {
  const [open, setOpen] = useState(false);
  return (
    <CustomThemeContext.Provider
      value={{
        modalBg: "#f8f9fa",
        modalHeaderBg: "#28a745",
        modalHeaderColor: "#fff",
        modalBorderRadius: "16px",
      }}
    >
      <button onClick={() => setOpen(true)}>Open Themed Modal</button>
      <ReusableModalDialog
        open={open}
        onClose={() => setOpen(false)}
        title="Themed Modal"
      >
        <div>Modal with custom theme/context.</div>
      </ReusableModalDialog>
    </CustomThemeContext.Provider>
  );
};
