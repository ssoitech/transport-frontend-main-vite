import React, { useState, useEffect } from 'react';
import ModalExportConsigneeMaster from './modals/ModalExportConsigneeMaster';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../config/AxiosConfig';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function ExporterConsigneeMaster() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [ownerData, setOwnerData] = useState();
    const [fname, setFname] = useState("");
    const [sname, setSname] = useState("");
    const [phNo, setPhNo] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
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

        await axiosInstance.get('/api/v1/get/all-exporter-consignee-master')
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

        await axiosInstance.post('/api/v1/add/exporter-consignee-master',
            fdata
        )

            .then(function (response) {
                // handle success
                console.log(response.data);
                if (response.data === "success" && response.status === 201) {
                    toast.success('Successfully Saved!', {
                        position: "bottom-center",
                        style: {
                            background: "green",
                            color: "#fff",
                        }
                    });
                    setIsSaved(true);
                    setUpdateData(true);
                    setStartSpneer(false);

                } else {
                    toast.error("Some Error Occured!");
                    setPostError(true);
                    return false;
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    toast.error("Short name already exists!");
                    setStartSpneer(false);
                } else {
                    toast.error("Some Error Occured!");
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
        console.log("inside 3rd use effect")
        let timer;
        if (fnameIsEmpty) {
            timer = setTimeout(() => {
                setFnameIsEmpty(false);
            }, 3000);
        }
        if (snameIsEmpty) {
            timer = setTimeout(() => {
                setSnameIsEmpty(false);
            }, 3000);
        }
        if (isDuplicate) {
            timer = setTimeout(() => {
                setIsDuplicate(false);
            }, 4000);
        }

        if (isSaved) {
            timer = setTimeout(() => {
                setFname("");
                setSname("");
                setPhNo("");
                setAddress1("");
                setAddress2("");
                setAddress3("");
                document.getElementById("form1").reset();
                setIsSaved(false);
            }, 3000);
        }

        return () => {
            clearTimeout(timer);
        };

    }, [fnameIsEmpty, snameIsEmpty, isDuplicate, isSaved]);

    function handleSave(e) {
        e.preventDefault();
        setStartSpneer(true);
        console.log(fname, sname, phNo, address1, address2, address3);
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
            "shortName": sname,
            "contactNo": phNo,
            "address1": address1,
            "address2": address2,
            "address3": address3
        }


        postData(fdata);


    }

    async function deleteOneData(id) {

        await axiosInstance.get(`/api/v1/delete/exporter-consignee-master/${id}`)
            .then(function (response) {
                // handle success
                if (response.data === "success") {
                    setUpdateData(true);
                    Swal.fire({
                        title: "Successfully Deleted!",
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: "Some Error Occures!!",
                        icon: "error"
                    });
                }
            })
            .catch(function (error) {
                // handle error
                Swal.fire({
                    title: "Some Error Occures!!",
                    icon: "error"
                });
            });


    }

    // handle delete
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
                deleteOneData(id);
            }
        });

    }

    function handleEdit(id, name, contactNo, sname, add1, add2, add3) {
        setDisplayModal(true);
        setEditData({ id, name, contactNo, sname, add1, add2, add3 });
    }


    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Exporter/Consignee Master</span>
            </div>
            <div className='row'>
                {/*   <!-- Area Chart --> */}
                <div className="mx-auto">
                    <div className="mb-2">
                        {/*  <!-- Card Body --> */}
                        <div className="card-body">
                            <form className='justify-content-around' id="form1">
                                <div className='row'>
                                    <div className="form-group m-1 col-sm">
                                        <div className="input-group input-group-sm m-1">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-sm">Name</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                aria-label="Small"
                                                aria-describedby="inputGroup-sizing-sm"
                                                onChange={(e) => { setFname(e.target.value) }}
                                            />
                                        </div>
                                        {fnameIsEmpty && <div className="text-sm text-danger font-weight-normal">Name should not be Empty!!</div>}
                                    </div>

                                    <div className="form-group m-1 col-sm">
                                        <div className="input-group input-group-sm m-1">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-sm">Short Name</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                aria-label="Small"
                                                aria-describedby="inputGroup-sizing-sm"
                                                onChange={(e) => { setSname(e.target.value) }}
                                            />
                                        </div>
                                        {snameIsEmpty && <div className="text-sm text-danger font-weight-normal">Short Name should not be Empty!!</div>}
                                    </div>
                                    <div className="form-group m-1 col-sm">
                                        <div className="input-group input-group-sm m-1">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-sm">Contact No</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                aria-label="Small"
                                                aria-describedby="inputGroup-sizing-sm"
                                                onChange={(e) => { setPhNo(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="form-group m-1 col-sm">

                                        <div className="input-group input-group-sm m-1">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-sm">Address 1</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                aria-label="Small"
                                                aria-describedby="inputGroup-sizing-sm"
                                                onChange={(e) => { setAddress1(e.target.value) }}
                                            />
                                        </div>

                                    </div>

                                    <div className="form-group m-1 col-sm">

                                        <div className="input-group input-group-sm m-1">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-sm">Address 2</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                aria-label="Small"
                                                aria-describedby="inputGroup-sizing-sm"
                                                onChange={(e) => { setAddress2(e.target.value) }}
                                            />
                                        </div>

                                    </div>
                                    <div className="form-group m-1 col-sm">

                                        <div className="input-group input-group-sm m-1">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text" id="inputGroup-sizing-sm">Address 3</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="form-control"
                                                aria-label="Small"
                                                aria-describedby="inputGroup-sizing-sm"
                                                onChange={(e) => { setAddress3(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='btn-div mx-auto justify-content-around'>
                                    <button type="submit" form="form1" className="btn btn-sm btn-primary m-2" onClick={(e) => { handleSave(e) }}>
                                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                        </div>}
                                        Save
                                    </button>
                                    <button type="reset" className="btn btn-sm btn-outline-primary">
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
                            <div>
                                <Toaster
                                    position="bottom-center"
                                    reverseOrder={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/*  <!-- Pie Chart --> */}
                <div className="mx-auto">
                    <div className="mb-4">
                        {/*  <!-- Card Header - Dropdown --> */}
                        <div
                            className="card-header py-2 d-flex flex-row align-items-center justify-content-around">
                            <h6 className="m-0 font-weight-bold text-primary text-center">List of Existing Mines/ Consignor</h6>

                        </div>
                        {/*  <!-- Card Body --> */}
                        {ownerData &&
                            <div className="overflow-auto">
                                <table className="table table-striped table-bordered table-hover align-middle">
                                    <thead className="thead-dark">
                                        <tr className='text-center'>
                                            <th className='p-1' scope="col">SL No.</th>
                                            <th className='p-1' scope="col">Exporter/Consignee Name</th>
                                            <th className='p-1' scope="col">Contact No</th>
                                            <th className='p-1' scope="col">Short Name</th>
                                            <th className='p-1' scope="col">Address 1</th>
                                            <th className='p-1' scope="col">Address 2</th>
                                            <th className='p-1' scope="col">Address 3</th>
                                            <th className='p-1' scope="col" colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='font-weight-normal textColor'>
                                        {ownerData.map((data, idx) => (
                                            <tr key={idx}>
                                                <td className='p-1'>{idx + 1}</td>
                                                <td className='p-1'>{data.name}</td>
                                                <td className='p-1'>{data.contactNo}</td>
                                                <td className='p-1'>{data.shortName}</td>
                                                <td className='p-1'>{data.address1}</td>
                                                <td className='p-1'>{data.address2}</td>
                                                <td className='p-1'>{data.address3}</td>
                                                <td className='p-1 text-center' data-toggle="modal" data-target="#editModal" onClick={() => { handleEdit(data.id, data.name, data.contactNo, data.shortName, data.address1, data.address2, data.address3) }}><i className="bi bi-pencil-square text-primary"></i></td>
                                                <td className='p-1 text-center'><i className="bi bi-trash text-danger" onClick={() => { handleDelete(data.id) }}></i></td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                            </div>

                        }

                    </div>
                </div>
                {
                    displayModal && <ModalExportConsigneeMaster eData={editData} closeModal={() => {
                        setDisplayModal(false);
                    }} updated={() => { setUpdateData(true) }} />
                }

            </div >
        </div>
    )
}

export default ExporterConsigneeMaster;
