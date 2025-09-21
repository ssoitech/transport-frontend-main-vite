import React from "react";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableSection from "../../reusable/ReusableSection";
import ReusableToast from "../../reusable/ReusableToast";

/**
 * First Component (Billing Window)
 * - Refactored to use reusable layout and notification components
 * - No API logic present, so no React Query needed
 * - Follows SOLID, DRY, and world-class coding standards
 */
function First() {
  return (
    <ReusableSection title="Billing Workspace">
      <ReusableCard>
        {/* Notification using reusable toast */}
        <ReusableToast type="success" message="Start" />
        {/* Main content area for billing window */}
        <div>Hello From Billing Window</div>
      </ReusableCard>
    </ReusableSection>
  );
}

export default First;
