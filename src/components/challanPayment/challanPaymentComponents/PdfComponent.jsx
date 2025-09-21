import React, { useEffect, useState, useRef } from "react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import PdfGeneration from "./PdfGeneration";
// Reusable components
import ReusableButton from "../../reusable/ReusableButton";
import ReusableCard from "../../reusable/ReusableCard";
import ReusableLoader from "../../reusable/ReusableLoader";
import ReusableToast from "../../reusable/ReusableToast";
// React Query generic hook
import { useApiQuery } from "../../../hooks/api/useApiQuery";

/**
 * PdfComponent: Fetches invoice data, generates PDF, and displays/exports using reusable components and React Query.
 * - Uses useApiQuery for API data fetching (SOLID/DRY)
 * - Uses ReusableCard, ReusableButton, ReusableLoader, ReusableToast for UI
 * - Business logic for PDF generation and download is preserved
 */
const PdfComponent = () => {
  // State for generated PDF blob
  const [pdfBlob, setPdfBlob] = useState(null);
  const viewerContainer = useRef(null);

  // Fetch invoice data using generic React Query hook
  const {
    data: invoiceData,
    isLoading,
    isError,
    error,
  } = useApiQuery({
    key: "invoiceData",
    url: "http://localhost:8081/api/v1/get-data-for-receive-entry/tpNo=PER1133_1",
    method: "get",
    enabled: true,
    retry: 1,
    staleTime: 60000,
    cacheTime: 300000,
  });

  // Generate PDF when invoiceData changes
  useEffect(() => {
    if (invoiceData) {
      generatePdf(invoiceData);
    }
  }, [invoiceData]);

  // PDF generation logic (unchanged)
  const generatePdf = async (data) => {
    const doc = <PdfGeneration data={data} />;
    const asPdf = pdf([]); // Empty array as document is not built yet
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();
    setPdfBlob(blob);
  };

  // Download PDF handler
  const handleDownload = () => {
    if (pdfBlob) {
      saveAs(pdfBlob, "invoice.pdf");
    }
  };

  return (
    <ReusableCard style={{ padding: 24, margin: "24px auto", maxWidth: 900 }}>
      <h1>Invoice Preview</h1>
      {/* Loader for API fetch */}
      {isLoading && <ReusableLoader message="Loading invoice data..." />}
      {/* Error toast for API error */}
      {isError && (
        <ReusableToast
          type="error"
          message={`Error fetching invoice data: ${
            error?.message || "Unknown error"
          }`}
          autoClose={false}
        />
      )}
      {/* PDF Viewer */}
      <div ref={viewerContainer} style={{ height: "600px", marginBottom: 16 }}>
        {pdfBlob && (
          <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
            <Viewer fileUrl={URL.createObjectURL(pdfBlob)} />
          </Worker>
        )}
      </div>
      {/* Download Button */}
      <ReusableButton
        onClick={handleDownload}
        disabled={!pdfBlob}
        style={{ minWidth: 160 }}
        variant="primary"
      >
        Download PDF
      </ReusableButton>
    </ReusableCard>
  );
};

export default PdfComponent;
