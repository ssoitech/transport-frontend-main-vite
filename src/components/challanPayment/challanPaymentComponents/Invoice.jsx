import React, { forwardRef } from "react";
// Reusable components
import ReusableCard from "../../reusable/ReusableCard";
import ReusableTable from "../../reusable/ReusableTable";
import ReusableInput from "../../reusable/ReusableInput";

const Invoice = forwardRef((props, ref) => {
  // --- UI: Refactored to use reusable components ---
  return (
    <div ref={ref}>
      <ReusableCard
        className="mx-auto"
        style={{
          fontFamily: "Arial, sans-serif",
          margin: "20px",
          border: "1px solid #000",
          padding: "10px",
          width: "750px",
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: "0" }}>Swastik Enterprises</h2>
          <div>At./P.O. - Koira, Dist. - Sundargarh (Odisha) - 770048</div>
          <div>
            Mobile - 7205774380, E-Mail - swastik.enterprises2021@gmail.com
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>Ref. No.: 236</div>
          <div>Received Date : 26-Apr-2024</div>
        </div>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: "0" }}>Debit Voucher</h3>
        </div>
        {/* Payment Info Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <div>
            <strong>On A/c of : </strong>Transporting Expenses
          </div>
          <div>
            <strong>Paid To : </strong>AGIPY3456C
          </div>
          <div>
            <strong>Amount</strong>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <ReusableInput
            value="17165.00"
            readOnly
            style={{
              border: "1px solid #000",
              padding: "5px 20px",
              width: "auto",
              textAlign: "right",
            }}
          />
        </div>
        {/* Payment Details Table */}
        <ReusableCard
          style={{
            border: "1px solid #000",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <h4 style={{ textAlign: "center", margin: "10px 0" }}>
            Payment Details
          </h4>
          <ReusableTable
            columns={[
              { Header: "Payment Details", accessor: "label", colSpan: 3 },
            ]}
            data={[]}
            className="table-bordered"
            // ...existing code for table header...
          />
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td>Total Challan/s</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  5
                </td>
              </tr>
              <tr>
                <td>Freight Amount</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  29515.20
                </td>
              </tr>
              <tr>
                <td>TDS Deducted (-)</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  0.00
                </td>
              </tr>
              <tr>
                <td>Cash Advance (-)</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  0.00
                </td>
              </tr>
              <tr>
                <td>HSD Advance (-)</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  11400.00
                </td>
              </tr>
              <tr>
                <td>Shortage Deduction (-)</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  350.00
                </td>
              </tr>
              <tr>
                <td>Office Expenses (-)</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  600.00
                </td>
              </tr>
              <tr>
                <td>Other Deducted (-)</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  0.00
                </td>
              </tr>
              <tr>
                <td>CTC on Cash Trans. (-)</td>
                <td colSpan="2" style={{ textAlign: "right" }}>
                  12350.00
                </td>
              </tr>
            </tbody>
          </table>
        </ReusableCard>
        {/* Amount in Words */}
        <div style={{ marginBottom: "20px" }}>
          <strong>In words: </strong>Rupees Seventeen Thousand One Hundred Sixty
          Five Only
        </div>
        {/* Payment Mode Details */}
        <div style={{ marginBottom: "20px" }}>
          <strong>Payment Mode: </strong>Bank
          <br />
          <strong>Cq. No.: </strong>000933
          <br />
          <strong>Bank Name: </strong>ICICI BANK
          <br />
          <strong>Cheque Date: </strong>26-04-2024
        </div>
        {/* Signature Section */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <strong>Prepared by</strong>
            <br />
            KOIRA
          </div>
          <div>
            <strong>Authorised Signature</strong>
          </div>
          <div>
            <strong>Received by</strong>
          </div>
        </div>
      </ReusableCard>
    </div>
  );
});

export default Invoice;
