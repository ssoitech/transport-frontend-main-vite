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

    }, [accessDetails, navigate]);


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


    }, [ownerData, setValue]);

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
            .catch(() => {
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
                {/*   <!-- TDS Form Section --> */}
                <div className="col-12">
                    <div className="card mb-4">
                        {/*  <!-- Card Body --> */}
                        <div className="card-body">
                            {/* Search Section */}
                            <div className="container-fluid">
                                <div className="row g-3 align-items-end">
                                    {/* Owner Name Search */}
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="ownerName" className="form-label fw-bold">
                                            Owner Name
                                        </label>
                                        <AutoComplete
                                            placeholder={"Search here"}
                                            url={'/api/v1/challan-holder/get/all/names-ids?keyword='}
                                            datakey={"name"}
                                            customLoading={<>Loading..</>}
                                            onSelect={(res) => setSearchedOwnerData(res)}
                                            onChange={() => { }}
                                            onBlur={() => { }}
                                            onFocus={() => { }}
                                            customStyles={{}}
                                        />
                                    </div>

                                    {/* PAN Number Search */}
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="panNumber" className="form-label fw-bold">
                                            PAN Number
                                        </label>
                                        <div className="d-flex gap-2">
                                            <AutoComplete
                                                placeholder={"Search here"}
                                                url={'/api/v1/challan-holder/get/all/pan-no-ids?keyword='}
                                                datakey={"name"}
                                                customLoading={<>Loading..</>}
                                                onSelect={(res) => setSearchedOwnerData(res)}
                                                onChange={() => { }}
                                                onBlur={() => { }}
                                                onFocus={() => { }}
                                                customStyles={{}}
                                            />
                                            <button 
                                                type="button" 
                                                className="btn btn-success px-4" 
                                                disabled={searchByNameLoader} 
                                                onClick={handleFindByName}
                                            >
                                                {searchByNameLoader ? (
                                                    <>
                                                        <output className="spinner-border spinner-border-sm me-2" aria-live="polite"></output>
                                                        Loading
                                                    </>
                                                ) : (
                                                    'Find'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-4" />
                            </div>

                        </div>

                        {/* Form Section */}
                        <div className='card-body pt-0'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="row">
                                    {/* Left Column - TDS Declaration Form */}
                                    <div className="col-12 col-lg-6">
                                        <div className="mb-4">
                                            <div className="form-label fw-bold">TDS Declaration Submitted</div>
                                            <div className="d-flex gap-3 mt-2">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="tdsStatus"
                                                        value="yes"
                                                        id="tdsYes"
                                                        {...register("tdsStatus")}
                                                    />
                                                    <label className="form-check-label fw-bold text-white bg-primary px-3 py-1 rounded" htmlFor="tdsYes">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        name="tdsStatus"
                                                        value="no"
                                                        id="tdsNo"
                                                        {...register("tdsStatus")}
                                                    />
                                                    <label className="form-check-label fw-bold text-white bg-primary px-3 py-1 rounded" htmlFor="tdsNo">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-12 col-md-6">
                                                <div className="form-label fw-bold text-white bg-primary px-3 py-1 rounded d-inline-block">
                                                    Submission Date
                                                </div>
                                                <input
                                                    type="date"
                                                    className="form-control mt-2"
                                                    placeholder="dd-mm-yyyy"
                                                    {...register("submissionDate")}
                                                    disabled={tdsStatus === "no"}
                                                />
                                            </div>
                                            <div className="col-12 col-md-6">
                                                <div className="form-label fw-bold text-white bg-primary px-3 py-1 rounded d-inline-block">
                                                    Doc Ref No.
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control mt-2"
                                                    placeholder="Enter Doc Ref No"
                                                    {...register("docRefNo")}
                                                    disabled={tdsStatus === "no"}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column - Owner Details */}
                                    <div className="col-12 col-lg-6">
                                        <div className="row g-2">
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text fw-bold">Name</span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        readOnly
                                                        {...register("name")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text fw-bold">Contact</span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        readOnly
                                                        {...register("contact")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="input-group">
                                                    <span className="input-group-text fw-bold">PAN</span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        readOnly
                                                        {...register("pan")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons Section */}
                                <div className="d-flex justify-content-center gap-3 mt-4">
                                    <button type="submit" className="btn btn-primary px-4">
                                        {startSpinner && <output className="spinner-border text-light spinner-border-sm me-2" aria-live="polite"></output>}
                                        <span>Save</span>
                                    </button>
                                    <button type="reset" className="btn btn-outline-primary px-4">
                                        Clear
                                    </button>
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
