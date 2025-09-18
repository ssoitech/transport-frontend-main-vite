import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import PdfGeneration from './PdfGeneration';

const PdfComponent = () => {
    const [invoiceData, setInvoiceData] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const viewerContainer = useRef(null);

    useEffect(() => {
        // Fetch data from API
        axios.get('http://localhost:8081/api/v1/get-data-for-receive-entry/tpNo=PER1133_1')
            .then(response => {
                setInvoiceData(response.data);
                generatePdf(response.data);
            })
            .catch(error => {
                console.error('Error fetching invoice data:', error);
            });
    }, []);

    const generatePdf = async (data) => {
        const doc = <PdfGeneration data={data} />;
        const asPdf = pdf([]); // Empty array as document is not built yet
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob();
        setPdfBlob(blob);
    };

    const downloadPdf = () => {
        if (pdfBlob) {
            saveAs(pdfBlob, 'invoice.pdf');
        }
    };

    return (
        <div>
            <h1>Invoice Preview</h1>
            <div ref={viewerContainer} style={{ height: '600px' }}>
                {pdfBlob && (
                    <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
                        <Viewer fileUrl={URL.createObjectURL(pdfBlob)} />
                    </Worker>
                )}
            </div>
            <button onClick={downloadPdf} disabled={!pdfBlob}>Download PDF</button>
        </div>
    );
};

export default PdfComponent;
