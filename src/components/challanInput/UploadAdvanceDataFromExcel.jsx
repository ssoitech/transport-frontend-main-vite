import React, { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../config/AxiosConfig';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';



const excelData = [];
function UploadAdvanceDataFromExcel() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [excelData, setExcelData] = useState([]);
    const [jsonData, setJsonData] = useState(null);
    const [formattedData, setFormattedData] = useState(null);
    const [duplicateValues, setDuplicateValues] = useState(null);
    const [totalQty, setTotalQty] = useState("");

    const [alreadyExistData, setAlreadyExistData] = useState();
    const [duplicateDataIdxs, setDuplicateDataIdxs] = useState();

    const [unloadedMarked, setUnloadedMarked] = useState(false);
    const [finalData, setFinalData] = useState();

    const [startSpneer, setStartSpneer] = useState(false);
    const [markUnloadButtonDisabled, setMarkUnloadButtonDisabled] = useState(false);

    const [allFillingStationsName, setAllFillingStationsName] = useState([]);
    const [allBrokersName, setAllBrokersName] = useState([]);
    const [totalValidRecords, setTotalValidRecords] = useState(null);
    const [misMatchData, setMisMatchData] = useState(null);
    const [duplicateChallanNumbers, setDuplicateChallanNumbers] = useState(new Set());
    const [duplicateTp, setDuplicateTp] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const [finalValidRecords, setFinalValidRecords] = useState([]);

    const bottomRef = useRef(null);


    useEffect(() => {
        if (accessDetails) {
            if (accessDetails.role !== 'ADMIN') {
                if (accessDetails.role === 'USER') {
                    if (accessDetails.challanInputAccess !== "Y") {
                        Swal.fire("Error", "You don't have access to this section.", "error");
                        navigate('/work-space');
                    }

                } else {
                    Swal.fire("Error", "You don't have access to this section.", "error");
                    navigate('/work-space');
                }
            }

        } else {
            Swal.fire("Error", "You don't have access to this section.", "error");
            navigate('/work-space');
        }

    }, []);

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


    function formatExcelDate(excelDate) {
        let date;

        // 1. Check if it's a number (Excel serial date)
        if (!isNaN(excelDate) && Number(excelDate) > 10000) {
            date = new Date((excelDate - 25569) * 86400000); // Convert Excel serial to JS Date
        }
        // 2. Try parsing standard date formats
        else {
            date = new Date(excelDate);
        }

        // Validate if the date is valid
        if (isNaN(date.getTime())) {
            return null; // Handle invalid cases
        }

        // Convert to DD-MMM-YYYY format
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        return format(`${day}-${month}-${year}`, "yyyy-MM-dd");
    }

    function convertToDate(value) {
        return formatExcelDate(value);
    }

    async function getAllFillingStationsName() {
        await axiosInstance.get('/api/v1/get/filling-stations')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        nameId: element[0],
                        name: element[1]
                    };
                });
                setAllFillingStationsName(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }
    async function getAllBrokersName() {
        await axiosInstance.get('/api/v1/get/all/fleet-agent-broker-master')
            .then(function (response) {
                // handle success
                setAllBrokersName(response.data);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getAllFillingStationsName();
        getAllBrokersName();
    }, [])


    useEffect(() => {
        if (jsonData) {
            const uniqueChallanNumbers = new Set();
            const uniqueTPNumbers = new Set();
            const duplicateChallans = new Set();
            const duplicateTPs = new Set();
            const matchedData = [];
            const unmatchedData = [];

            // Step 1: Convert jsonData to an array of objects
            const arrayOfObjects = jsonData.slice(1).map((innerArray, idx) => ({
                "idx": idx,
                "tpNumber": innerArray[1] || "",
                "challanNumber": innerArray[2] || "",
                "truckNumber": innerArray[3] || "",
                "challanRate": isNaN(innerArray[4]) || innerArray[4] === "" || innerArray[4] === null ? 0 : Number(innerArray[4]),
                "cashAdvance": isNaN(innerArray[5]) || innerArray[5] === "" || innerArray[5] === null ? 0 : Number(innerArray[5]),
                "hsdAdvance": isNaN(innerArray[6]) || innerArray[6] === "" || innerArray[6] === null ? 0 : Number(innerArray[6]),
                "hsdSlip": innerArray[7] || "",
                "petrolPump": innerArray[8] || "",
                "driverCommission": innerArray[9] || "",
                "agent": innerArray[10] || "",
                "despatchDate": innerArray[11] ? format(convertToDate(innerArray[11]), 'yyyy-MM-dd') : null,
                "updatedBy": accessDetails.userId || null,
            }));

            // Step 2: Identify duplicates
            arrayOfObjects.forEach(record => {
                const { tpNumber, challanNumber } = record;

                if (challanNumber) {
                    if (uniqueChallanNumbers.has(challanNumber)) {
                        duplicateChallans.add(challanNumber);
                    } else {
                        uniqueChallanNumbers.add(challanNumber);
                    }
                }

                if (tpNumber) {
                    if (uniqueTPNumbers.has(tpNumber)) {
                        duplicateTPs.add(tpNumber);
                    } else {
                        uniqueTPNumbers.add(tpNumber);
                    }
                }
            });

            // Step 3: Filter valid records (no duplicates, no mismatches)
            const filteredData = arrayOfObjects.filter(record => {
                const isDuplicateChallan = duplicateChallans.has(record.challanNumber);
                const isDuplicateTP = duplicateTPs.has(record.tpNumber);

                // Match petrolPump name and agent
                const pumpMatch = allFillingStationsName.find(p => p.name === record.petrolPump);
                const agentMatch = allBrokersName.find(a => a.name === record.agent);

                // If valid, attach IDs
                if (pumpMatch) record.petrolPumpId = pumpMatch.nameId;
                if (agentMatch) record.agentId = agentMatch.id;

                const isValid = !isDuplicateChallan && !isDuplicateTP && pumpMatch && agentMatch;

                if (isValid) {
                    matchedData.push(record);
                } else {
                    unmatchedData.push(record);
                }

                return isValid;
            });

            // Step 4: Update state
            setFormattedData(arrayOfObjects);
            setTotalValidRecords(matchedData);
            setMisMatchData(unmatchedData.length);
            setDuplicateChallanNumbers(duplicateChallans);
            setDuplicateTp(duplicateTPs);
            setFinalValidRecords(filteredData);  // Final clean records
        }
    }, [jsonData]);



    // Saving the data
    async function postData(challanDTOList) {
        setLoading(true);

        await axiosInstance.post('/api/v1/process/advance-data/from-excel',
            challanDTOList
        ).then(function (response) {
            setLoading(false);
            // handle success
            console.log(response.data);
            if (response.data) {
                // Generate the table rows dynamically
                let tableRows = "";
                for (const [tpNumber, status] of Object.entries(response.data)) {
                    tableRows += `
                             <tr>
                                <td>${tpNumber}</td>
                                <td>${status}</td>
                             </tr>
                            `;
                }

                // Display the modal with the dynamic table
                Swal.fire({
                    title: "Upload Failed for below TPs",
                    icon: "success",
                    html: `
                          <div style="max-height: 300px; overflow-y: auto; overflow-x: auto; border: 1px solid #ccc;">
                            <table border="1" style="width:100%; text-align:left; border-collapse: collapse;">
                              <thead>
                               <tr>
                                <th>TP Number</th>
                                <th>Reason</th>
                               </tr>
                              </thead>
                              <tbody>
                                  ${tableRows}
                              </tbody>
                              </table>
                               </div>
                           `,
                    showCloseButton: true
                })
            }

        })
            .catch(function (error) {
                setLoading(false);
                // handle error

            });
    }





    const uploadData = async () => {

        console.log(finalValidRecords);
        if (!finalValidRecords) {
            return;
        }

        await postData(finalValidRecords);
    }

    const handleNew = () => {
        window.location.reload();
    }



    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>Upload Advance Data From Excel Without Bank</span>
            </div>
            <div className='row'>
                <div className='col-sm'>
                    <div className="input-group">
                        <input
                            type="file"
                            className="form-control form-control-sm custom-border"
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
                <div className='col-sm'>

                </div>
            </div>
            <div className='excelupload-third-container mt-2'>

                <div className="item">
                    <div class="">
                        <label htmlFor="totChl" className="">Total uploaded Challan</label>
                        <div class="">
                            <input
                                type="number"
                                className="form-control form-control-sm text-center border-dark-subtle"
                                contentEditable={false}
                                id="totChl"
                                value={jsonData ? (jsonData.length > 1 ? jsonData.length - 1 : 0) : ""}
                            />
                        </div>
                    </div>

                </div>
                <div className="item">

                    <div className="item">
                        <div class="">
                            <label htmlFor="mismatch" className="">Pump & Agent Mis-Match</label>
                            <div class="">
                                <input
                                    type="number"
                                    className="form-control form-control-sm text-center border-dark-subtle bg-danger-subtle"
                                    value={misMatchData ? misMatchData : ""}
                                    id="mismatch"
                                    contentEditable={false}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="item">

                    <div className="">
                        <label htmlFor="duplicateValues" className="">Duplicate Challan</label>
                        <div class="">
                            <input
                                type="number"
                                className="form-control form-control-sm text-center border-dark-subtle bg-warning-subtle"
                                id="duplicateValues"
                                contentEditable={false}
                                value={duplicateChallanNumbers ? duplicateChallanNumbers.size : ""}
                            />
                        </div>
                    </div>

                </div>
                <div className="item">
                    <div className="">
                        <label htmlFor="duplicateTp" className="">Duplicate TP</label>
                        <div class="">
                            <input
                                type="number"
                                className="form-control form-control-sm text-center border-dark-subtle bg-warning-subtle"
                                id="duplicateTp"
                                contentEditable={false}
                                value={duplicateTp ? duplicateTp.size : ""}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className='excelupload-third-container mt-2'>


                <div class="">
                    <label htmlFor="totChl" className="form-label">Total Valid Chl</label>
                    <div class="">
                        <input
                            type="number"
                            className="form-control form-control-sm text-center border-dark-subtle"
                            id="totChl"
                            contentEditable={false}
                            value={totalValidRecords ? totalValidRecords.length : ""}
                        />
                    </div>
                </div>
                <div className='item'>

                    <button type="button" className="btn btn-sm btn-primary mt-4" disabled={loading} onClick={uploadData}>
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Uploading ...
                            </>
                        ) : (
                            'Upload'
                        )}
                    </button>
                </div>
                <div className='item'>
                    <button type="button" className="btn btn-sm btn-secondary mt-4" onClick={handleNew}>New</button>
                </div>

            </div>
            <div className='row overflow-auto'>

                <div className='col-sm-6 mt-4'>
                    <div className='p-2'>

                        <table className="table table-sm table-striped table-bordered table-hover align-middle">
                            <thead className="text-center p-1 bg-warning text-dark-emphasis">
                                <th className='border-dark'>SL No.</th>
                                <th className='border-dark'>TP Number</th>
                                <th className='border-dark'>Challan Number</th>
                                <th className='border-dark'>Truck Number</th>
                                <th className='border-dark'>Challan Rate</th>
                                <th className='border-dark'>Cash Advance</th>
                                <th className='border-dark'>HSD Advance</th>
                                <th className='border-dark'>HSD Slip</th>
                                <th className='border-dark'>Petrol Pump</th>
                                <th className='border-dark'>Driver Commission</th>
                                <th className='border-dark'>Agent</th>
                                <th className='border-dark'>Despatch Date</th>

                            </thead>
                            {formattedData && (
                                <tbody className='font-weight-normal textColor'>

                                    {formattedData?.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className='p-1 text-center'>{idx + 1}</td>
                                            <td className={duplicateTp.has(item.tpNumber) ? 'p-1 text-center bg-warning-subtle' : 'p-1 text-center'} >{item.tpNumber}</td>
                                            <td className={duplicateChallanNumbers.has(item.challanNumber) ? 'p-1 text-center bg-warning-subtle' : 'p-1 text-center'} >{item.challanNumber}</td>
                                            <td className='p-1 text-center'>{item.truckNumber}</td>
                                            <td className='p-1 text-center'>{item.challanRate}</td>
                                            <td className='p-1 text-center'>{item.cashAdvance}</td>
                                            <td className='p-1 text-center'>{item.hsdAdvance}</td>
                                            <td className='p-1 text-center'>{item.hsdSlip}</td>
                                            <td className={item.petrolPumpId ? 'p-1 text-center' : 'p-1 text-center bg-danger-subtle'}>{item.petrolPump}</td>
                                            <td className='p-1 text-center'>{item.driverCommission}</td>
                                            <td className={item.agentId ? 'p-1 text-center' : 'p-1 text-center bg-danger-subtle'}>{item.agent}</td>
                                            <td className='p-1 text-center'>{item.despatchDate ? format(item.despatchDate, "dd-MMM-yyyy") : ""}</td>
                                        </tr>
                                    ))}

                                </tbody>)
                            }
                        </table>

                    </div>
                </div>

            </div>
            <Toaster
                position="bottom-center"
                reverseOrder={true}
            />

        </div>
    )
}

export default UploadAdvanceDataFromExcel

