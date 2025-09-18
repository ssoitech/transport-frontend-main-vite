// src/components/InvoiceGenerator.js
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import Invoice from './Invoice';

const InvoiceGenerator = ({ closeModal }) => {
    const invoiceRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.text("Invoice", 20, 20);
        // Customize the PDF content as needed
        doc.save("invoice.pdf");
    };

    function handleCancel() {
        closeModal();
    }

    return (
        <div>
            <Invoice ref={invoiceRef} />

            <button type="button" className="btn btn-sm btn-primary" onClick={handlePrint}>
                Print
            </button>
            <button type="button" className="btn btn-sm btn-outline-primary ml-2" onClick={handleCancel}>
                Close
            </button>
            {/* <button onClick={handleDownload}>Download PDF</button> */}
        </div>
    );
};

export default InvoiceGenerator;
