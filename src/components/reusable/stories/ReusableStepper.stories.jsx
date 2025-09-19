import React, { useState } from "react";
import ReusableStepper from "../ReusableStepper";

export default {
  title: "Reusable/ReusableStepper",
  component: ReusableStepper,
};

const steps = ["Step 1", "Step 2", "Step 3"];
export const Default = () => {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <ReusableStepper
      steps={steps}
      activeStep={activeStep}
      onStepClick={setActiveStep}
    />
  );
};
export const Empty = () => <ReusableStepper steps={[]} activeStep={0} />;
export const LongContent = () => (
  <ReusableStepper
    steps={["Very long step label that should overflow or wrap", "Step 2"]}
    activeStep={0}
  />
);
export const Overflow = () => (
  <div style={{ width: 120 }}>
    <ReusableStepper steps={steps} activeStep={0} />
  </div>
);
export const Error = () => (
  <ReusableStepper steps={["Error Step"]} activeStep={0} />
);
export const DisabledStep = () => (
  <ReusableStepper
    steps={["Step 1", "Step 2"]}
    activeStep={0}
    disabledSteps={[1]}
  />
);
export const AccessibilityDemo = () => {
  const steps = ["Step 1", "Step 2", "Step 3"];
  const [activeStep, setActiveStep] = React.useState(0);
  return (
    <div>
      <ReusableStepper
        steps={steps}
        activeStep={activeStep}
        onStepClick={setActiveStep}
        aria-label="Accessible Stepper"
        role="list"
        tabIndex={0}
        style={{ outline: "2px solid #007bff" }}
      />
      <p>
        Tab to the stepper and use arrow keys for navigation. ARIA attributes
        and roles are set.
      </p>
    </div>
  );
};
