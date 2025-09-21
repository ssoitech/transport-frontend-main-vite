import React, { useEffect, useState } from "react";
import PdfComponent from "./challanPaymentComponents/PdfComponent";
import InvoiceGenerator from "./challanPaymentComponents/InvoiceGenerator";
import ModalChallanPayment from "./modalChallanPayment/ModalChallanPayment";
import { useForm, Controller } from "react-hook-form";
// Reusable components
import ReusableCard from "../reusable/ReusableCard";
import ReusableInput from "../reusable/ReusableInput";
import ReusableButton from "../reusable/ReusableButton";
import ReusableDatePicker from "../reusable/ReusableDatePicker";
import ReusableTable from "../reusable/ReusableTable";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableToast from "../reusable/ReusableToast";
// React Query generic hook
import { useApiQuery } from "../../hooks/api/useApiQuery";

/**
 * ChallanPaymentSingle: Single challan payment UI.
 * - Uses reusable components for form, input, button, card, table, loader, and toast.
 * - Migrates API logic to useApiQuery for fetching payment details.
 * - Business logic for transformation and validation is preserved.
 */
function ChallanPaymentSingle() {
  // Removed unused pdfPreview state
  const [displayModal, setDisplayModal] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");

  // Fetch payment details using React Query generic hook
  const {
    data: paymentDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useApiQuery({
    key: "paymentDetails",
    url: referenceNumber
      ? `/api/v1/get/details-for-payment/${referenceNumber}`
      : "",
    method: "get",
    enabled: !!referenceNumber,
    select: (data) => ({
      challanDetails: data.challanDetails || [],
      referenceDetails: data.referenceDetails ? data.referenceDetails[0] : {},
    }),
    retry: 1,
    staleTime: 60000,
    cacheTime: 300000,
  });

  // Form state for react-hook-form
  const {
    register: registerPaymentSection,
    handleSubmit: handlePaymentSection,
  } = useForm();

  const { setValue: setFirstSectionValue, register: registerFirstSection } =
    useForm();

  // Sync reference details to form when fetched
  useEffect(() => {
    if (paymentDetails?.referenceDetails) {
      setFirstSectionValue(
        "challanHolder",
        paymentDetails.referenceDetails.challan_holder_name
      );
      setFirstSectionValue(
        "contactNumber",
        paymentDetails.referenceDetails.contact_number
      );
      setFirstSectionValue(
        "panNumber",
        paymentDetails.referenceDetails.pan_number
      );
      const accDetails = `A/C No - ${paymentDetails.referenceDetails.account_number}, ${paymentDetails.referenceDetails.bank_name}, ${paymentDetails.referenceDetails.branch}, IFSC - ${paymentDetails.referenceDetails.ifsc_code}`;
      setFirstSectionValue("bankDetails", accDetails);
    }
  }, [paymentDetails?.referenceDetails, setFirstSectionValue]);

  function handlePdf() {
    setDisplayModal(true);
  }

  // Search handler triggers refetch
  const handleSearch = () => {
    refetch();
  };

  const onSubmitPaymentSectionData = (data) => {
    console.log("Form Data:", data);
    alert(`Form Submitted! Name`);
  };

  // Table columns for ReusableTable
  const tableColumns = [
    { Header: "S.L No", accessor: (row, i) => i + 1 },
    { Header: "Status", accessor: "status" },
    { Header: "Load Date", accessor: "loadDate" },
    { Header: "TP Number", accessor: "tpNumber" },
    { Header: "Truck Number", accessor: "truckNumber" },
    { Header: "Load Weight", accessor: "loadWeight" },
    { Header: "Net Unloaded", accessor: "netUnloaded" },
    { Header: "Vehicle Rate", accessor: "vehicleRate" },
    { Header: "Freight", accessor: "freight" },
    { Header: "Shortage Rate", accessor: "shortageRate" },
    { Header: "HSD Advance", accessor: "hsdAdvance" },
    { Header: "Cash Advance", accessor: "cashAdvance" },
    { Header: "Bank Advance", accessor: "bankAdvance" },
    { Header: "Net Payable", accessor: "netPayable" },
    { Header: "Office Expenses", accessor: "officeExpenses" },
    { Header: "Other Deduction", accessor: "otherDeduction" },
    { Header: "Total Deduction", accessor: "totalDeduction" },
    { Header: "Short Name", accessor: "shortName" },
    { Header: "Loading Point Name", accessor: "loadingPointName" },
    { Header: "Unloading Point Name", accessor: "unloadingPointName" },
  ];

  return (
    <div className="work-space-container">
      <ReusableCard style={{ marginBottom: 16, padding: 16 }}>
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">Challan Payment</span>
        </div>
        {/* Loader and error toast for payment details */}
        {isLoading && <ReusableLoader message="Loading payment details..." />}
        {isError && (
          <ReusableToast
            type="error"
            message={error?.message || "Error loading payment details"}
            autoClose={false}
          />
        )}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          {/* Reference Number Input */}
          <div style={{ minWidth: 180 }}>
            <label htmlFor="referenceNumber">Received on Ref No.</label>
            <ReusableInput
              type="text"
              id="referenceNumber"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              size="sm"
            />
          </div>
          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <ReusableButton
              type="button"
              variant="primary"
              size="sm"
              style={{ marginTop: 24 }}
              onClick={handleSearch}
            >
              Search
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="outline-primary"
              size="sm"
              style={{ marginTop: 24 }}
            >
              New
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="primary"
              size="sm"
              style={{ marginTop: 24 }}
            >
              Delete
            </ReusableButton>
          </div>
          {/* Date To Picker */}
          <div style={{ minWidth: 180 }}>
            <label htmlFor="receivedOn">Date To</label>
            <ReusableDatePicker
              id="receivedOn"
              name="receivedOn"
              // value={receivedFromDate}
              // onChange={handleFromDateChange}
              required
              size="sm"
              placeholder="Select a date"
            />
          </div>
          {/* Vehicle No Input */}
          <div style={{ minWidth: 180 }}>
            <label htmlFor="vehicleNo">Search On Vehicle No.</label>
            <ReusableInput type="text" id="vehicleNo" size="sm" />
          </div>
        </div>
        {/* First Section Form */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div style={{ minWidth: 180 }}>
            <label htmlFor="challanHolder">Challan Holder</label>
            <ReusableInput
              type="text"
              id="challanHolder"
              name="challanHolder"
              {...registerFirstSection("challanHolder")}
              size="sm"
            />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <ReusableButton
              type="button"
              variant="secondary"
              size="sm"
              style={{ marginTop: 24 }}
            >
              Pending
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="outline-primary"
              size="sm"
              style={{ marginTop: 24 }}
            >
              Earlier Payment
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="danger"
              size="sm"
              style={{ marginTop: 24 }}
            >
              Voucher
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="primary"
              size="sm"
              style={{ marginTop: 24 }}
              onClick={handlePdf}
            >
              Print A4
            </ReusableButton>
            <ReusableButton
              type="button"
              variant="outline-primary"
              size="sm"
              style={{ marginTop: 24 }}
            >
              Excel
            </ReusableButton>
          </div>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="updatedBy">Updated By</label>
            <ReusableInput type="text" id="updatedBy" size="sm" />
          </div>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="updatedDate">Updated Date</label>
            <ReusableInput type="text" id="updatedDate" size="sm" />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 16,
          }}
        >
          <div style={{ minWidth: 180 }}>
            <label htmlFor="contactNumber">Contact No</label>
            <ReusableInput
              type="number"
              id="contactNumber"
              name="contactNumber"
              {...registerFirstSection("contactNumber")}
              size="sm"
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <label htmlFor="panNumber">PAN</label>
            <ReusableInput
              type="text"
              id="panNumber"
              name="panNumber"
              {...registerFirstSection("panNumber")}
              size="sm"
            />
          </div>
          <div style={{ minWidth: 320 }}>
            <label htmlFor="bankDetails">Bank Details</label>
            <ReusableInput
              type="text"
              id="bankDetails"
              name="bankDetails"
              {...registerFirstSection("bankDetails")}
              size="sm"
            />
          </div>
        </div>
      </ReusableCard>
      {/* Table Section */}
      <ReusableCard style={{ marginBottom: 16, padding: 16 }}>
        <ReusableTable
          columns={tableColumns}
          data={paymentDetails?.challanDetails || []}
          striped
          bordered
          hover
        />
      </ReusableCard>
      {/* Payment Section Form */}
      <ReusableCard style={{ marginBottom: 16, padding: 16 }}>
        <form onSubmit={handlePaymentSection(onSubmitPaymentSectionData)}>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div style={{ minWidth: 180 }}>
              <label htmlFor="totalFreight">Total Freight</label>
              <ReusableInput
                type="text"
                id="totalFreight"
                name="totalFreight"
                {...registerPaymentSection("totalFreight")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="totalDeduction">Total Deduction</label>
              <ReusableInput
                type="text"
                id="totalDeduction"
                name="totalDeduction"
                {...registerPaymentSection("totalDeduction")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="totalPayable">Total Payable</label>
              <ReusableInput
                type="text"
                id="totalPayable"
                name="totalPayable"
                {...registerPaymentSection("totalPayable")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="totalTds">Total TDS</label>
              <ReusableInput
                type="text"
                id="totalTds"
                name="totalTds"
                {...registerPaymentSection("totalTds")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="onAdvance">On Advance</label>
              <ReusableInput
                type="text"
                id="onAdvance"
                name="onAdvance"
                {...registerPaymentSection("onAdvance")}
              />
            </div>
          </div>
          {/* Second Row */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div style={{ minWidth: 180 }}>
              <label htmlFor="onFinal">On Final</label>
              <ReusableInput
                type="text"
                id="onFinal"
                name="onFinal"
                {...registerPaymentSection("onFinal")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="netPayble">Net Payble</label>
              <ReusableInput
                type="text"
                id="netPayble"
                name="netPayble"
                {...registerPaymentSection("netPayble")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="voucherNo">Voucher No.</label>
              <ReusableInput
                type="text"
                id="voucherNo"
                name="voucherNo"
                {...registerPaymentSection("voucherNo")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="paymentMode">Payment Mode</label>
              <ReusableInput
                type="text"
                id="paymentMode"
                name="paymentMode"
                {...registerPaymentSection("paymentMode")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="finalPaidAmount">Final Paid Amount</label>
              <ReusableInput
                type="text"
                id="finalPaidAmount"
                name="finalPaidAmount"
                {...registerPaymentSection("finalPaidAmount")}
              />
            </div>
          </div>
          {/* Third Row */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div style={{ minWidth: 180 }}>
              <label htmlFor="totalTgAmount">Total TG Amount</label>
              <ReusableInput
                type="text"
                id="totalTgAmount"
                name="totalTgAmount"
                {...registerPaymentSection("totalTgAmount")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="paymentDate">Payment Date</label>
              <Controller
                id="paymentDate"
                name="paymentDate"
                defaultValue={null}
                render={({ field }) => (
                  <ReusableDatePicker
                    id="paymentDate"
                    name="paymentDate"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    size="sm"
                    placeholder="Select date"
                  />
                )}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="bankName">Bank Name</label>
              <ReusableInput
                type="text"
                id="bankName"
                name="bankName"
                {...registerPaymentSection("bankName")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="cqNo">Cq. No.</label>
              <ReusableInput
                type="text"
                id="cqNo"
                name="cqNo"
                {...registerPaymentSection("cqNo")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="cqDate">Cq. Date</label>
              <Controller
                id="cqDate"
                name="cqDate"
                defaultValue={null}
                render={({ field }) => (
                  <ReusableDatePicker
                    id="cqDate"
                    name="cqDate"
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    size="sm"
                    placeholder="Select date"
                  />
                )}
              />
            </div>
          </div>
          {/* Fourth Section */}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <div style={{ minWidth: 180 }}>
              <label htmlFor="receivedBy">Received By</label>
              <ReusableInput
                type="text"
                id="receivedBy"
                name="receivedBy"
                {...registerPaymentSection("receivedBy")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="paidBy">Paid By</label>
              <ReusableInput
                type="text"
                id="paidBy"
                name="paidBy"
                {...registerPaymentSection("paidBy")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="entryBy">Entry By</label>
              <ReusableInput
                type="text"
                id="entryBy"
                name="entryBy"
                {...registerPaymentSection("entryBy")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="entryDate">Entry Date</label>
              <ReusableInput
                type="text"
                id="entryDate"
                name="entryDate"
                {...registerPaymentSection("entryDate")}
              />
            </div>
            <div style={{ minWidth: 180 }}>
              <label htmlFor="entryPlace">Entry Place</label>
              <ReusableInput
                type="text"
                id="entryPlace"
                name="entryPlace"
                {...registerPaymentSection("entryPlace")}
              />
            </div>
          </div>
          <div style={{ minWidth: 320, marginBottom: 16 }}>
            <label htmlFor="paymentNote">Payment Note</label>
            <ReusableInput
              type="text"
              id="paymentNote"
              name="paymentNote"
              {...registerPaymentSection("paymentNote")}
            />
          </div>
          <div style={{ minWidth: 180, marginBottom: 16 }}>
            <label htmlFor="ctExpPercent">CT Exp %</label>
            <ReusableInput
              type="number"
              id="ctExpPercent"
              name="ctExpPercent"
              {...registerPaymentSection("ctExpPercent")}
            />
          </div>
          <div className="text-center">
            <ReusableButton
              type="submit"
              variant="primary"
              style={{ margin: 8 }}
            >
              Confirm
            </ReusableButton>
          </div>
        </form>
      </ReusableCard>
      {/* Modal Section */}
      {displayModal && (
        <ModalChallanPayment
          closeModal={() => setDisplayModal(false)}
          updated={() => {}}
        />
      )}
    </div>
  );
}

export default ChallanPaymentSingle;
