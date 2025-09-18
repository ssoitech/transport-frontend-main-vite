import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useForm, Controller } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Swal from "sweetalert2";
import axiosInstance from '../../config/AxiosConfig';
import AutoComplete from '../searchComponent/AutoComplete';
import PaginationComponent from '../customComponents/PaginationComponent';


function HsdChallanReconsile() {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [allFillingStationsName, setAllFillingStationsName] = useState(null);
    const [permitNumberDetails, setPermitNumberDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingReconsile, setLoadingReconsile] = useState(false);

    const [searchedData, setSearchedData] = useState([]);
    const [formData, setFormData] = useState([]);
    const [totalNumberOfData, setTotalNumberOfData] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValues, setInputValues] = useState({});

    const [show, setShow] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const [selectedRowIndex, setSelectedRowIndex] = useState(null); // To track the selected row
    const [pageSize, setPageSize] = useState(50); // Default page size is 50

    const { register, handleSubmit, reset } = useForm();


    const { control: controlFirstSection,
        getValues: getFirstSectionValue,
        setValue: setFirstSectionValue,
        watch: watchFirstSectionValue,
        register: registerFirstSection,
        handleSubmit: handleFirstSectionSubmit,
        reset: resetFirstSection,
        formState: { errors }
    } = useForm();


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

    useEffect(() => {
        getAllFillingStationsName();
    }, [])

    // Open modal with selected row's data
    const handleRowClick = (record, index) => {
        console.log("index : ", index);
        setSelectedRecord(record);
        setSelectedRowIndex(index); // Set the selected row index
        reset(record); // Prefill form with the selected row's data
        setShow(true);
    };

    // Close modal
    const handleClose = () => {
        setShow(false);
        setSelectedRowIndex(null); // Clear the selected row on modal close
        setSelectedRecord(null);
    }

    async function updatePetrolPump(data) {
        console.log(data);
        setLoadingReconsile(true);
        await axiosInstance.post('/api/vi/hsd/reconsile/update-petrol-pump-id',
            data
        )
            .then(function (response) {
                // handle success
                console.log(response.data);
                setLoadingReconsile(false);
                if (response.data === "success") {
                    Swal.fire("Successfully Updated!!");
                }


            })
            .catch(function (error) {
                // handle error
                setLoadingReconsile(false);
                Swal.fire("Some Error Occured!");

                console.log(error.response);

            });
    }

    // Handle form submission
    const onSubmit = async (data) => {
        if (!data.usedIn && !data.tpNumber) {
            return;
        }
        const fData = {
            "petrolPumpId": data.usedIn,
            "tpNumber": data.tpNumber
        }
        await updatePetrolPump(fData);
        // Add your update logic here
        // setShow(false); Close modal after update
        // setSelectedRowIndex(null); Clear the selected row after submission
    };



    async function getDataByPagenumber(fData, page) {
        setLoading(true);
        console.log(fData);
        await axiosInstance.post('/api/vi/hsd-register/hsd-reconsile',
            fData
        )
            .then(function (response) {
                // handle success
                console.log(response.data);
                // console.log(response.data.totalPages);
                setSearchedData(response.data.content);
                setTotalNumberOfData(response.data.totalElements);
                setTotalPages(response.data.totalPages); // Set the total pages
                setCurrentPage(page); // Set the current page
                setLoading(false);

            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                console.log(error.response);

            });
    }


    async function postFilteredData(data, page) {
        if (!data.fromDate && !data.toDate) return
        const formData = {
            "petrolPumpName": data.petrolPump ? data.petrolPump === "All Pumps" ? null : data.petrolPump : null,
            "startDate": data.fromDate ? format(data.fromDate, 'yyyy-MM-dd') : null,
            "endDate": data.toDate ? format(data.toDate, 'yyyy-MM-dd') : null,
            "permitNumber": permitNumberDetails ? permitNumberDetails.name : null,
            "orderBy": data.orderBy ? data.orderBy : null,
            "page": page,
            "size": pageSize,
        }

        setFormData(formData);
        getDataByPagenumber(formData, page);
    }



    // Handle page change
    const handlePageChange = (page) => {
        postFilteredData(inputValues, page); // Fetch data for the selected page
    };

    // Handler for changing page size
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        // postFilteredData(inputValues, 0); // Re-fetch data with new page size, starting from page 0
    };




    const onProceed = async (data) => {

        try {

            setInputValues(data); // Store the input values for pagination
            await postFilteredData(data, 0);

        } catch (error) {
            console.error("Error fetching report data:", error);
        }
    }

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>HSD Bill Reconsile</span>
            </div>

            <form onSubmit={handleFirstSectionSubmit(onProceed)}>
                <div className="container mt-3">
                    {/* First row of 6 select boxes */}

                    <div className="row">
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox1">Petrol Pump</label>
                                {allFillingStationsName ?
                                    <select
                                        className="form-select form-select-sm"
                                        aria-label="Default select example"
                                        name='petrolPump'
                                        id='petrolPump'
                                        {...registerFirstSection("petrolPump")}
                                    >
                                        <option value="">All Pumps</option>
                                        {
                                            allFillingStationsName.map((item, idx) => {
                                                return <option key={idx} value={item.name}>{item.name}</option>
                                            })
                                        }

                                    </select> :
                                    <select className="form-select form-select-sm" aria-label="Default select example">
                                        <option value=""></option>
                                    </select>
                                }
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox">Select</label>
                                <select
                                    className="form-select form-select-sm border-dark-subtle"
                                    id="selectBox"
                                    name='selectBox'
                                    {...registerFirstSection("selectBox")}
                                >
                                    <option value="1">Challan Date</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox3">from Date</label>
                                <Controller
                                    name="fromDate"
                                    control={controlFirstSection}
                                    render={({ field }) => (
                                        <DatePicker
                                            className="date-picker-input pl-2 w-100"
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            dateFormat="d-MMM-yyyy"
                                            placeholderText="Select From Date"
                                            id="fromDate"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox4">To Date</label>
                                <Controller
                                    name="toDate"
                                    control={controlFirstSection}
                                    render={({ field }) => (
                                        <DatePicker
                                            className="date-picker-input pl-2 w-100"
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            dateFormat="d-MMM-yyyy"
                                            placeholderText="Select From Date"
                                            id="toDate"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox5">Petrol Pump Name</label>
                                {allFillingStationsName ?
                                    <select
                                        className="form-select form-select-sm"
                                        aria-label="Default select example"
                                        name='petrolPump2'
                                        id='petrolPump2'
                                        {...registerFirstSection("petrolPump2")}
                                    >

                                        {
                                            allFillingStationsName.map((item, idx) => {
                                                return <option key={idx} value={item.name}>{item.name}</option>
                                            })
                                        }

                                    </select> :
                                    <select className="form-select form-select-sm" aria-label="Default select example">
                                        <option value=""></option>
                                    </select>
                                }
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <input className="form-check-input border-dark-subtle" type="checkbox" id="exampleCheckbox" />
                                <label className="form-check-label" htmlFor="exampleCheckbox">
                                    Reconsile
                                </label>
                            </div>
                        </div>
                    </div>


                    {/* Second row of 6 select boxes */}

                    <div className="row mt-3">
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox7">Permit Number</label>
                                <AutoComplete
                                    placeholder={"Search here"}
                                    url={'/api/v1/get/permit-number?keyword='}
                                    datakey={"name"}
                                    customLoading={<>Loading..</>}
                                    onSelect={(res) => setPermitNumberDetails(res)}
                                    onChange={(input) => { }}
                                    onBlur={(e) => { }}
                                    onFocus={(e) => { }}
                                    customStyles={{}}
                                />

                            </div>


                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox1">Select</label>
                                <select
                                    className="form-select form-select-sm border-dark-subtle"
                                    id="orderBy"
                                    {...registerFirstSection("orderBy")}
                                >
                                    <option value="truckNumber">Truck Number</option>
                                    <option value="loadDate">Challan Date</option>
                                    <option value="tpNumber">TP Number</option>
                                    <option value="challanNumber">Challan Number</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group pt-2">

                                {/* <button
                                    type="submit"
                                    className="btn btn-sm btn-primary mt-4"

                                >
                                    Proceed
                                </button> */}
                                <button type="submit" className="btn btn-sm btn-primary mt-4" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </>
                                    ) : (
                                        'Proceed'
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group pt-2">
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary mt-4"

                                >
                                    Excel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary mt-4 ml-2"

                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox1">Go To</label>
                                <select className="form-select form-select-sm border-dark-subtle" id="selectBox1">
                                    <option value="1">Truck Number</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group pt-2">
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle mt-4"
                                    id="tpNumber"
                                    name="tpNumber"

                                />
                            </div>
                        </div>
                    </div>



                    <div className="row mt-3">
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox7">Trip</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    id="tpNumber"
                                    name="tpNumber"
                                    defaultValue={totalNumberOfData ? totalNumberOfData : ""}
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox7">Total HSD</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    id="tpNumber"
                                    name="tpNumber"

                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <label htmlFor="selectBox7">Total Amount</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    id="tpNumber"
                                    name="tpNumber"

                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <hr />

            {/* table */}

            <div className="container mt-3">
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">SL.No.</th>
                                <th scope="col">Challan No.</th>
                                <th scope="col">Challan Date</th>
                                <th scope="col">TP Number</th>
                                <th scope="col">Truck Number</th>
                                <th scope="col">Loading Point</th>
                                <th scope="col">Petrol Pump</th>
                                <th scope="col">Issue Slip</th>
                                <th scope="col">HSD Qty.</th>
                                <th scope="col">Rate</th>
                                <th scope="col">Amount</th>
                                <th scope="col">HSD in Cash</th>
                                <th scope="col">HSD Filling Date</th>
                                <th scope="col">Multiple Slip</th>
                            </tr>
                        </thead>
                        {
                            searchedData ? <tbody>
                                {searchedData.map((record, index) => (
                                    <tr key={index}
                                        onClick={() => handleRowClick(record, index)}
                                        style={{ backgroundColor: index === selectedRowIndex ? '#d3d3d3' : '', cursor: 'pointer' }}  // Highlight selected row
                                    >
                                        <td>{index + 1}</td>
                                        <td>{record.challanNumber}</td>
                                        <td>{record.loadDate}</td>
                                        <td>{record.tpNumber}</td>
                                        <td>{record.truckNumber}</td>
                                        <td>{record.loadingPoint}</td>
                                        <td>{record.petrolPumpName}</td>
                                        <td>{record.issueSlip}</td>
                                        <td>{record.hsdIssued}</td>
                                        <td>{record.hsdRate ? record.hsdRate : 0}</td>
                                        <td>{record.hsdRate ? record.hsdRate : 0}</td>
                                        <td>{record.hsdAdvance ? parseFloat(record.hsdAdvance).toFixed(2) : 0.00}</td>
                                        <td>{record.hsdFillingDate}</td>
                                        <td>{record.multipleSlip}</td>
                                    </tr>
                                ))}
                            </tbody> : ""

                        }

                    </table>
                </div>
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

            {/* table end */}
            {/* ------------------------------------------------- */}


            {/* Modal */}
            {selectedRecord && (
                <div className={`modal ${show ? 'd-block' : ''}`} tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document" style={{ maxHeight: '80vh' }}>
                        <div className="modal-content" style={modalStyle}>
                            <div className="modal-header">
                                <h5 className="modal-title">HSD Issued Details</h5>
                                <button type="button" className="close" onClick={handleClose}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* First row of inputs with 3 fields */}
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label>Bill Status</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('billStatus')}
                                                defaultValue={selectedRecord.billStatus}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>Slip No</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('slipNo')}
                                                defaultValue={selectedRecord.issueSlip}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>TP No</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('tpNo')}
                                                defaultValue={selectedRecord.tpNumber}
                                            />
                                        </div>
                                    </div>

                                    {/* Second row of inputs with 3 fields */}
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label>Loading Point</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('loadingPoint')}
                                                defaultValue={selectedRecord.loadingPoint}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>HSD in Amt</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('hsdAmt')}
                                                defaultValue={selectedRecord.hsdAdvance}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>Challan/Issue</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('challanIssue')}
                                                defaultValue={selectedRecord.hsdFillingDate}
                                            />
                                        </div>
                                    </div>

                                    {/* Third row of inputs with 3 fields */}
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label>Issued From</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('issuedFrom')}
                                                defaultValue={selectedRecord.petrolPumpName}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>Vehicle No</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('vehicleNo')}
                                                defaultValue={selectedRecord.truckNumber}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>Challan No</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('challanNo')}
                                                defaultValue={selectedRecord.challanNumber}
                                            />
                                        </div>
                                    </div>

                                    {/* Fourth row of inputs with 3 fields */}
                                    <div className="form-row">
                                        <div className="form-group col-md-4">
                                            <label>Used In</label>
                                            {allFillingStationsName ?
                                                <select
                                                    className="form-select form-select-sm border-dark-subtle"
                                                    aria-label="Default select example"
                                                    name='usedIn'
                                                    id='usedIn'
                                                    {...register("usedIn")}
                                                >
                                                    <option value="">select</option>
                                                    {
                                                        allFillingStationsName.map((item, idx) => {
                                                            return <option key={idx} value={item.nameId}>{item.name}</option>
                                                        })
                                                    }

                                                </select> :
                                                <select className="form-select form-select-sm" aria-label="Default select example">
                                                    <option value=""></option>
                                                </select>
                                            }
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>HSD in Liter</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('hsdInLiter')}
                                                defaultValue={selectedRecord.hsdIssued ? selectedRecord.hsdIssued : 0.00}
                                            />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label>Filling Date</label>
                                            <input
                                                className="form-control form-control-sm border-dark-subtle"
                                                {...register('fillingDate')}
                                                defaultValue={selectedRecord.hsdFillingDate ? selectedRecord.hsdFillingDate : ""}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mt-3">

                                        <button type="submit" className="btn btn-primary btn-sm mr-2" disabled={loadingReconsile}>
                                            {loadingReconsile ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update'
                                            )}
                                        </button>
                                        <button type="button" className="btn btn-danger btn-sm">
                                            Block
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* modal end */}

        </div>
    )
}

const modalStyle = {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '20px',
    minHeight: '60vh',
    maxHeight: '80vh',
    backgroundColor: 'lightyellow'
};

export default HsdChallanReconsile;
