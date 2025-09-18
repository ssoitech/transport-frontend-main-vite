import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { BaseUrl } from '../../services/BaseURI';
import { toast, Toaster } from 'react-hot-toast';
import ModalExportConsigneeMaster from './modals/ModalExportConsigneeMaster';
import axiosInstance from '../../config/AxiosConfig';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MinesConsignorOwnerMaster() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [ownerData, setOwnerData] = useState();
    const [fname, setFname] = useState("");
    const [sname, setSname] = useState("");
    const [comms, setComms] = useState("");
    const [startSpneer, setStartSpneer] = useState(false);

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
            if (accessDetails.role !== 'ADMIN') {
                if (accessDetails.role === 'USER') {
                    if (accessDetails.setupApplicationAccess !== "Y") {
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


    async function getData() {

        await axiosInstance.get('/api/v1/get/all-consigner-owner-master')
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
        // const URL = '/api/v1/add/consigner-owner-master';
        await axiosInstance.post('/api/v1/add/consigner-owner-master',
            fdata
        )
            .then(function (response) {
                // handle success
                console.log(response.data);
                if (response.data === "success" && response.status === 201) {
                    setIsSaved(true);
                    setUpdateData(true);
                    setStartSpneer(false);
                    toast.success('Successfully Saved!', {
                        position: "bottom-center",
                        style: {
                            background: "green",
                            color: "#fff",
                        }
                    });


                } else {
                    setPostError(true);
                    toast.success('Some Error Occured!', {
                        position: "bottom-center",
                        style: {
                            background: "red",
                            color: "#fff",
                        }
                    });
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    setIsDuplicate(true);
                    setStartSpneer(false);
                } else {
                    setStartSpneer(false);
                }

            });
    }

    useEffect(() => {
        console.log("from consign-master");
        getData();
    }, []);

    useEffect(() => {
        console.log("inside 2nd use effect")
        getData();

    }, [updateData]);

    useEffect(() => {
        // console.log("inside 3rd use effect")
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
                setFname("");
                setSname("");
                setComms("");
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
        if (!fname) {
            setFnameIsEmpty(true);
            setStartSpneer(false);
            return
        }
        if (!sname) {
            setSnameIsEmpty(true);
            setStartSpneer(false)
            return
        }

        const fdata = {
            "name": fname,
            "communication": comms,
            "shortName": sname
        }
        postData(fdata);
    }

    // handle delete

    async function handleDeleteOneById(id) {
        await axiosInstance.get(`/api/v1/delete/consigner-owner-master/${id}`)
            .then(function (response) {
                // handle success
                if (response.data === "success") {
                    setUpdateData(true);
                    Swal.fire({
                        title: "Successfully Deleted!",
                        icon: "success"
                    });
                }
            })
            .catch(function (error) {
                // handle error

                Swal.fire({
                    title: "Some Error Occured!!",
                    icon: "error"
                });
            });
    }

    async function handleDelete(id) {
        Swal.fire({
            title: "Are you sure to Delete?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Delete"
        }).then((result) => {
            if (result.isConfirmed) {

                handleDeleteOneById(id);
            }
        });

    }

    function handleEdit(id, name, comm, sname) {
        setDisplayModal(true);
        setEditData({ id, name, comm, sname });
    }


    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Mines/Consignor Owner Master</span>
            </div>
            <div>

                {/*   <!-- Area Chart --> */}
                <div className="mx-auto">
                    <div className="mb-4">
                        {/*  <!-- Card Body --> */}
                        <div className="card-body font-weight-bold text-dark">
                            <form className='justify-content-around' id="form1">
                                <div className='row'>
                                    <div className="col-xl-4 form-group">
                                        <label htmlFor="consignorName">Consignor Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="consignorName"
                                            placeholder=""
                                            onChange={(e) => { setFname(e.target.value) }}
                                            required
                                        />
                                        {fnameIsEmpty && <div className="text-sm text-danger font-weight-normal">This field should not be Empty!!</div>}
                                    </div>

                                    <div className="col-xl-4 form-group">
                                        <label htmlFor="shortName">Short Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="shortName"
                                            placeholder=""
                                            onChange={(e) => { setSname(e.target.value) }}
                                            required
                                        />
                                        {snameIsEmpty && <div className="text-sm text-danger font-weight-normal">This field should not be Empty!!</div>}
                                    </div>
                                    <div className="col-xl-4 form-group">
                                        <label htmlFor="communication">Communication</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="communication"
                                            placeholder=""
                                            onChange={(e) => { setComms(e.target.value) }}
                                        />
                                    </div>
                                </div>

                                <div id="buttons" className="btn-div">
                                    <button type="submit" form="form1" disabled={startSpneer} className="btn btn-sm btn-primary m-1" onClick={(e) => { handleSave(e) }}>
                                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">
                                        </div>}
                                        <span>Save</span>
                                    </button>
                                    <button type="reset" className="btn btn-outline-primary btn-sm m-1">
                                        Clear
                                    </button>
                                </div>
                            </form>
                            {
                                isDuplicate && <div className="alert alert-warning fade show m-2" role="alert">
                                    Short Name already exist.
                                </div>
                            }

                        </div>
                    </div>
                </div>

                {/*  <!-- Pie Chart --> */}
                <div className="col mx-auto">
                    <div className="mb-2 text-center">
                        {/*  <!-- Card Header - Dropdown --> */}
                        <div
                            className="card-header py-2 d-flex flex-row align-items-center justify-content-around">
                            <h6 className="m-0 font-weight-bold text-primary text-center">List of Existing Mines/ Consignor</h6>

                        </div>
                        {/*  <!-- Card Body --> */}
                        {ownerData ?
                            <div className="overflow-auto">
                                <table className="table table-bordered table-hover table-striped">
                                    <thead className="thead-dark">
                                        <tr className='text-center'>
                                            <th className='p-1' scope="col">SL No.</th>
                                            <th className='p-1' scope="col">Consigner Name</th>
                                            <th className='p-1' scope="col">Communication</th>
                                            <th className='p-1' scope="col">Short Name</th>
                                            <th className='p-1' scope="col" colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ownerData.map((data, idx) => (
                                            <tr key={idx}>
                                                <td className='p-1 text-center'>{idx + 1}</td>
                                                <td className='p-1 text-left'>{data.name}</td>
                                                <td className='p-1 text-left'>{data.communication}</td>
                                                <td className='p-1 text-left'>{data.shortName}</td>
                                                <td className='p-1 text-center' data-toggle="modal" data-target="#editModal" onClick={() => { handleEdit(data.id, data.name, data.communication, data.shortName) }}><i className="bi bi-pencil-square text-primary custom-cursor-hand"></i></td>
                                                <td className='p-1 text-center'><i className="bi bi-trash text-danger custom-cursor-hand" onClick={() => { handleDelete(data.id) }}></i></td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                            </div>
                            : <div className="spinner-border text-primary m-5 text-center" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        }

                    </div>
                </div>
                {displayModal && <Modal eData={editData} closeModal={() => {
                    setDisplayModal(false);
                }} updated={() => { setUpdateData(true) }} />}

            </div>
            <Toaster
                position="bottom-center"
                reverseOrder={true}
            />
        </div>
    )
}

export default MinesConsignorOwnerMaster
