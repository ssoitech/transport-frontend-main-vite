import React, { useEffect, useState, useRef } from 'react'
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../config/AxiosConfig';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



const excelData = [];
function ExcelFileUploadDespatchDataFull() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [excelData, setExcelData] = useState([]);
    const [jsonData, setJsonData] = useState(null);
    const [formattedData, setFormattedData] = useState(null);
    const [duplicateValues, setDuplicateValues] = useState([]);
    const [totalQty, setTotalQty] = useState("");

    const [alreadyExistData, setAlreadyExistData] = useState();
    const [duplicateDataIdxs, setDuplicateDataIdxs] = useState();

    const [unloadedMarked, setUnloadedMarked] = useState(false);
    const [finalData, setFinalData] = useState();

    const [startSpneer, setStartSpneer] = useState(false);
    const [markUnloadButtonDisabled, setMarkUnloadButtonDisabled] = useState(false);

    const [passingWeightData, setPassingWeightData] = useState();

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

        return `${day}-${month}-${year}`;
    }

    function convertToDate(value) {
        return formatExcelDate(value);
    }

    async function getPassingWeightData() {
        await axiosInstance.get('/api/v1/get/all-vehicle-passing-weight')
            .then(function (response) {
                // handle success
                setPassingWeightData(response.data[0]);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getPassingWeightData();
    }, [])

    useEffect(() => {
        if (jsonData) {

            const arrayOfObjects = jsonData.slice(1).map((innerArray, idx) => {
                return {
                    "idx": idx,
                    "slNo": innerArray[0],
                    "tpNumber": innerArray[1],
                    "loadDate": format(convertToDate(innerArray[2]), 'd-MMM-yyyy'),
                    "truckNo": innerArray[3],
                    "qty": innerArray[4],
                };
            });
            setFormattedData(arrayOfObjects);
            setDuplicateValues(findDuplicateTpNumbers(arrayOfObjects));
            setTotalQty(calculateTotalQty(arrayOfObjects));
        }

    }, [jsonData])


    const findDuplicateTpNumbers = (arr) => {
        const tpNumberCounts = {}; // Object to store counts of each tpNumber
        const duplicates = [];
        const duplicateIdx = []

        // Iterate over the array of objects
        arr.forEach(obj => {
            const tpNumber = obj.tpNumber;

            // If tpNumber is already encountered, add it to duplicates
            if (tpNumberCounts[tpNumber]) {
                duplicates.push(tpNumber);
                duplicateIdx.push(obj.idx);
            } else {
                tpNumberCounts[tpNumber] = 1; // First occurrence
            }
        });

        setDuplicateDataIdxs(duplicateIdx);

        return duplicates;
    };

    const calculateTotalQty = (arr) => {
        let totalQty = 0;
        arr.forEach(obj => {
            totalQty += Number(obj.qty);
        });

        return parseFloat(totalQty.toFixed(2));
    }


    // Saving the data
    async function postData(fdata) {

        await axiosInstance.post('/api/v1/add/bulk/challans',
            fdata
        )

            .then(function (response) {
                // handle success
                console.log(response);

                if (response.status === 200) {
                    toast.success('Successfully Saved!', {
                        position: "bottom-center",
                        style: {
                            background: "green",
                            color: "#fff",
                        }
                    });
                    // setIsSaved(true);
                    // setUpdateData(true);
                    setStartSpneer(false);
                    setUnloadedMarked(false);

                } else {
                    toast.error("Some Error Occured!");
                    // setPostError(true);
                    setStartSpneer(false);
                    setUnloadedMarked(false);
                    return;
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    toast.error("Short name already exists!");
                    setUnloadedMarked(false);
                    setStartSpneer(false);
                } else if (error.response.data.length > 0 && error.response.status === 409) {
                    setAlreadyExistData(error.response.data);
                    setUnloadedMarked(false);
                    setStartSpneer(false);
                    bottomRef.current.scrollIntoView({ behavior: 'smooth' });


                } else {
                    toast.error("Something Went Wrong!");
                    setUnloadedMarked(false);
                    setStartSpneer(false);
                }

            });
    }





    const uploadData = async () => {
        setStartSpneer(true);
        if (unloadedMarked) {
            await postData(finalData);
        } else {
            const arrayOfObjects = jsonData.slice(1).map(innerArray => {
                return {
                    "permitNumber": innerArray[1].split('/')[0],
                    "tpNumber": innerArray[1],
                    "loadDate": format(convertToDate(innerArray[2]), 'yyyy-MM-dd'),
                    "truckNumber": innerArray[3],
                    "loadWeight": innerArray[4],
                    "status": "transit",
                    "createdBy": accessDetails.userId ? accessDetails.userId : null
                };
            });


            if (duplicateDataIdxs.length >= 1) {
                // Sort the indexes in descending order to avoid affecting the indexes of subsequent removals
                duplicateDataIdxs.sort((a, b) => b - a);

                duplicateDataIdxs.forEach(index => {
                    if (index >= 0 && index < arrayOfObjects.length) {
                        arrayOfObjects.splice(index, 1);
                    }
                });
            }

            await postData(arrayOfObjects);
        }

    }


    const markAsUnLoad = () => {
        // if (!jsonData) {
        //     return;
        // }
        try {

            setMarkUnloadButtonDisabled(true);
            const arrayOfObjects = jsonData.slice(1).map(innerArray => {
                return {
                    "permitNumber": innerArray[1].split('/')[0],
                    "tpNumber": innerArray[1],
                    "loadDate": format(convertToDate(innerArray[2]), 'yyyy-MM-dd'),
                    "truckNumber": innerArray[3],
                    "loadWeight": innerArray[4],
                    "status": "unloaded",
                    "unloadDate": format(convertToDate(innerArray[2]), 'yyyy-MM-dd'),
                    "unloadTruck": innerArray[3],
                    "netUnloaded": innerArray[4],
                    "createdBy": accessDetails.userId ? accessDetails.userId : null,
                };
            });

            console.log(duplicateDataIdxs);

            if (duplicateDataIdxs.length >= 1) {
                // Sort the indexes in descending order to avoid affecting the indexes of subsequent removals
                duplicateDataIdxs.sort((a, b) => b - a);

                duplicateDataIdxs.forEach(index => {
                    if (index >= 0 && index < arrayOfObjects.length) {
                        arrayOfObjects.splice(index, 1);
                    }
                });
            }

            console.log(arrayOfObjects);


            setFinalData(arrayOfObjects);
            setUnloadedMarked(true);
            setMarkUnloadButtonDisabled(false);
            toast.success("All are Marked as Unloaded.");

        } catch (error) {
            setMarkUnloadButtonDisabled(false);
            setUnloadedMarked(false);
            toast.error("Some error occures!!");
        }
    }

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>Upload Excel Data - Multiple Permit</span>
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
                <div className='item'>
                    <button type="button" className="btn btn-sm btn-primary" disabled={markUnloadButtonDisabled} onClick={markAsUnLoad}>Mark as Unloaded</button>
                </div>
                <div className='item'>
                    <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={uploadData}
                    >
                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-2" role="status">

                        </div>}
                        <span>Save</span>
                    </button>
                </div>
                <div className='item'>
                    <button type="button" className="btn btn-sm btn-primary">New</button>
                </div>
                <div className="item">
                    <div class="row">
                        <label htmlFor="totChl" className="col-sm-4 col-form-label">Tot Chl</label>
                        <div class="col-sm-6">
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border"
                                id="totChl"
                                value={formattedData ? formattedData.length : ""}
                            />
                        </div>
                    </div>

                </div>
                <div className="item">
                    <div class="row">
                        <label htmlFor="totalQty" className="col-sm-4 col-form-label">Tot Qty</label>
                        <div class="col-sm-6">
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border"
                                value={totalQty ? totalQty : ""}
                                id="totalQty"
                            />
                        </div>
                    </div>

                </div>
                <div className="item">
                    <div className="row">
                        <label htmlFor="duplicateValues" className="col-sm-4 col-form-label">Duplicate</label>
                        <div class="col-sm-6">
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border"
                                id="duplicateValues"
                                value={duplicateValues ? duplicateValues.length : ""}
                            />
                        </div>
                    </div>

                </div>
            </div>
            <div className='row overflow-auto'>

                <div className='col-sm-6 mt-4'>
                    <div className='card p-2'>

                        <table className="table table-sm table-striped table-bordered table-hover align-middle">
                            <thead className="thead-dark">
                                <th className='p-1' scope="col">SL No.</th>
                                <th className='p-1' scope="col">Permit No.</th>
                                <th className='p-1' scope="col">Date</th>
                                <th className='p-1' scope="col">Truck Number</th>
                                <th className='p-1' scope="col">Quantity</th>

                            </thead>
                            {formattedData && (
                                <tbody className='font-weight-normal textColor'>

                                    {formattedData?.map((item, idx) => (
                                        duplicateValues.includes(item.tpNumber) ?
                                            <tr key={idx}>
                                                <td className='p-1 text-center bg-danger text-light'>{idx + 1}</td>
                                                <td className='p-1 bg-danger text-light'>{item.tpNumber}</td>
                                                <td className='p-1 bg-danger text-light'>{item.loadDate}</td>
                                                <td className='p-1 bg-danger text-light'>{item.truckNo}</td>
                                                <td className='p-1 text-center bg-danger text-light'>{item.qty}</td>
                                            </tr> : <tr key={idx}>
                                                <td className='p-1 text-center'>{idx + 1}</td>
                                                <td className='p-1'>{item.tpNumber}</td>
                                                <td className='p-1'>{item.loadDate}</td>
                                                <td className='p-1'>{item.truckNo}</td>
                                                <td className='p-1 text-center'>{item.qty}</td>
                                            </tr>
                                    ))}

                                </tbody>)
                            }
                        </table>

                    </div>
                    <div ref={bottomRef} className='mt-5'>

                        {
                            alreadyExistData && <div className='card p-2'>
                                <h3 className='m-4'>Below records are already exist.</h3>
                                <table className="table table-sm table-striped table-bordered table-hover align-middle">
                                    <thead className="thead-dark">
                                        <th className='p-1' scope="col">SL No.</th>
                                        <th className='p-1' scope="col">Permit No.</th>
                                        <th className='p-1' scope="col">Date</th>
                                        <th className='p-1' scope="col">Truck Number</th>
                                        <th className='p-1' scope="col">Quantity</th>

                                    </thead>
                                    <tbody className='font-weight-normal textColor'>
                                        {alreadyExistData?.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className='p-1 text-center bg-warning'>{idx + 1}</td>
                                                <td className='p-1 bg-warning'>{item.tpNumber}</td>
                                                <td className='p-1 bg-warning'>{format(item.loadDate, 'yyyy-MM-dd')}</td>
                                                <td className='p-1 bg-warning'>{item.truckNumber}</td>
                                                <td className='p-1 bg-warning'>{item.loadWeight}</td>
                                            </tr>
                                        ))}

                                    </tbody>

                                </table>

                            </div>
                        }
                    </div>
                </div>
                <div className='col-sm-6 mt-4'>
                    <div className=''>
                        <table className="table table-sm table-striped table-responsive-sm table-bordered table-hover align-middle">
                            <thead className="thead-dark">
                                {/* {jsonData[0].map((data, idx) => (
                                <th key={idx}>{data}</th>
                            ))} */}
                                <th className='p-1' scope="col">SL No.</th>
                                <th className='p-1' scope="col">Date</th>
                                <th className='p-1' scope="col">Truck Number</th>
                                <th className='p-1' scope="col">Quantity</th>
                                <th className='p-1' scope="col">TP NO</th>
                                <th className='p-1' scope="col">Rate</th>
                                <th className='p-1' scope="col">Status</th>
                                <th className='p-1' scope="col">Vehicle Category</th>
                                <th className='p-1' scope="col">Office Expenses</th>
                                <th className='p-1' scope="col">Permit Number</th>
                                <th className='p-1' scope="col">Adv. input required</th>
                            </thead>
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

export default ExcelFileUploadDespatchDataFull
