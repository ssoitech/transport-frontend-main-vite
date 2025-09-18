import React, { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../../config/AxiosConfig';

function Destinations() {
    const [loadingPointData, setLoadingPointData] = useState();
    const [unloadingPointData, setUnloadingPointData] = useState();

    const [loadingPointName, setLoadingPointName] = useState("");
    const [loadingPointNameIsEmpty, setLoadingPointNameIsEmpty] = useState(false);
    const [loadingPointNameIsSaved, setLoadingPointNameIsSaved] = useState(false);
    const [loadingPointNameUpdated, setLoadingPointNameUpdated] = useState(false);
    const [startLoadingPointSpinner, setStartLoadingPointSpinner] = useState(false);
    const [lerror, setLerror] = useState(false);

    const [unloadingPointName, setUnloadingPointName] = useState("");
    const [unloadingPointNameIsEmpty, setUnloadingPointNameIsEmpty] = useState(false);
    const [unloadingPointNameIsSaved, setUnloadingPointNameIsSaved] = useState(false);
    const [unloadingPointNameUpdated, setUnloadingPointNameUpdated] = useState(false);
    const [startUnloadingPointSpinner, setStartUnloadingPointSpinner] = useState(false);
    const [uerror, setUerror] = useState(false);



    async function getLoadingPointData() {
        await axiosInstance.get('/api/v1/get/all/loading-points')
            .then(function (response) {
                // handle success
                setLoadingPointData(response.data);
                setLoadingPointNameUpdated(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getUnloadingPointData() {
        await axiosInstance.get('/api/v1/get/all/unloading-points')
            .then(function (response) {
                // handle success
                setUnloadingPointData(response.data);
                setUnloadingPointNameUpdated(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        console.log("inside 2nd use effect")
        getLoadingPointData();
        getUnloadingPointData();

    }, []);

    useEffect(() => {
        console.log("inside 2nd use effect")
        if (loadingPointNameUpdated) {
            getLoadingPointData();
            setLoadingPointNameUpdated(false);
        }
        if (unloadingPointNameUpdated) {
            getUnloadingPointData();
            setUnloadingPointNameUpdated(false);
        }


    }, [loadingPointNameUpdated, unloadingPointNameUpdated]);

    useEffect(() => {
        console.log("inside 3rd use effect")
        let timer;
        if (loadingPointNameIsEmpty) {
            timer = setTimeout(() => {
                setLoadingPointNameIsEmpty(false);
            }, 3000);
        }
        if (unloadingPointNameIsEmpty) {
            timer = setTimeout(() => {
                setUnloadingPointNameIsEmpty(false);
            }, 3000);
        }
        if (lerror) {
            timer = setTimeout(() => {
                setLerror(false);
            }, 3000);
        }
        if (uerror) {
            timer = setTimeout(() => {
                setUerror(false);
            }, 3000);
        }

        if (loadingPointNameIsSaved) {
            timer = setTimeout(() => {
                setLoadingPointName("");
                document.getElementById("form1").reset();
                setLoadingPointNameIsSaved(false);
            }, 3000);
        }
        if (unloadingPointNameIsSaved) {
            timer = setTimeout(() => {
                setUnloadingPointName("");
                document.getElementById("form2").reset();
                setUnloadingPointNameIsSaved(false);
            }, 3000);
        }

        return () => {
            clearTimeout(timer);
        };

    }, [loadingPointNameIsEmpty, unloadingPointNameIsEmpty, lerror, uerror, loadingPointNameIsSaved, unloadingPointNameIsSaved]);

    async function postLoadingPointData(fdata) {
        await axiosInstance.post('/api/v1/add/one/loading-point',
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
                    setLoadingPointName("");
                    setLoadingPointNameIsSaved(true);
                    setLoadingPointNameUpdated(true);
                    setStartLoadingPointSpinner(false);

                } else {
                    setLerror(true);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    // setIsDuplicate(true);
                    setStartLoadingPointSpinner(false);
                } else {
                    setStartLoadingPointSpinner(false);
                }

            });
    }

    async function postUnloadingPointData(fdata) {
        await axiosInstance.post('/api/v1/add/one/unloading-point',
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
                    setLoadingPointName("");
                    setUnloadingPointNameIsSaved(true);
                    setUnloadingPointNameUpdated(true);
                    setStartUnloadingPointSpinner(false);

                } else {
                    setUerror(true);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    // setIsDuplicate(true);
                    setStartUnloadingPointSpinner(false);
                } else {
                    setStartUnloadingPointSpinner(false);
                }

            });
    }

    // deleting one loading point data
    async function deleteOneLoadingPointData(isConfirmed, id) {
        if (isConfirmed) {
            await axiosInstance.get(`/api/v1/delete/one/loading-point/${id}`)
                .then(function (response) {
                    // handle success
                    if (response.data === "success") {
                        toast.remove();
                        setLoadingPointNameUpdated(true);
                        toast.success('Successfully Deleted!', {
                            position: "bottom-center",
                            style: {
                                background: "green",
                                color: "#fff",
                            }
                        });
                    }
                })
                .catch(function (error) {
                    // handle error
                    toast.remove();
                    toast.error('Not able to delete. Some error occured !!', {
                        style: {
                            background: "red",
                            color: "#fff",
                        }
                    });
                    console.log(error);
                });
        }

    }

    // deleting one unloading point data
    async function deleteOneUnloadingPointData(isConfirmed, id) {
        if (isConfirmed) {
            await axiosInstance.get(`/api/v1/delete/one/unloading-point/${id}`)
                .then(function (response) {
                    // handle success
                    if (response.data === "success") {
                        toast.remove();
                        setUnloadingPointNameUpdated(true);
                        toast.success('Successfully Deleted!', {
                            position: "bottom-center",
                            style: {
                                background: "green",
                                color: "#fff",
                            }
                        });
                    }
                })
                .catch(function (error) {
                    // handle error
                    toast.remove();
                    toast.error('Not able to delete. Some error occured !!', {
                        style: {
                            background: "red",
                            color: "#fff",
                        }
                    });
                    console.log(error);
                });
        }

    }


    function handleLoadingPointDataAdd(e) {
        e.preventDefault();
        setStartLoadingPointSpinner(true);

        if (!loadingPointName) {
            setLoadingPointNameIsEmpty(true);
            setStartLoadingPointSpinner(false);
            return;
        }

        const data = {
            "loadingPointName": loadingPointName
        }

        postLoadingPointData(data);

    }

    function handleUnloadingPointDataAdd(e) {
        setStartUnloadingPointSpinner(true);
        e.preventDefault();
        if (!unloadingPointName) {
            setUnloadingPointNameIsEmpty(true);
            setStartUnloadingPointSpinner(false);
            return;
        }

        const data = {
            "unLoadingPointName": unloadingPointName
        }

        postUnloadingPointData(data);

    }

    function handleLoadingPointDataEdit(id, loadingPointName) {

    }

    function handleLoadingPointDataDelete(id) {
        const isConfirmed = window.confirm("Are you sure to delete ?");
        deleteOneLoadingPointData(isConfirmed, id);
        toast.loading("deleting..");
    }

    function handleUnloadingPointDataDelete(id) {
        const isConfirmed = window.confirm("Are you sure to delete ?");
        deleteOneUnloadingPointData(isConfirmed, id);
        toast.loading("deleting..");
    }

    return (
        <div>
            <div className="container row">
                <div className="mx-auto col-sm-6">
                    <div
                        className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                        role="alert"
                    >
                        {/* name of the table */}
                        <span className="mb-0 h6">Loading Points</span>
                    </div>

                    <div className="mb-4">
                        <div className="container">
                            <div className="card-body font-weight-normal textColor">
                                <div className="justify-content-around">
                                    <form action="" id='form1'>
                                        <div className="form-group m-1 row">
                                            <div className="row mb-3">
                                                <label htmlFor="colFormLabelSm" className="col-sm-2 text-sm-start col-form-label col-form-label-sm">Name</label>
                                                <div className="col-sm-10">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        id="colFormLabelSm"
                                                        form='form1'
                                                        placeholder="Enter Loading Point..."
                                                        value={loadingPointName}
                                                        onChange={(e) => { setLoadingPointName(e.target.value) }}
                                                    />
                                                </div>
                                                <div className='container'>
                                                    {loadingPointNameIsEmpty && <p className='text-danger pt-1'>Name should not be empty!!</p>}
                                                </div>
                                                <div id="buttons" className="m-3 text-center">
                                                    <button
                                                        className="btn btn-sm btn-primary mr-1"
                                                        onClick={(e) => { handleLoadingPointDataAdd(e) }}
                                                    >
                                                        {startLoadingPointSpinner && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                                        </div>}
                                                        <span>Add</span>
                                                    </button>
                                                    <button
                                                        type="reset"
                                                        form="form1"
                                                        className="btn btn-sm btn-outline-primary ml-1"
                                                        onClick={() => { setLoadingPointName("") }}
                                                    >
                                                        clear
                                                    </button>
                                                </div>
                                                <div>

                                                </div>
                                            </div>

                                        </div>
                                    </form>
                                </div>
                                {loadingPointData ? <table className="table table-sm table-striped table-bordered table-hover align-middle">
                                    <thead className="thead-dark">
                                        <tr className="text-center">
                                            <th scope="col" className='p-1'>
                                                SL No.
                                            </th>
                                            <th scope="col" className='p-1'>
                                                Loading Points
                                            </th>
                                            <th className='p-1' scope="col" colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-weight-normal textColor">
                                        {loadingPointData.map((item, idx) => (
                                            <tr className="text-center" key={idx}>
                                                <td className='p-1'>{idx + 1}</td>
                                                <td className='p-1'>{item.loadingPointName}</td>
                                                <td className='p-1' data-toggle="modal" data-target="#editModal"><i className="bi bi-pencil-square text-primary custom-cursor-hand" onClick={() => { handleLoadingPointDataEdit(item.id, item.materialName) }}></i></td>
                                                <td className='p-1'><i className="bi bi-trash text-danger custom-cursor-hand" onClick={() => { handleLoadingPointDataDelete(item.id) }}></i></td>
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
                </div>


                <div className="mx-auto col-sm-6">
                    <div
                        className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                        role="alert"
                    >
                        {/* name of the table */}
                        <span className="mb-0 h6">Unloading Points</span>
                    </div>

                    <div className="mb-4">
                        <div className="container">
                            <div className="card-body font-weight-normal textColor">
                                <form className="justify-content-around" id="form2">
                                    <div className="form-group m-1 row">
                                        <div className="row mb-3">
                                            <label htmlFor="colFormLabelSm" className="col-sm-2 text-sm-start col-form-label col-form-label-sm">Name</label>
                                            <div className="col-sm-10">
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="colFormLabelSm"
                                                    placeholder="Enter Unloading Point..."
                                                    onChange={(e) => { setUnloadingPointName(e.target.value) }}
                                                />
                                            </div>
                                            <div id="buttons" className="m-3 text-center">
                                                <button
                                                    className="btn btn-sm btn-primary mr-1"
                                                    onClick={(e) => { handleUnloadingPointDataAdd(e) }}
                                                >
                                                    {startUnloadingPointSpinner && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                                    </div>}
                                                    Add
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-primary ml-1"
                                                    onClick={() => { setUnloadingPointName("") }}
                                                >
                                                    clear
                                                </button>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                    </div>
                                </form>

                                {unloadingPointData ? <table className="table table-sm table-striped table-bordered table-hover align-middle">
                                    <thead className="thead-dark">
                                        <tr className="text-center">
                                            <th scope="col" className='p-1'>
                                                SL No.
                                            </th>
                                            <th scope="col" className='p-1'>
                                                Unloading Points
                                            </th>
                                            <th className='p-1' scope="col" colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-weight-normal textColor">
                                        {unloadingPointData.map((item, idx) => (
                                            <tr className="text-center" key={idx}>
                                                <td className='p-1'>{idx + 1}</td>
                                                <td className='p-1'>{item.unLoadingPointName}</td>
                                                <td className='p-1' data-toggle="modal" data-target="#editModal"><i className="bi bi-pencil-square text-primary custom-cursor-hand" onClick={() => { handleLoadingPointDataEdit(item.id, item.materialName) }}></i></td>
                                                <td className='p-1'><i className="bi bi-trash text-danger custom-cursor-hand" onClick={() => { handleUnloadingPointDataDelete(item.id) }}></i></td>
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
                </div>
            </div>
            <Toaster
                position="bottom-center"
                reverseOrder={true}
            />
        </div>
    )
}

export default Destinations;
