import React from "react";
import PropTypes from "prop-types";

/**
 * ReusableStepper - World-class stepper component
 * @param {Array} steps - Step labels
 * @param {number} activeStep - Active step index
 * @param {function} onStepClick - Step click handler
 * @param {string} className - Custom class
 * @param {object} style - Inline styles
 * @param {string} ariaLabel - ARIA label
 * @param {string} role - ARIA role
 */
const ReusableStepper = React.memo(function ReusableStepper({
  steps,
  activeStep,
  onStepClick,
  className,
  style,
  ariaLabel,
  role,
  ...props
}) {
  return (
    <div
      className={`stepper ${className || ""}`}
      style={style}
      aria-label={ariaLabel}
      role={role}
      {...props}
    >
      {steps.map((step, idx) => (
        <div
          key={idx}
          className={`step${activeStep === idx ? " active" : ""}`}
          onClick={() => onStepClick(idx)}
          tabIndex={0}
          role="button"
          aria-label={`Step: ${step}`}
          aria-current={activeStep === idx ? "step" : undefined}
          onKeyDown={(e) =>
            (e.key === "Enter" || e.key === " ") && onStepClick(idx)
          }
        >
          {step}
        </div>
      ))}
    </div>
  );
});

ReusableStepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.node).isRequired,
  activeStep: PropTypes.number.isRequired,
  onStepClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  ariaLabel: PropTypes.string,
  role: PropTypes.string,
};

ReusableStepper.defaultProps = {
  className: "",
  style: {},
  ariaLabel: "Stepper",
  role: "group",
  steps: [],
  activeStep: 0,
};

export default ReusableStepper;
