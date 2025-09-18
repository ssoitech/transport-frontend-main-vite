import React, { useState } from 'react'
import './css/excelfileUploadSelection.css';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { BaseUrl } from '../../services/BaseURI';

function ExcelFileUploadDespatchDataFullSelection() {
    const [excelData, setExcelData] = useState([]);
    const [jsonData, setJsonData] = useState(null);
    const [permitNo, setPermitNo] = useState();

    const [permitData, setPermitData] = useState();

    const [checkBoxChecked, setCheckBoxChecked] = useState(null);
    const [checkBoxValue, setCheckBoxValue] = useState();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(jsonData);
        };

        reader.readAsArrayBuffer(file);
    };

    const convertToJson = () => {
        setJsonData(excelData);
    };

    function handleMarkAllYes() {
        setCheckBoxChecked(true);
    }
    function handleMarkALLNo() {
        setCheckBoxChecked(false);
        setCheckBoxChecked(null);
    }

    async function getData() {
        const URL = BaseUrl + `/api/v1/get/one/iform/${permitNo}`;
        await axios.get(URL)
            .then(function (response) {
                // handle success
                setPermitData(response.data);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }
    function handleGetData() {
        if (!permitNo) {
            return;
        }
        getData();
    }

    return (
        <div className='work-space-container'>
            <div className="alert alert-info text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>Upload Excel Data - Single Permit</span>
            </div>
            <div className='card p-2'>
                <div className="first-container">
                    <div className="item1">
                        <div className="">
                            <label for="permitNumber" className="form-label">Permit Number</label>
                            <div className="row">
                                <div className="col-auto">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        id="permitNumber"
                                        onChange={(e) => { setPermitNo(e.target.value) }}
                                    />
                                </div>
                                <div className="col-auto">
                                    <button type="button" class="btn btn-sm btn-primary mb-3" onClick={handleGetData}>Get Details</button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="item1">
                        <div className="">
                            <label for="validFrom" className="form-label">Loading</label>
                            <div className="">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="validFrom"
                                />
                            </div>
                        </div>

                    </div>
                    <div className="item1">
                        <div className="">
                            <label for="validTo" className="form-label">Un Loading</label>
                            <div className="">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="validTo"
                                    name="validTo"

                                />
                            </div>
                        </div>

                    </div>

                </div>

                <div className='excelupload-second-container'>
                    <div className='item'>
                        <div className="input-group">
                            <input
                                type="file"
                                className="form-control form-control-sm"
                                id="inputGroupFile04"
                                aria-describedby="inputGroupFileAddon04"
                                aria-label="Upload"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                            />
                            <button
                                className="btn btn-outline-primary btn-sm"
                                type="button"
                                id="inputGroupFileAddon04"
                                onClick={convertToJson}
                            >
                                Extract & Show
                            </button>
                        </div>

                    </div>
                    <div className='item'>
                        <button type="button" class="btn btn-sm btn-primary mb-3" onClick={handleMarkAllYes}>Mark all Yes</button>
                    </div>
                    <div className='item'>
                        <button type="button" class="btn btn-sm btn-primary mb-3" onClick={() => { handleMarkALLNo() }}>Mark all No</button>
                    </div>
                    <div className="item">
                        <div class="mb-3 row">
                            <label for="inputPassword" class="col-sm-4 col-form-label">Pass No</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control form-control-sm" id="inputPassword" />
                            </div>
                        </div>

                    </div>
                </div>
                <div className='excelupload-third-container'>
                    <div className='item'>
                        <button type="button" class="btn btn-sm btn-primary mb-3">Mark as Unloaded</button>
                    </div>
                    <div className='item'>
                        <button type="button" class="btn btn-sm btn-primary mb-3">Save</button>
                    </div>
                    <div className='item'>
                        <button type="button" class="btn btn-sm btn-primary mb-3">New</button>
                    </div>
                    <div className="item">
                        <div class="mb-3 row">
                            <label for="inputPassword" class="col-sm-4 col-form-label">Tot Chl</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control form-control-sm" id="inputPassword" />
                            </div>
                        </div>

                    </div>
                    <div className="item">
                        <div class="mb-3 row">
                            <label for="inputPassword" class="col-sm-4 col-form-label">Tot Qty</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control form-control-sm" id="inputPassword" />
                            </div>
                        </div>

                    </div>
                    <div className="item">
                        <div class="mb-3 row">
                            <label for="inputPassword" class="col-sm-4 col-form-label">Duplicate</label>
                            <div class="col-sm-6">
                                <input type="text" class="form-control form-control-sm" id="inputPassword" />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className='mt-4'>

                <table className="table table-responsive table-sm table-striped table-bordered table-hover">
                    <thead className="thead-dark">
                        {/* {jsonData[0].map((data, idx) => (
                                <th key={idx}>{data}</th>
                            ))} */}

                        <th className='p-1' scope="col">Selection</th>
                        <th className='p-1' scope="col">SL No.</th>
                        <th className='p-1' scope="col">Date</th>
                        <th className='p-1' scope="col">Truck Number</th>
                        <th className='p-1' scope="col">Quantity</th>
                        <th className='p-1' scope="col">TP Number</th>
                        <th className='p-1' scope="col">Challan Number</th>
                        <th className='p-1' scope="col">Rate</th>
                        <th className='p-1' scope="col">Status</th>
                        <th className='p-1' scope="col">Vehicle Category</th>
                        <th className='p-1' scope="col">Cash Advance</th>
                        <th className='p-1' scope="col">Challan Comm</th>
                        <th className='p-1' scope="col">Issue Slip</th>
                        <th className='p-1' scope="col">Filling Station</th>
                        <th className='p-1' scope="col">Issued Ltrs</th>
                        <th className='p-1' scope="col">Diesel Advance</th>
                        <th className='p-1' scope="col">Office Expenses</th>
                    </thead>
                    {jsonData && (
                        <tbody className='font-weight-normal textColor'>
                            {jsonData.slice(1).map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className='p-1' scope="col">
                                        <div className="form-check text-center">
                                            <input checked={checkBoxChecked} onChange={(e) => { setCheckBoxValue(e.target.value) }} className="form-check-input" type="checkbox" value="1" id="flexCheckDefault" />
                                        </div>
                                    </td>
                                    {row.map((cell, cellIndex) => (

                                        <td className='p-1' scope="col" key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>


            </div>

        </div>
    )
}

export default ExcelFileUploadDespatchDataFullSelection;
