// src/components/ExcelUploader.js
import React, { useState } from 'react';
import { ExcelRenderer, OutTable } from 'react-excel-renderer';

function ExcelUploader() {
    const [rows, setRows] = useState([]);
    const [cols, setCols] = useState([]);

    const handleFileUpload = (event) => {
        const fileObj = event.target.files[0];

        ExcelRenderer(fileObj, (err, resp) => {
            if (err) {
                console.error('Error reading Excel file:', err);
            } else {
                setCols(resp.cols);
                setRows(resp.rows);
            }
        });
    };

    console.log(rows);
    console.log("..............");
    console.log(cols);


    return (
        <div>
            <input type="file" onChange={handleFileUpload} />
            {rows.length > 0 && (
                <OutTable
                    data={rows}
                    columns={cols}
                    tableClassName="ExcelTable2007"
                    tableHeaderRowClass="heading"
                />
            )}
        </div>
    );
}

export default ExcelUploader;
