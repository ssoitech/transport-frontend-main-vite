import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AutoComplete from '../searchComponent/AutoComplete';
import axiosInstance from '../../config/AxiosConfig';
import { useForm } from "react-hook-form";

function TdsDeclarationData() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [searchedOwnerData, setSearchedOwnerData] = useState();
    const [ownerData, setOwnerData] = useState();
    const [searchByNameLoader, setSearchByNameLoader] = useState(false);


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

    const [tdsValue, setTdsValue] = useState("yes");

    const [loading, setLoading] = useState(false);
    const [startSpinner, setStartSpinner] = useState(false);

    const { register, handleSubmit, setValue, watch } = useForm();

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


    const handleFindByName = async () => {

        try {
            if (!searchedOwnerData) {
                return;
            } else {

                if (!searchedOwnerData.id) {
                    return;
                }

                setSearchByNameLoader(true);

                const ownerId = searchedOwnerData.id ? searchedOwnerData.id : null;
                await axiosInstance.get(`/api/v1/challan-holder/get-one/${ownerId}`)
                    .then(function (response) {
                        // handle success
                        setSearchByNameLoader(false);
                        console.log(response.data);
                        setOwnerData(response.data);
                        // setTruckList(response.data.truckList);
                        // setUpdateData(false);
                    })
                    .catch(function (error) {
                        // handle error
                        setSearchByNameLoader(false);
                        console.log(error);
                    });
            }


        } catch (e) {
            setSearchByNameLoader(false);
            console.log(e);
        }

    }

    // Watch radio button value
    const tdsStatus = watch("tdsStatus");

    // API Call to Fetch Data
    useEffect(() => {

        if (!ownerData) return;

        setValue("tdsStatus", ownerData.tdsStatus === "yes" ? "yes" : "no");
        setValue("submissionDate", ownerData.tdsSubmissionDate || "");
        setValue("docRefNo", ownerData.docRefNo || "");
        setValue("name", ownerData.challanHolderName || "");
        setValue("contact", ownerData.contactNumber || "");
        setValue("pan", ownerData.panNumber || "");


    }, [ownerData]);

    // Handle Form Submission
    const onSubmit = (formData) => {
        if (!ownerData.id) return;
        setStartSpinner(true);
        console.log("Submitted Data:", formData);

        const fData = {
            "id": ownerData.id || null,
            "tdsStatus": formData.tdsStatus || null,
            "tdsSubmissionDate": formData.submissionDate || null,
            "docRefNo": formData.docRefNo || null

        }

        axiosInstance.put("/api/v1/challan-holder/update-tds", fData)
            .then(response => {
                console.log("Success:", response.data);
                setStartSpinner(false);
                Swal.fire({
                    icon: "success",
                    text: "TDS Declaration Successfully Updated for " + response.data.challanHolderName,
                    confirmButtonText: "OK",
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: "error",
                    text: "Some Error Occures!",
                    confirmButtonText: "OK",
                });
            })
            .finally(() => setStartSpinner(false));
    };


    return (
        <div className='work-space-container'>
            <div
                className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                role="alert">
                {/* name of the table */}
                <span className="mb-0 h6">TDS Declaration Data</span>
            </div>

            <div className='row'>
                {/*   <!-- Area Chart --> */}
                <div className="mx-auto">
                    <div className="card mb-4">
                        {/*  <!-- Card Body --> */}
                        <div className="card-body">

                            <div className="container">
                                <div className="row">
                                    {/* First Label, Input, and Search Button */}
                                    <div className="col-12 col-md-4 mb-2">
                                        <label htmlFor="ownerName" className="form-label">
                                            Owner Name
                                        </label>
                                        <div className="d-flex">
                                            <AutoComplete
                                                placeholder={"Search here"}
                                                url={'/api/v1/challan-holder/get/all/names-ids?keyword='}
                                                datakey={"name"}
                                                customLoading={<>Loading..</>}
                                                onSelect={(res) => setSearchedOwnerData(res)}
                                                onChange={(input) => { }}
                                                onBlur={(e) => { }}
                                                onFocus={(e) => { }}
                                                customStyles={{}}
                                            />

                                        </div>
                                    </div>

                                    {/* Second Label, Input, and Search Button */}
                                    <div className="col-12 col-md-6 mb-2">
                                        <label htmlFor="panNumber" className="form-label">
                                            PAN Number
                                        </label>
                                        <div className="d-flex">
                                            <AutoComplete
                                                placeholder={"Search here"}
                                                url={'/api/v1/challan-holder/get/all/pan-no-ids?keyword='}
                                                datakey={"name"}
                                                customLoading={<>Loading..</>}
                                                onSelect={(res) => setSearchedOwnerData(res)}
                                                onChange={(input) => { }}
                                                onBlur={(e) => { }}
                                                onFocus={(e) => { }}
                                                customStyles={{}}
                                            />
                                            <button type="button" className="btn btn-sm btn-success ml-4" disabled={searchByNameLoader} onClick={handleFindByName}>
                                                {searchByNameLoader ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                        Loading ...
                                                    </>
                                                ) : (
                                                    'Find'
                                                )}
                                            </button>
                                            {/* <button className="btn btn-sm btn-primary ml-2" type="button" onClick={handleFindByName}>
                                                Find
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr />

                        </div>

                        {/* second card */}

                        <div className='card-body'>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group">
                                                <p>TDS Declaration Submitted</p>
                                                <div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="tdsStatus"
                                                            value="yes"
                                                            {...register("tdsStatus")}
                                                        />
                                                        <label className="form-check-label">Yes</label>
                                                    </div>
                                                    <div className="form-check form-check-inline">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="tdsStatus"
                                                            value="no"
                                                            {...register("tdsStatus")}
                                                        />
                                                        <label className="form-check-label">No</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="form-group col-md-6">
                                                    <label>Submission Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        {...register("submissionDate")}
                                                        disabled={tdsStatus === "no"} // Disable if "No" is selected
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label>Doc Ref No.</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Enter Doc Ref No"
                                                        {...register("docRefNo")}
                                                        disabled={tdsStatus === "no"}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col">
                                            <div className="input-group input-group-sm m-1">
                                                <span className="input-group-text">Name</span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    {...register("name")}
                                                />
                                            </div>

                                            <div className="input-group input-group-sm m-1">
                                                <span className="input-group-text">Contact</span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    {...register("contact")}
                                                />
                                            </div>

                                            <div className="input-group input-group-sm m-1">
                                                <span className="input-group-text">PAN</span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    {...register("pan")}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary m-2">
                                            {startSpinner && <div className="spinner-border text-light spinner-border-sm pr-1" role="status"></div>}
                                            <span>Save</span>
                                        </button>
                                        <button type="reset" className="btn btn-outline-primary">
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>

                    </div>

                </div>
            </div >
        </div>
    )
}

export default TdsDeclarationData;
