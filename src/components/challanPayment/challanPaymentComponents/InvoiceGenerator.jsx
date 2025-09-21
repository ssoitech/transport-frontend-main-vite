import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
// Removed unused jsPDF import
import Invoice from './Invoice';
// Reusable components
import ReusableButton from '../../reusable/ReusableButton';
import ReusableCard from '../../reusable/ReusableCard';

const InvoiceGenerator = ({ closeModal }) => {
    const invoiceRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => invoiceRef.current,
    });

    // Removed unused handleDownload function

    function handleCancel() {
        closeModal();
    }

    // --- UI: Refactored to use reusable components ---
    return (
        <ReusableCard>
            <Invoice ref={invoiceRef} />
            <div className="mt-3 d-flex gap-2">
                <ReusableButton type="button" variant="primary" size="sm" onClick={handlePrint}>
                    Print
                </ReusableButton>
                <ReusableButton type="button" variant="outline-primary" size="sm" onClick={handleCancel}>
                    Close
                </ReusableButton>
                {/* <ReusableButton type="button" variant="secondary" size="sm" onClick={handleDownload}>Download PDF</ReusableButton> */}
            </div>
        </ReusableCard>
    );
};

export default InvoiceGenerator;
