import React, { useState, useEffect } from "react";
import { toast, Toaster } from 'react-hot-toast';
import EditTransportingMaterialModal from "../modals/EditTransportingMaterialModal";
import axiosInstance from "../../../config/AxiosConfig";
import Swal from "sweetalert2";


function TransportingMaterials() {
    const [materialData, setMaterialData] = useState();
    const [name, setName] = useState("");
    const [nameIsEmpty, setNameIsEmpty] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [startSpneer, setStartSpneer] = useState(false);
    const [postError, setPostError] = useState(false);
    const [updateData, setUpdateData] = useState(false);

    const [editData, setEditData] = useState(null);
    const [displayModal, setDisplayModal] = useState(false);


    async function getData() {
        await axiosInstance.get('/api/v1/get/all/transporting-materials')
            .then(function (response) {
                // handle success
                setMaterialData(response.data);
                setUpdateData(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function postData(fdata) {
        await axiosInstance.post('/api/v1/add/one/transporting-material',
            fdata
        )
            .then(function (response) {
                // handle success
                console.log(response.data);
                if (response.data === "success" && response.status === 201) {
                    toast.success('Successfully Added!', {
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
                    setPostError(true);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    // setIsDuplicate(true);
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

        let timer;
        if (nameIsEmpty) {
            timer = setTimeout(() => {
                setNameIsEmpty(false);
            }, 3000);
        }
        if (postError) {
            timer = setTimeout(() => {
                setPostError(false);
            }, 3000);
        }

        if (isSaved) {
            timer = setTimeout(() => {
                setName("");
                document.getElementById("form1").reset();
                setIsSaved(false);
            }, 3000);
        }

        return () => {
            clearTimeout(timer);
        };

    }, [nameIsEmpty, postError, isSaved]);

    function handleAdd(e) {
        setStartSpneer(true);
        e.preventDefault();
        if (!name) {
            setNameIsEmpty(true);
            setStartSpneer(false);
            return;
        }

        const data = {
            "materialName": name
        }

        postData(data);

    }

    async function deleteOneData(id) {

        await axiosInstance.get(`/api/v1/delete/one/transporting-material/${id}`)
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

    // deleting
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

    function handleEdit(id, name) {
        setDisplayModal(true);
        setEditData({ id, name });
    }


    return (
        <div className="mx-auto col-8">
            <div
                className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                role="alert">
                <span className="mb-0 h6">Transporting Material</span>
            </div>

            <div className="card mb-4">
                <div className="container">
                    <div className="card-body font-weight-normal textColor">
                        <form className="justify-content-around" id="form1">
                            <div className="row form-group m-1">
                                <div className="row mb-3">
                                    <label htmlFor="colFormLabelSm" className="col-sm-3 text-sm-start col-form-label col-form-label-sm">Material Name</label>
                                    <div className="col-sm-5">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="colFormLabelSm"
                                            placeholder="Enter Material Name..."
                                            onChange={(e) => { setName(e.target.value) }}
                                        />
                                    </div>
                                    <div id="buttons" className="col-sm-4">
                                        <button
                                            type="submit"
                                            form="form1"
                                            className="btn btn-sm btn-primary mr-1"
                                            onClick={(e) => { handleAdd(e) }}
                                        >
                                            {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                            </div>}
                                            Add
                                        </button>
                                        <button
                                            type="submit"
                                            form="form1"
                                            className="btn btn-sm btn-outline-primary ml-1"
                                        // onClick={(e) => { handleSave(e) }}
                                        >
                                            clear
                                        </button>
                                    </div>
                                    <div>
                                        <Toaster
                                            position="bottom-center"
                                            reverseOrder={true}
                                        />
                                    </div>
                                </div>

                            </div>
                        </form>
                        {materialData ? <table className="table table-sm table-striped table-bordered table-hover align-middle">
                            <thead className="thead-dark">
                                <tr className="text-center">
                                    <th scope="col" className='p-1'>
                                        SL No.
                                    </th>
                                    <th scope="col" className='p-1'>
                                        Material
                                    </th>
                                    <th className='p-1' scope="col" colSpan="2">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="font-weight-normal textColor">
                                {materialData.map((item, idx) => (
                                    <tr className="text-center" key={idx}>
                                        <td className='p-1'>{idx + 1}</td>
                                        <td className='p-1'>{item.materialName}</td>
                                        <td className='p-1' data-toggle="modal" data-target="#editModal"><i className="bi bi-pencil-square text-primary custom-cursor-hand" onClick={() => { handleEdit(item.id, item.materialName) }}></i></td>
                                        <td className='p-1'><i className="bi bi-trash text-danger custom-cursor-hand" onClick={() => { handleDelete(item.id) }}></i></td>
                                    </tr>
                                ))}

                            </tbody>
                        </table> : <div className="spinner-border text-primary m-5" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        }
                    </div>
                </div>
            </div>
            {
                displayModal && <EditTransportingMaterialModal eData={editData} closeModal={() => {
                    setDisplayModal(false);
                }} updated={() => { setUpdateData(true) }} />
            }
        </div>
    )

}

export default TransportingMaterials;