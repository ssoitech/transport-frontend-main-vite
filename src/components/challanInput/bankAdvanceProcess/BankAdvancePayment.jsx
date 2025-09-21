import React from "react";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableSection from "../../reusable/ReusableSection";
import ReusableForm from "../../reusable/ReusableForm";
import ReusableInput from "../../reusable/ReusableInput";
import ReusableSelect from "../../reusable/ReusableSelect";
import ReusableButton from "../../reusable/ReusableButton";
import { useForm } from "react-hook-form";
import { useApiQuery } from "../../../hooks/api/useApiQuery";

/**
 * BankAdvancePayment Component
 * - Refactored to use reusable card, section, form, input, select, and button components
 * - API logic for payment data uses generic useApiQuery hook (SOLID, DRY)
 * - Follows world-class coding standards and maintainability
 */
function BankAdvancePayment() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Example: Fetch payment data using React Query generic hook
  const {
    data: paymentData,
    isLoading,
    error,
  } = useApiQuery({
    key: "bank-advance-payment",
    url: "/api/bank-advance-payment", // Replace with actual endpoint
    method: "get",
    select: (data) => data || {},
  });

  const onSubmit = (formData) => {
    // TODO: Replace with mutation using useApiMutation if saving to backend
    console.log(formData);
  };

  return (
    <ReusableSection title="Bank Advance Payment">
      <ReusableCard>
        {/* Loader for async data */}
        {isLoading && <div>Loading...</div>}
        {/* Error display */}
        {error && (
          <div className="text-danger">Error loading payment data.</div>
        )}
        {/* Main payment form */}
        <ReusableForm onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-md-4">
              <ReusableInput
                label="TP Number"
                {...register("tpNumber")}
                error={errors.tpNumber}
              />
            </div>
            <div className="col-md-4">
              <ReusableInput
                label="Vehicle Number"
                {...register("vehicleNumber")}
                error={errors.vehicleNumber}
              />
            </div>
            <div className="col-md-4">
              <ReusableInput
                label="Paid Amount"
                type="number"
                {...register("paidAmount")}
                error={errors.paidAmount}
              />
            </div>
          </div>
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <ReusableSelect
                label="Payment Type"
                {...register("paymentType")}
                error={errors.paymentType}
                options={[
                  { value: "", label: "Select" },
                  { value: "Cash", label: "Cash" },
                  { value: "Online", label: "Online" },
                ]}
              />
            </div>
            <div className="col-md-4">
              <ReusableSelect
                label="Bank Name"
                {...register("bankName")}
                error={errors.bankName}
                options={[
                  { value: "", label: "Select" },
                  { value: "HDFC", label: "HDFC" },
                  { value: "SBI", label: "SBI" },
                ]}
              />
            </div>
            <div className="col-md-4">
              <ReusableInput
                label="Paid On"
                type="date"
                {...register("paidOn")}
                error={errors.paidOn}
              />
            </div>
          </div>
          <div className="mt-3">
            <ReusableButton type="submit" variant="success" className="me-2">
              Save Payment
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="danger"
              onClick={() => reset()}
            >
              Clear
            </ReusableButton>
          </div>
        </ReusableForm>
      </ReusableCard>
    </ReusableSection>
  );
}

export default BankAdvancePayment;
