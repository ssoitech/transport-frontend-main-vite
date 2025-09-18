import React, { useEffect, useState } from 'react';
import './css/challanStatus.css';
import { useForm, Controller } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import axiosInstance from '../../config/AxiosConfig';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import PaginationComponent from '../customComponents/PaginationComponent';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const statusColor = [
    {
        status: "transit",
        color: "bg-danger text-light p-1"
    },
    {
        status: "unloaded",
        color: "bg-dark text-light p-1"
    },
    {
        status: "received",
        color: "pink-color p-1"
    },
    {
        status: "paid",
        color: "bg-success text-light p-1"
    }
]
function ChallanStatus() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [searchedData, setSearchedData] = useState();
    const [consigner, setConsigner] = useState();
    const [consignee, setConsignee] = useState();
    const [loadingPoint, setLoadingPoint] = useState();
    const [unloadingPoint, setUnloadingPoint] = useState();
    const [appUser, setAppUser] = useState();
    const [searching, setSearching] = useState(false);

    const [totalNumberOfData, setTotalNumberOfData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValues, setInputValues] = useState({});

    const [formData, setFormData] = useState();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isExportComplete, setIsExportComplete] = useState(false);
    const [excelBlob, setExcelBlob] = useState(null); // Store Excel file

    const [pageSize, setPageSize] = useState(10); // Default page size is 10

    // const pageSize = 20;

    const {
        register,
        control,
        handleSubmit,
        getValues,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            // Set default value here
            consigner: null,
            unLoading: null,
            billingType: null,
            consignee: null,
            status: null,
            loading: null,
            enteredBy: null,
            fromEntryDate: null,
            toEntryDate: null,
            fromLoadingDate: null,
            toLoadingDate: null
        },
    });


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


    async function getAllConsigner() {
        await axiosInstance.get('/api/v1/get/all/consigner-owner-names')
            .then(function (response) {

                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        name: element[1]
                    };
                });
                // handle success
                setConsigner(arrayOfObjects);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllConsignee() {
        await axiosInstance.get('/api/v1/get/all/exporter-consignee-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        name: element[1]
                    };
                });
                setConsignee(arrayOfObjects);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllLoadingPoints() {
        await axiosInstance.get('/api/v1/get/all/loading-point-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        name: element[1]
                    };
                });
                setLoadingPoint(arrayOfObjects);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllUnloadingPoints() {
        await axiosInstance.get('/api/v1/get/all/unloading-point-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        name: element[1]
                    };
                });
                setUnloadingPoint(arrayOfObjects);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllAppUsers() {
        await axiosInstance.get('/api/v1/get/all/usernames-and-ids')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        name: element[1]
                    };
                });
                setAppUser(arrayOfObjects);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getAllConsigner();
        getAllConsignee();
        getAllLoadingPoints();
        getAllUnloadingPoints();
        getAllAppUsers();
    }, [])


    async function getDataByPagenumber(fData, page) {
        setSearching(true);
        await axiosInstance.post('/api/v1/get/challan-status-page-details',
            fData
        )
            .then(function (response) {
                setSearching(false);
                // handle success
                console.log(response.data);
                // console.log(response.data.totalPages);
                setSearchedData(response.data.content);
                setTotalNumberOfData(response.data.totalElements);
                setTotalPages(response.data.totalPages); // Set the total pages
                setCurrentPage(page); // Set the current page

            })
            .catch(function (error) {
                setSearching(false);
                // handle error
                console.log(error.response);

            });
    }

    async function postFilteredData(data, page) {

        var fData = {
            "consigner": data.consigner,
            "consignee": data.consignee,
            "loadingPoint": data.loading,
            "unloadingPoint": data.unLoading,
            "createdBy": data.enteredBy,
            "challanStatus": data.status,
            "tpNumber": data.permitNumber ? data.permitNumber : null,
            "fromLoadingDate": data.fromLoadingDate ? format(data.fromLoadingDate, 'yyyy-MM-dd') : null,
            "toLoadingDate": data.toLoadingDate ? format(data.toLoadingDate, 'yyyy-MM-dd') : null,
            "fromEntryDate": data.fromEntryDate ? format(data.fromEntryDate, 'yyyy-MM-dd') : null,
            "toEntryDate": data.toEntryDate ? format(data.toEntryDate, 'yyyy-MM-dd') : null,
            "orderColumn": data.displayOrder,
            "page": page,
            "size": pageSize,
        }

        setFormData(fData);

        getDataByPagenumber(fData, page);
    }


    const handleGet = async (data) => {
        setInputValues(data); // Store the input values for pagination
        postFilteredData(data, 0); // Fetch data for page 1 on form submit

    }

    // Handle page change
    const handlePageChange = (page) => {
        postFilteredData(inputValues, page); // Fetch data for the selected page
    };

    const handleClear = () => {
        reset();
    }


    // Function to fetch all data in a single API call
    const fetchData = async () => {
        setLoading(true);
        setProgress(0);
        setIsExportComplete(false); // Reset state for new export

        try {
            // Simulate progress (just for user experience)
            setProgress(30);

            // set the conditions
            if (!formData) {

                return;
            }

            // Fetch all data in one API call

            await axiosInstance.post('/api/v1/get/challan-status-data-without-pagination',
                formData
            )
                .then(function (response) {
                    // handle success
                    // Simulate more progress
                    setProgress(70);
                    // Once data is fetched, export to Excel
                    exportDataToExcel(response.data);

                })
                .catch(function (error) {
                    // handle error
                    console.log(error.response);

                });

            setProgress(100); // Set progress to 100% when done
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    // Function to format header keys from camelCase to "Title Case"
    const formatHeader = (header) => {
        return header
            .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
            .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
            .trim(); // Remove any leading or trailing spaces
    };

    // Function to export the data to Excel
    const exportDataToExcel = async (allData) => {
        if (allData.length === 0) return;

        const rawHeaders = Object.keys(allData[0]);
        const headers = rawHeaders.map(formatHeader); // Convert 'truckNumber' to 'Truck Number'

        // Step 1: Create a worksheet with the data
        const worksheet = XLSX.utils.json_to_sheet(allData, { header: rawHeaders });

        // Step 2: Add company name and fetched date at the top of the sheet, ensuring it does not overwrite data
        XLSX.utils.sheet_add_aoa(worksheet, [["Your Company Name"]], { origin: "A1" }); // Company name at A1
        XLSX.utils.sheet_add_aoa(worksheet, [["Fetched Date: " + new Date().toLocaleDateString()]], { origin: "A2" }); // Fetched date at A2

        // Step 3: Add formatted headers starting from row 4 (index 3) to leave space for custom rows
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A3" }); // Data headers at row 4

        // Step 4: Insert data starting from row 5 (index 4), after headers
        XLSX.utils.sheet_add_json(worksheet, allData, { origin: "A4", skipHeader: true }); // Data starts from row 5


        // Merge the cells for titles (company name and date)



        // Step 6: Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // Step 7: Generate the Excel file and create a blob
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        // Use Promise.resolve to ensure state updates are batched
        await Promise.resolve();

        // Step 8: Set the blob for download and mark the export as complete
        setExcelBlob(blob);
        setIsExportComplete(true);
        setLoading(false); // Stop loading after Excel generation 

    };

    // Function to handle the export button click
    const handleExportClick = () => {
        if (!formData) {
            return;
        }
        setShowModal(true); // Open modal
        fetchData(); // Start fetching data and exporting
    };

    // Function to handle the download button click
    const handleDownload = () => {
        if (excelBlob) {
            saveAs(excelBlob, "ChallanStatus.xlsx");
            setShowModal(false); // Close modal after download
            setExcelBlob(null); // Clear blob to free up memory
            setIsExportComplete(false); // Reset export state if needed
            setProgress(0); // Reset progress if needed
        }
    };

    // Function to handle modal close
    const handleCancel = () => {
        setShowModal(false);
        setProgress(0); // Reset progress when closed
    };

    // Handler for changing page size
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        // postFilteredData(inputValues, 0); // Re-fetch data with new page size, starting from page 0
    };

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Challan Status</span>
            </div>
            <form onSubmit={handleSubmit(handleGet)}>
                <div className='row'>
                    <div className='col-sm-4'>
                        <div class="form-group">
                            <label htmlFor="consigner">Consigner:</label>
                            {consigner ?
                                <select
                                    className="form-select form-select-sm border-dark-subtle"
                                    aria-label="Default select example"
                                    name='consigner'
                                    id='consigner'
                                    {...register("consigner")}
                                    defaultValue={''}
                                >
                                    <option value=''>Select All</option>

                                    {
                                        consigner.map((item, idx) => {
                                            return <option key={idx} value={item.id}>{item.name}</option>
                                        })
                                    }

                                </select> :
                                <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                                    <option value=""></option>
                                </select>
                            }
                        </div>
                        <div class="form-group">
                            <label htmlFor="loading">Loading:</label>

                            {loadingPoint ?
                                <select
                                    className="form-select form-select-sm border-dark-subtle"
                                    aria-label="Default select example"
                                    name='loading'
                                    id='loading'
                                    {...register("loading")}
                                    defaultValue={''}
                                >
                                    <option value=''>Select All</option>

                                    {
                                        loadingPoint.map((item, idx) => {
                                            return <option key={idx} value={item.id}>{item.name}</option>
                                        })
                                    }

                                </select> :
                                <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                                    <option value=""></option>
                                </select>
                            }


                        </div>

                        <div class="form-group">
                            <label htmlFor="unLoading">Un Loading:</label>

                            {unloadingPoint ?
                                <select
                                    className="form-select form-select-sm border-dark-subtle"
                                    aria-label="Default select example"
                                    name='unLoading'
                                    id='unLoading'
                                    {...register("unLoading")}
                                    defaultValue={''}
                                >
                                    <option value=''>Select All</option>

                                    {
                                        unloadingPoint.map((item, idx) => {
                                            return <option key={idx} value={item.id}>{item.name}</option>
                                        })
                                    }

                                </select> :
                                <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                                    <option value=""></option>
                                </select>
                            }
                        </div>




                        <div class="form-group">
                            <label htmlFor="billingType">Billing Type:</label>

                            <select
                                className="form-select form-select-sm border-dark-subtle"
                                aria-label="Default select example"
                                id="billingType"
                                name="billingType"
                                {...register("billingType")}
                                defaultValue={''}
                            >
                                <option value=''>Select Both</option>
                                <option value="L">Railway Siding</option>
                                <option value="R">By Road Work</option>

                            </select>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div class="form-group">
                            <label htmlFor="consignee">Consignee:</label>
                            {consignee ?
                                <select
                                    className="form-select form-select-sm border-dark-subtle"
                                    aria-label="Default select example"
                                    name='consignee'
                                    id='consignee'
                                    {...register("consignee")}
                                    defaultValue={''}
                                >
                                    <option value=''>Select All</option>

                                    {
                                        consignee.map((item, idx) => {
                                            return <option key={idx} value={item.id}>{item.name}</option>
                                        })
                                    }

                                </select> :
                                <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                                    <option value=""></option>
                                </select>
                            }
                        </div>



                        <div class="form-group">
                            <label for="fromLoadingDate">Loading Date:</label>
                            <div className='row'>
                                <div className='col-sm-5'>
                                    <Controller
                                        name="fromLoadingDate"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholderText="Select date"
                                                className='date-picker-input pl-2 w-100 custom-style'
                                                popperClassName="datepicker-popper"
                                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                                selected={field.value ? new Date(field.value) : null}
                                                dateFormat="d-MMM-yyyy"

                                            />
                                        )}
                                    />
                                </div>
                                <div className='col-sm-1'>
                                    <p>To</p>
                                </div>
                                <div className='col-sm-6'>
                                    <Controller
                                        name="toLoadingDate"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholderText="Select date"
                                                className='date-picker-input pl-2 w-100'
                                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                                selected={field.value ? new Date(field.value) : null}
                                                dateFormat="d-MMM-yyyy"

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                        </div>


                        <div class="form-group">
                            <label htmlFor="fromEntryDate">Entry Date:</label>
                            <div className='row'>
                                <div className='col-sm-5'>
                                    <Controller
                                        name="fromEntryDate"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholderText="Select date"
                                                className='date-picker-input pl-2 w-100'
                                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                                selected={field.value ? new Date(field.value) : null}
                                                dateFormat="d-MMM-yyyy"

                                            />
                                        )}
                                    />
                                </div>
                                <div className='col-sm-1'>
                                    <p>To</p>
                                </div>
                                <div className='col-sm-6'>
                                    <Controller
                                        name="toEntryDate"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholderText="Select date"
                                                className='date-picker-input pl-2 w-100'
                                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                                selected={field.value ? new Date(field.value) : null}
                                                dateFormat="d-MMM-yyyy"

                                            />
                                        )}
                                    />
                                </div>
                            </div>

                        </div>
                        <div class="form-group">
                            <label for="permitNumber">Permit Number:</label>
                            <div className='row'>
                                <div className='col-sm'>
                                    <input
                                        type="text"
                                        class="form-control form-control-sm custom-border"
                                        id="permitNumber"
                                        name="permitNumber"
                                        {...register("permitNumber")}
                                    />
                                </div>
                                <div className='col-sm'>
                                    <div className='row'>
                                        <button type="submit" className="btn btn-sm btn-primary col-sm" disabled={searching}>
                                            Get
                                        </button>
                                        <button type="button" className="btn btn-sm btn-primary ml-2 col-sm" onClick={handleExportClick}>
                                            Excel
                                        </button>
                                        <button type="button" className="btn btn-sm btn-primary ml-2 col-sm" onClick={handleClear}>
                                            Clear
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        {searching && (
                            <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Loading...
                            </>
                        )}
                    </div>
                    <div className='col-sm-2'>
                        <div class="form-group">
                            <label htmlFor="status">Status:</label>
                            {/* <input
                            type="text"
                            class="form-control form-control-sm custom-border"
                            id="status"
                            name="status"
                            {...register("status")}
                        /> */}

                            <select
                                className="form-select form-select-sm border-dark-subtle"
                                aria-label="Default select example"
                                id="status"
                                name="status"
                                {...register("status")}
                                defaultValue={''}
                            >
                                <option value=''>Select All</option>
                                <option value="transit">Transit</option>
                                <option value="unloaded">Un-Loaded</option>
                                <option value="received">Received</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label htmlFor="displayOrder">Display Order:</label>
                            {/* <input
                            type="text"
                            class="form-control form-control-sm custom-border"
                            id="displayOrder"
                            name="displayOrder"
                            {...register("displayOrder")}
                        /> */}

                            <select
                                className="form-select form-select-sm border-dark-subtle"
                                aria-label="Default select example"
                                id="displayOrder"
                                name="displayOrder"
                                {...register("displayOrder")}
                                defaultValue={'tp_number'}
                            >
                                <option value="tp_number">TP Number</option>
                                <option value="truck_number">Truck Number</option>

                            </select>
                        </div>
                        <div class="form-group">
                            <label htmlFor="enteredBy">Entered By:</label>
                            {/* <input
                            type="text"
                            class="form-control form-control-sm custom-border"
                            id="enteredBy"
                            name="enteredBy"
                            {...register("enteredBy")}
                        /> */}

                            {appUser ?
                                <select
                                    className="form-select form-select-sm border-dark-subtle"
                                    aria-label="Default select example"
                                    name='enteredBy'
                                    id='enteredBy'
                                    {...register("enteredBy")}
                                    defaultValue={''}
                                >
                                    <option value=''>Select All</option>

                                    {
                                        appUser.map((item, idx) => {
                                            return <option key={idx} value={item.id}>{item.name}</option>
                                        })
                                    }

                                </select> :
                                <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                                    <option value=""></option>
                                </select>
                            }

                        </div>

                        <div class="form-group">
                            <div className='row mx-auto'>

                                <input type="text" class="form-control form-control-sm m-1" id="smallInput" />

                                <input type="text" class="form-control form-control-sm m-1" id="smallInput" />

                            </div>
                        </div>
                    </div>
                    <div className='col-sm-2'>
                        <div className='col-sm card'>

                            <p className='m-1 text-center font-weight-bold'>Challan Status</p>
                            <hr className='m-1' />

                            <div className=''>
                                <p className='m-1 p-1 bg-danger rounded-1 text-center text-light'>Transit</p>
                                <p className='m-1 p-1 bg-dark rounded-1 text-center text-light'>Un-Loaded</p>
                                <p className='m-1 p-1 pink-color rounded-1 text-center text-dark'>Received</p>
                                <p className='m-1 p-1 bg-success rounded-1 text-center text-light'>Paid</p>
                            </div>

                        </div>
                        <div className='col-sm card mt-1'>
                            <div className=''>
                                <p className='m-1 text-center font-weight-bold'>Vehicle Status</p>
                                <hr className='m-1' />
                            </div>
                            <div className=''>
                                <p className='m-1 p-1 bg-success rounded-1 text-center text-light'>Known Vehicle</p>
                                <p className='m-1 p-1 bg-danger rounded-1 text-center text-light'>Unknown</p>
                            </div>

                        </div>

                    </div>
                </div>

            </form>
            <div>
                <h6> <span>Total Records : </span><span>{totalNumberOfData ? totalNumberOfData : 0}</span></h6>
            </div>
            <hr />
            <div className='mt-2'>

                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover align-middle">
                        <thead className="thead-dark">
                            <tr className='text-center'>
                                <th className='p-1' scope="col">SL No.</th>
                                <th className='p-1' scope="col">Challan No</th>
                                <th className='p-1' scope="col">Challan Date</th>
                                <th className='p-1' scope="col">TP Number</th>
                                <th className='p-1' scope="col">Truck Number</th>
                                <th className='p-1' scope="col">Load Qty</th>
                                <th className='p-1' scope="col">UL Qty</th>
                                <th className='p-1' scope="col">Rate</th>
                                <th className='p-1' scope="col">Off. Exp.</th>
                                <th className='p-1' scope="col">Cash Adv.</th>
                                <th className='p-1' scope="col">Bank Adv.</th>
                                <th className='p-1' scope="col">HSD Adv.</th>
                                <th className='p-1' scope="col">Slip No.</th>
                                <th className='p-1' scope="col">Petrol Pump Name</th>
                                <th className='p-1' scope="col">D Welfare</th>
                                <th className='p-1' scope="col">Status</th>
                                <th className='p-1' scope="col">Consigner</th>
                                <th className='p-1' scope="col">Consignee</th>
                                <th className='p-1' scope="col">Loading Point</th>
                                <th className='p-1' scope="col">Un-Loading Point</th>
                                <th className='p-1' scope="col">WS/Inv. Number</th>
                            </tr>
                        </thead>
                        <tbody className='font-weight-normal textColor'>
                            {
                                searchedData &&
                                searchedData.map((data, idx) => (
                                    <tr key={idx}>
                                        <td className='p-1 text-center'>{idx + 1}</td>

                                        <td className='p-1'>{data.challanNumber}</td>
                                        <td className='p-1'>{data.loadDate}</td>

                                        {searchedData && statusColor.map((item, i) => (

                                            (item.status === data.status) && <td key={i} className={data.status === item.status ? item.color : "p-1"}>{data.tpNumber}</td>

                                        ))}

                                        <td className='p-1'>{data.truckNumber ? data.truckNumber : ""}</td>
                                        <td className='p-1'>{data.loadWeight}</td>
                                        <td className='p-1'>{data.netUnloaded ? data.netUnloaded : ""}</td>
                                        <td className='p-1'>{data.vehicleRate ? data.vehicleRate : ""}</td>
                                        <td className='p-1'>{data.officeExpenses ? data.officeExpenses : ""}</td>
                                        <td className='p-1'>{data.cashAdvance ? data.cashAdvance : 0}</td>
                                        <td className='p-1'>{data.bankAdvance ? data.bankAdvance : 0}</td>
                                        <td className='p-1'>{data.hsdAdvance ? data.hsdAdvance : 0}</td>
                                        <td className='p-1'>{data.issueSlip ? data.issueSlip : ""}</td>
                                        <td className='p-1'>{data.fillingStationName ? data.fillingStationName : ""}</td>
                                        <td className='p-1'>{data.driverWelfare ? data.driverWelfare : ""}</td>
                                        <td className='p-1'>{data.status ? data.status : ""}</td>
                                        <td className='p-1'>{data.consignerShortName ? data.consignerShortName : ""}</td>
                                        <td className='p-1'>{data.exporterShortName ? data.exporterShortName : ""}</td>
                                        <td className='p-1'>{data.loadingPointName ? data.loadingPointName : ""}</td>
                                        <td className='p-1'>{data.unLoadingPointName ? data.unLoadingPointName : ""}</td>
                                        <td className='p-1'>{data.invNumber ? data.invNumber : ""}</td>
                                    </tr>


                                ))}

                        </tbody>
                    </table>


                </div>

                {/* Page size dropdown */}
                <div className="d-flex justify-content-end mb-3">
                    <label htmlFor="pageSize" className="form-label me-2 my-auto">
                        Records per page:
                    </label>
                    <select
                        id="pageSize"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="form-select form-select-sm"
                        style={{ width: 'auto' }} // Adjust width to make it smaller
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                    </select>
                </div>

                <div className='mt-2'>
                    {/* Render the pagination component */}
                    <PaginationComponent
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />

                </div>


                {/* modal start */}

                {/* Modal */}
                <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-top-center">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Exporting Data</h5>
                                <button type="button" className="btn-close" onClick={handleCancel}></button>
                            </div>
                            <div className="modal-body">
                                {loading ? (
                                    <>
                                        <p>Exporting data... Please wait.</p>
                                        <div className="progress">
                                            <div
                                                className="progress-bar progress-bar-striped progress-bar-animated"
                                                role="progressbar"
                                                style={{ width: `${progress}%` }}
                                            >
                                                {progress}%
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {isExportComplete ? (
                                            <p>Data exported successfully!</p>
                                        ) : (
                                            <p>Preparing to export...</p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={handleDownload}
                                    disabled={!isExportComplete}
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* modal end */}

            </div>
        </div>
    )
}

export default ChallanStatus;
