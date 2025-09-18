import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import axiosInstance from '../../config/AxiosConfig';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function BankAccountMaster() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [ownerData, setOwnerData] = useState();
    const [date, setDate] = useState(null);
    const [bankName, setBankName] = useState("");
    const [accNo, setAccNo] = useState("");
    const [startSpneer, setStartSpneer] = useState(false);


    const handleJoinningDate = (date) => {
        try {
            setDate(format(date, 'yyyy-MM-dd'));
        } catch (e) {

        }
    }

    const [postError, setPostError] = useState(false);
    const [displayModal, setDisplayModal] = useState(false);
    const [fnameIsEmpty, setFnameIsEmpty] = useState(false);
    const [snameIsEmpty, setSnameIsEmpty] = useState(false);
    const [updateData, setUpdateData] = useState(false); // used in useEffect as a dependency to update the table.
    const [editData, setEditData] = useState(null);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [isSaved, setIsSaved] = useState(false);


    useEffect(() => {
        if (accessDetails) {
            if (accessDetails.role === 'ADMIN') {
                getData();

            } else if (accessDetails.role === 'USER') {
                if (accessDetails.setupApplicationAccess === "Y") {
                    getData();
                }

            }

        } else {
            Swal.fire("Error", "You don't have access to this section.", "error");
            navigate('/work-space');
        }

    }, []);


    async function getData() {

        await axiosInstance.get("/api/v1/get/all/bank-account-master")
            .then(function (response) {
                // handle success
                setOwnerData(response.data);
                setUpdateData(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }
    // Saving the data
    async function postData(fdata) {
        await axiosInstance.post(`/api/v1/add/one/bank-account-master`,
            fdata
        )
            .then(function (response) {
                // handle success
                console.log(response.data);
                if (response.data === "success") {
                    setIsSaved(true);
                    setUpdateData(true);
                    setStartSpneer(false);

                } else if (response.data === "duplicate") {
                    setStartSpneer(false);
                    setPostError(true);
                } else {
                    setStartSpneer(false);
                    setPostError(true);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate") {
                    setIsDuplicate(true);
                    setStartSpneer(false);
                } else {
                    setStartSpneer(false);
                }

            });
    }

    useEffect(() => {
        getData();

    }, [updateData]);

    useEffect(() => {

        let timer1, timer2, timer3, timer4;
        if (fnameIsEmpty) {
            timer1 = setTimeout(() => {
                setFnameIsEmpty(false);
            }, 3000);
        }
        if (snameIsEmpty) {
            timer2 = setTimeout(() => {
                setSnameIsEmpty(false);
            }, 3000);
        }
        if (isDuplicate) {
            timer3 = setTimeout(() => {
                setIsDuplicate(false);
            }, 4000);
        }

        if (isSaved) {
            timer4 = setTimeout(() => {
                setDate("");
                setBankName("");
                setAccNo("");
                document.getElementById("form1").reset();
                setIsSaved(false);
            }, 3000);
        }

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };

    }, [fnameIsEmpty, snameIsEmpty, isDuplicate, isSaved]);

    function handleSave(e) {
        e.preventDefault();
        setStartSpneer(true);
        if (!bankName) {
            setFnameIsEmpty(true);
            setStartSpneer(false);
            return
        }
        if (!accNo) {
            setSnameIsEmpty(true);
            setStartSpneer(false)
            return
        }

        const fdata = {
            "joiningDate": date,
            "bankName": bankName,
            "accNo": accNo
        }
        postData(fdata);
    }

    // handle delete

    async function handleDelete(id) {
        const isConfirmed = window.confirm("Are you sure to delete ?");
        if (isConfirmed) {
            await axiosInstance.get(`/api/v1/delete/bank-account-by-id/${id}`)
                .then(function (response) {
                    // handle success
                    if (response.data === "success") {
                        Swal.fire("Deleted", "Account Details Deleted Successfully!!", "success");
                        setUpdateData(true);
                    }
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        }
        console.log(id);
    }

    function handleEdit(id, name, comm, sname) {
        setDisplayModal(true);
        setEditData({ id, name, comm, sname });
    }

    const handleClear = () => {
        setDate(null);
        setBankName("");
        setAccNo("");
    }


    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Bank Account Master</span>
            </div>
            <div className='row'>

                {/*   <!-- Area Chart --> */}
                <div className="col-xl-4 col-lg-3 mx-auto">
                    <div className="card shadow mb-4">
                        {/*  <!-- Card Body --> */}
                        <div className="card-body font-weight-bold text-dark">
                            <form className='justify-content-around' id="form1">
                                <div className="form-group">
                                    <p htmlFor="joiningDate">Joining Date</p>

                                    <DatePicker
                                        className="date-picker-input pl-2 w-200"
                                        selected={date}
                                        onChange={handleJoinningDate}
                                        name="joiningDate"
                                        dateFormat="d-MMM-yyyy"
                                        placeholderText="Select a date"
                                        id="joiningDate"
                                    />

                                </div>

                                <div className="form-group">
                                    <label htmlFor="bankName">Bank Name</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm border-dark-subtle"
                                        id="bankName"
                                        onChange={(e) => { setBankName(e.target.value) }}
                                        required
                                    />
                                    {fnameIsEmpty && <div className="text-sm text-danger font-weight-normal">Bank Name should not be Empty!!</div>}

                                </div>
                                <div className="form-group">
                                    <label htmlFor="accNo">Account Number</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm border-dark-subtle"
                                        id="accNo"
                                        onChange={(e) => { setAccNo(e.target.value) }}
                                        required
                                    />
                                    {snameIsEmpty && <div className="text-sm text-danger font-weight-normal">Account No. should not be Empty!!</div>}
                                </div>

                                <div id="buttons" className="btn-div">

                                    <button type="submit" form="form1" className="btn btn-sm btn-primary m-1" onClick={(e) => { handleSave(e) }}>
                                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                        </div>}
                                        Save
                                    </button>

                                    <button type="reset" className="btn btn-outline-primary btn-sm m-1" onClick={handleClear}>
                                        Clear
                                    </button>
                                </div>
                            </form>
                            {
                                postError && <div className="alert alert-danger alert-dismissible fade show m-2" role="alert">
                                    Some Error Occurred !!
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            }
                            {
                                isDuplicate && <div className="alert alert-warning fade show m-2" role="alert">
                                    Short Name already exist.
                                </div>
                            }
                            {
                                isSaved && <div className="alert alert-success fade show m-2" role="alert">
                                    Successfully Saved.
                                </div>
                            }
                        </div>
                    </div>
                </div>

                {/*  <!-- Pie Chart --> */}
                <div className="col mx-auto">
                    <div className="card shadow mb-4">
                        {/*  <!-- Card Header - Dropdown --> */}
                        <div
                            className="card-header py-2 d-flex flex-row align-items-center justify-content-around">
                            <h6 className="m-0 font-weight-bold text-secondary text-center">List of Existing Bank Accounts</h6>

                        </div>
                        {/*  <!-- Card Body --> */}
                        {ownerData ?
                            <div className="card-body">
                                <table className="table table-bordered align-item-center text-light bg-info">
                                    <thead className="thead-dark">
                                        <tr className='text-center'>
                                            <th scope="col">SL No.</th>
                                            <th scope="col">Bank Name</th>
                                            <th scope="col">Account Number</th>
                                            <th scope='col'>Date</th>
                                            <th scope="col" colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ownerData.map((data, idx) => (
                                            <tr key={idx}>
                                                <td className='text-center'>{idx + 1}</td>
                                                <td className=''>{data.bankName}</td>
                                                <td className=''>{data.accNo}</td>
                                                <td className=''>{data.joiningDate}</td>
                                                <td className='text-center' data-toggle="modal" data-target="#editModal" onClick={() => { handleEdit(data.id, data.name, data.communication, data.shortName) }}><i className="bi bi-pencil-square text-info bg-white p-1 rounded custom-cursor-hand"></i></td>
                                                <td className='text-center'><i className="bi bi-trash text-danger bg-white p-1 rounded custom-cursor-hand" onClick={() => { handleDelete(data.id) }}></i></td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                            </div>
                            : <div className="spinner-border text-primary m-5" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        }

                    </div>
                </div>
                {displayModal && <Modal eData={editData} closeModal={() => {
                    setDisplayModal(false);
                }} updated={() => { setUpdateData(true) }} />}

            </div>

        </div>
    )
}

export default BankAccountMaster;
