import React from "react";
import { useForm } from "react-hook-form";
import ReusableForm from "../../reusable/ReusableForm";
import ReusableInput from "../../reusable/ReusableInput";
import ReusableSelect from "../../reusable/ReusableSelect";
import ReusableButton from "../../reusable/ReusableButton";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableTable from "../../reusable/ReusableTable";
import ReusableSection from "../../reusable/ReusableSection";

/**
 * BankAdvanceEntry Component
 * - Refactored to use reusable form, input, select, button, card, table, and section components
 * - API logic (e.g., Get TP Details) should use useApiQuery from hooks/api/useApiQuery.js
 * - Follows SOLID, DRY, and world-class coding standards
 * - All major functionality is commented for maintainability
 */
function BankAdvanceEntry() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Example: Use React Query for TP details (replace with actual endpoint)
  // const { data: tpDetails, isLoading: tpLoading } = useApiQuery({
  //   key: 'tp-details',
  //   url: '/api/tp-details',
  //   method: 'get',
  //   params: { tpNumber },
  // });

  const onSubmit = (data) => {
    // TODO: Replace with mutation using useApiMutation if saving to backend
    console.log(data);
  };

  // Table columns for bank account info
  const bankTableColumns = [
    { Header: "Bank Account Number", accessor: "accountNumber" },
    { Header: "IFS Code", accessor: "ifsCode" },
    { Header: "Bank Name", accessor: "bankName" },
    { Header: "Branch Name", accessor: "branchName" },
    { Header: "Status", accessor: "status" },
  ];
  // Example static data (replace with API data if needed)
  const bankTableData = [
    {
      accountNumber: "1234567890",
      ifsCode: "SBIN000123",
      bankName: "SBI",
      branchName: "Main Branch",
      status: "Active",
    },
  ];

  return (
    <ReusableSection title="Bank Advance Entry">
      <ReusableCard>
        {/* Main Form */}
        <ReusableForm onSubmit={handleSubmit(onSubmit)}>
          {/* Row 1: TP Number & Get Details */}
          <div className="row g-3">
            <div className="col-md-4">
              <ReusableInput
                label="TP Number"
                {...register("tpNumber")}
                error={errors.tpNumber}
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <ReusableButton type="button" variant="primary">
                Get TP Details
              </ReusableButton>
            </div>
          </div>

          {/* Row 2: Vehicle Info */}
          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <ReusableInput
                label="Vehicle Number"
                {...register("vehicleNumber")}
                error={errors.vehicleNumber}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="Challan Date"
                type="date"
                {...register("challanDate")}
                error={errors.challanDate}
              />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <ReusableButton type="button" variant="secondary">
                Get Vehicle
              </ReusableButton>
            </div>
            <div className="col-md-4">
              <ReusableInput
                label="With Owner"
                {...register("withOwner")}
                error={errors.withOwner}
              />
            </div>
          </div>

          {/* Row 3: Driver/Office/Challan/Vehicle Type */}
          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <ReusableInput
                label="Driver Welfare"
                type="number"
                {...register("driverWelfare")}
                error={errors.driverWelfare}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="Office Exp."
                type="number"
                {...register("officeExp")}
                error={errors.officeExp}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="Challan Number"
                {...register("challanNumber")}
                error={errors.challanNumber}
              />
            </div>
            <div className="col-md-3">
              <ReusableSelect
                label="Vehicle Type"
                {...register("vehicleType")}
                error={errors.vehicleType}
                options={[
                  { value: "", label: "Select" },
                  { value: "Non-Union", label: "Non-Union" },
                  { value: "Union", label: "Union" },
                ]}
              />
            </div>
          </div>

          {/* Row 4: Paid Qty, Rates, Amounts */}
          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <ReusableInput
                label="Paid Qty."
                type="number"
                {...register("paidQty")}
                error={errors.paidQty}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="Master Rate"
                type="number"
                {...register("masterRate")}
                error={errors.masterRate}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="Freight Rate"
                type="number"
                {...register("freightRate")}
                error={errors.freightRate}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="Freight Amount"
                type="number"
                {...register("freightAmount")}
                error={errors.freightAmount}
              />
            </div>
          </div>

          {/* Row 5: Advances, Petrol Pump, HSD Slip */}
          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <ReusableInput
                label="Cash Advance"
                type="number"
                {...register("cashAdvance")}
                error={errors.cashAdvance}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="HSD Advance"
                type="number"
                {...register("hsdAdvance")}
                error={errors.hsdAdvance}
              />
            </div>
            <div className="col-md-3">
              <ReusableSelect
                label="Petrol Pump"
                {...register("petrolPump")}
                error={errors.petrolPump}
                options={[
                  { value: "", label: "Select" },
                  { value: "Pump1", label: "Pump 1" },
                  { value: "Pump2", label: "Pump 2" },
                ]}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="HSD Slip"
                {...register("hsdSlip")}
                error={errors.hsdSlip}
              />
            </div>
          </div>

          {/* Row 6: Cash+HSD, Balance Due, After Bank Advance */}
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <ReusableInput
                label="Cash + HSD"
                type="number"
                {...register("cashHsd")}
                error={errors.cashHsd}
              />
            </div>
            <div className="col-md-4">
              <ReusableInput
                label="Balance Due"
                type="number"
                {...register("balanceDue")}
                error={errors.balanceDue}
              />
            </div>
            <div className="col-md-4">
              <ReusableInput
                label="Balance After Bank Advance"
                type="number"
                {...register("balanceAfterBank")}
                error={errors.balanceAfterBank}
              />
            </div>
          </div>

          {/* Row 7: Bank Advance, Payment Type, From Bank, Paid On */}
          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <ReusableInput
                label="Bank Advance"
                type="number"
                {...register("bankAdvance")}
                error={errors.bankAdvance}
              />
            </div>
            <div className="col-md-3">
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
            <div className="col-md-3">
              <ReusableSelect
                label="From Bank"
                {...register("fromBank")}
                error={errors.fromBank}
                options={[
                  { value: "", label: "Select" },
                  { value: "HDFC", label: "HDFC" },
                  { value: "SBI", label: "SBI" },
                ]}
              />
            </div>
            <div className="col-md-3">
              <ReusableInput
                label="Paid On"
                type="date"
                {...register("paidOn")}
                error={errors.paidOn}
              />
            </div>
          </div>

          {/* Row 8: Left Column - Remarks, Agent/Broker, Deductions */}
          <div className="row g-3 mt-3">
            <div className="col-md-4">
              <ReusableInput
                label="Bank Remark"
                as="textarea"
                rows={2}
                {...register("bankRemark")}
                error={errors.bankRemark}
              />
              <ReusableSelect
                label="Agent/Broker"
                {...register("agentBroker")}
                error={errors.agentBroker}
                options={[
                  { value: "", label: "Select" },
                  { value: "Agent1", label: "Agent 1" },
                  { value: "Broker1", label: "Broker 1" },
                ]}
              />
              <ReusableInput
                label="Other Deduction"
                type="number"
                {...register("otherDeduction")}
                error={errors.otherDeduction}
              />
              <ReusableInput
                label="OD Towards"
                as="textarea"
                rows={2}
                {...register("odTowards")}
                error={errors.odTowards}
              />
              <div className="mt-3">
                <ReusableButton
                  type="submit"
                  variant="success"
                  className="me-2"
                >
                  Save
                </ReusableButton>
                <ReusableButton
                  type="button"
                  variant="danger"
                  onClick={() => reset()}
                >
                  Clear
                </ReusableButton>
              </div>
            </div>

            {/* Right Column - Bank Table & Entry Info */}
            <div className="col-md-8">
              <ReusableTable columns={bankTableColumns} data={bankTableData} />
              <div className="float-right">
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <ReusableInput
                      label="Entry By"
                      {...register("entryBy")}
                      error={errors.entryBy}
                    />
                    <ReusableInput
                      label="Entry Date"
                      {...register("entryDate")}
                      error={errors.entryDate}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-md-6">
                    <ReusableInput
                      label="Updated By"
                      {...register("updatedBy")}
                      error={errors.updatedBy}
                    />
                    <ReusableInput
                      label="Updated Date"
                      {...register("updatedDate")}
                      error={errors.updatedDate}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ReusableForm>
      </ReusableCard>
    </ReusableSection>
  );
}

export default BankAdvanceEntry;
