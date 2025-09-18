import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import axiosInstance from '../../config/AxiosConfig';

function ExcelBulkUploadData() {
    const [jsonResult, setJsonResult] = useState([]);
    const [startSpneer, setStartSpneer] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

            // Assuming the first sheet is the one we want to parse
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convert worksheet to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1, // Get rows as arrays
                defval: null, // Set default value for empty cells
            });

            // Restrict to a specific number of rows (e.g., 10 rows)
            // const maxRows = 9; // Set the limit here
            // const limitedData = jsonData.slice(0, maxRows + 1); // +1 to include the header row

            // Extract the header row
            const headers = jsonData[0];

            // Create an array of objects, using the headers as keys
            const result = jsonData.slice(1).map((row) => {
                const obj = {};
                headers.forEach((header, index) => {
                    let value = row[index];
                    // Check if the value is a date serial number (you may need to refine this condition)
                    if ((typeof value === 'number' && header === 'createdAt') || (typeof value === 'number' && header === 'loadDate') || (typeof value === 'number' && header === 'hsdFilling') || (typeof value === 'number' && header === 'advancePaymentDate') || (typeof value === 'number' && header === 'unloadDate') || (typeof value === 'number' && header === 'joiningDate') || (typeof value === 'number' && header === 'paymentDate') || (typeof value === 'number' && header === 'lastUpdatedAt') || (typeof value === 'number' && header === 'date') || (typeof value === 'number' && header === 'validFrom') || (typeof value === 'number' && header === 'validTo') || (typeof value === 'number' && header === 'effectiveDate') || (typeof value === 'number' && header === 'chequeDate')) {
                        value = excelDateToJSDate(value);
                    }
                    obj[header] = value !== undefined ? value : null;
                });
                return obj;
            });


            setJsonResult(result);
        };

        reader.readAsArrayBuffer(file);
    };

    const excelDateToJSDate = (serial) => {
        const excelEpoch = new Date(1899, 11, 30);
        const jsDate = new Date(excelEpoch.getTime() + serial * 86400000);

        jsDate.setHours(0, 0, 0);
        return jsDate; // Format to YYYY-MM-DD
    };


    async function postData(fdata) {

        await axiosInstance.post('/api/v1/update/bulk/vehicle-passing-weight-data',
            fdata
        )

            .then(function (response) {

                setStartSpneer(false);
                // handle success
                console.log(response.data);
                if (response.data === "success" && response.status === 201) {
                    Swal.fire({
                        title: "Successfully Uploaded!!",
                        icon: "success"
                    });

                } else {
                    Swal.fire({
                        title: "Error Occured",
                        icon: "error"
                    });
                    return false;
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    Swal.fire({
                        title: "Error Occured",
                        icon: "error"
                    });
                    setStartSpneer(false);
                } else {
                    Swal.fire({
                        title: "Error Occured",
                        icon: "error"
                    });
                    setStartSpneer(false);
                }

            });
    }

    const handleSave = async () => {
        setStartSpneer(true);
        if (jsonResult.length !== 0) {
            await postData(jsonResult);
        } else {
            setStartSpneer(false);
            Swal.fire({
                title: "Empty Data",
                icon: "warning"
            });
        }
    }


    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Exporter/Consignee Master</span>
            </div>
            <div>
                <h2>Upload Excel File</h2>
                <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

                <button type="submit" form="form1" disabled={startSpneer} className="btn btn-sm btn-primary m-1" onClick={handleSave}>
                    {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">
                    </div>}
                    <span>Save</span>
                </button>
                {/* 
                {jsonResult.length > 0 && (
                    <table className="table table-bordered table-striped mt-3">
                        <thead>
                            <tr>
                                {Object.keys(jsonResult[0]).map((key, index) => (
                                    <th key={index}>{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {jsonResult.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.values(row).map((value, colIndex) => (
                                        <td key={colIndex}>{value !== null ? value : ""}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )} */}


                {/* <pre>{JSON.stringify(jsonResult, null, 2)}</pre> */}
                <pre>{jsonResult.length}</pre>


            </div>
        </div>
    );
}

export default ExcelBulkUploadData;


