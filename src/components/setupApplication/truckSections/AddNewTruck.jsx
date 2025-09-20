import React, { useEffect, useState, useCallback } from 'react';
import Swal from "sweetalert2";
import { useForm } from 'react-hook-form';
import AutoComplete from '../../searchComponent/AutoComplete';
import axiosInstance from '../../../config/AxiosConfig';

function AddNewTruck() {
    const [searchedOwnerData, setSearchedOwnerData] = useState();
    const [ownerData, setOwnerData] = useState();
    const [truckList, setTruckList] = useState([]);
    const [isTruckDataSaved, setIsTruckDataSaved] = useState(false);
    const [ownerDataId, setOwnerDataId] = useState();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            type: "", // Ensure default is empty so validation triggers
            rcStatus: "",    // Ensure default is empty so validation triggers
        }
    });

    const {
        register: registerOwnerData,
        setValue: setOwnerDataValue,
        reset: resetOwnerData
    } = useForm();

    const getData = useCallback(async () => {
        try {
            if (!ownerDataId) {
                return;
            }
            await axiosInstance.get(`/api/v1/get/all/truck-details-by-id/${ownerDataId}`)
                .then(function (response) {
                    // handle success
                    setTruckList(response.data);
                    setIsTruckDataSaved(false);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        } catch {
            // Handle error silently
        }
    }, [ownerDataId]);

    useEffect(() => {
        if (searchedOwnerData) {
            setOwnerDataId(searchedOwnerData.id);
        }
    }, [searchedOwnerData])

    useEffect(() => {
        if (isTruckDataSaved) {
            getData();
        }
        setIsTruckDataSaved(false);
    }, [isTruckDataSaved, getData])

    useEffect(() => {
        if (!ownerData) return;

        setOwnerDataValue("name", ownerData.challanHolderName);
        setOwnerDataValue("contactNumber", ownerData.contactNumber);
        setOwnerDataValue("panNumber", ownerData.panNumber);
        setOwnerDataValue("tdsPercent", ownerData.tdsPer);
        setOwnerDataValue("address", ownerData.address);
        setOwnerDataValue("remark", ownerData.remark);
        setOwnerDataValue("bankAccountNumber", ownerData.accountNumber);
        setOwnerDataValue("bankName", ownerData.bankName);
        setOwnerDataValue("ifsCode", ownerData.ifscCode)
        setOwnerDataValue("branchName", ownerData.branch);


    }, [ownerData, setOwnerDataValue])



    const handleFindByName = async () => {

        try {
            if (!searchedOwnerData) {
                return;
            } else {

                if (!searchedOwnerData.id) {
                    return;
                }

                const ownerId = searchedOwnerData.id
                await axiosInstance.get(`/api/v1/challan-holder/get/one/details-by-id/${ownerId}`)
                    .then(function (response) {
                        // handle success
                        console.log(response.data);
                        setOwnerData(response.data.ownerData[0]);
                        setTruckList(response.data.truckList);
                        // setUpdateData(false);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
            }


        } catch {
            // Handle error silently
        }

    }

    const onSubmit = async (data) => {
        // Add hardcoded values to the form data
        if (!searchedOwnerData) {
            Swal.fire({
                title: "Please Select Owner",
                icon: "warning",
            });
            return;
        }
        if (!searchedOwnerData.id) {
            return
        }
        const formData = {
            ...data,
            "ownerId": searchedOwnerData.id,
        };

        try {
            const response = await axiosInstance.post("/api/v1/add/one/truck-details", formData);
            if (response.status === 201 && response.data === "success") {
                setIsTruckDataSaved(true);
                Swal.fire({
                    title: "Truck Details Added Successfully.",
                    icon: "success",
                });

            } else {
                // console.error("Error:", response.statusText);
                // alert("Failed to submit data.");
                Swal.fire({
                    title: "Internal Server Error!!",
                    icon: "error",
                });
            }
        } catch {
            Swal.fire({
                text: "An error occurred while submitting data.",
                icon: "error",
            });
        }
    };

    const handleClear = () => {
        resetOwnerData();
    }



    return (
        <div className='container-fluid'>
            <div className='row justify-content-center'>
                <div className='col-12 col-xl-11'>
                    <div className='card shadow-sm border-0'>
                        <div className='card-body p-4'>
                            {/* Search Section */}
                            <div className="mb-4">
                                <h5 className="card-title mb-3 text-primary fw-bold">Search Owner Details</h5>
                                <div className="row g-3">
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="ownerName" className="form-label fw-semibold">
                                            Owner Name
                                        </label>
                                        <div className="d-flex gap-2">
                                            <AutoComplete
                                                placeholder={"Enter owner name"}
                                                url={'/api/v1/challan-holder/get/all/names-ids?keyword='}
                                                datakey={"name"}
                                                customLoading={<span className="text-muted">Loading...</span>}
                                                onSelect={(res) => setSearchedOwnerData(res)}
                                                onChange={() => { }}
                                                onBlur={() => { }}
                                                onFocus={() => { }}
                                                customStyles={{}}
                                            />
                                            <button className="btn btn-primary px-3" type="button" onClick={handleFindByName}>
                                                Find
                                            </button>
                                            <button className="btn btn-outline-primary px-3" type="button" onClick={handleClear}>
                                                New
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <label htmlFor="panNumber" className="form-label fw-semibold">
                                            PAN Number
                                        </label>
                                        <div className="d-flex gap-2">
                                            <AutoComplete
                                                placeholder={"Enter PAN number"}
                                                url={'/api/v1/challan-holder/get/all/pan-no-ids?keyword='}
                                                datakey={"name"}
                                                customLoading={<span className="text-muted">Loading...</span>}
                                                onSelect={(res) => setSearchedOwnerData(res)}
                                                onChange={() => { }}
                                                onBlur={() => { }}
                                                onFocus={() => { }}
                                                customStyles={{}}
                                            />
                                            <button className="btn btn-primary px-3" type="button" onClick={handleFindByName}>
                                                Find
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-4" />


                            {/* Owner Details Section */}
                            <div className="mb-4">
                                <h5 className="card-title mb-3 text-primary fw-bold">Owner Information</h5>
                                <form>
                                    {/* Personal Information */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="name" className="form-label fw-semibold">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name='name'
                                                id="name"
                                                placeholder="Owner name"
                                                readOnly
                                                {...registerOwnerData("name")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="contactNumber" className="form-label fw-semibold">Contact Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="contactNumber"
                                                name='contactNumber'
                                                placeholder="Contact number"
                                                readOnly
                                                {...registerOwnerData("contactNumber")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="panNumber" className="form-label fw-semibold">PAN Number</label>
                                            <input
                                                type="text"
                                                className="form-control text-uppercase"
                                                id="panNumber"
                                                name='panNumber'
                                                placeholder="PAN number"
                                                readOnly
                                                {...registerOwnerData("panNumber")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="tdsPercent" className="form-label fw-semibold">TDS Percent</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="tdsPercent"
                                                name='tdsPercent'
                                                placeholder="TDS %"
                                                readOnly
                                                {...registerOwnerData("tdsPercent")}
                                            />
                                        </div>
                                    </div>

                                    {/* Address & Bank Details */}
                                    <div className="row g-3 mb-4">
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="address" className="form-label fw-semibold">Address</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="address"
                                                name='address'
                                                placeholder="Address"
                                                readOnly
                                                {...registerOwnerData("address")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="remark" className="form-label fw-semibold">Remark</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="remark"
                                                name='remark'
                                                placeholder="Remark"
                                                readOnly
                                                {...registerOwnerData("remark")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="bankAccountNumber" className="form-label fw-semibold">Bank Account Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="bankAccountNumber"
                                                name='bankAccountNumber'
                                                placeholder="Account number"
                                                readOnly
                                                {...registerOwnerData("bankAccountNumber")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="bankName" className="form-label fw-semibold">Bank Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="bankName"
                                                name='bankName'
                                                placeholder="Bank name"
                                                readOnly
                                                {...registerOwnerData("bankName")}
                                            />
                                        </div>
                                    </div>

                                    <div className="row g-3 mb-4">
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="ifsCode" className="form-label fw-semibold">IFSC Code</label>
                                            <input
                                                type="text"
                                                className="form-control text-uppercase"
                                                id="ifsCode"
                                                name='ifsCode'
                                                placeholder="IFSC code"
                                                readOnly
                                                {...registerOwnerData("ifsCode")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <label htmlFor="branchName" className="form-label fw-semibold">Branch Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="branchName"
                                                name="branchName"
                                                placeholder="Branch name"
                                                readOnly
                                                {...registerOwnerData("branchName")}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <hr className="my-4" />
                            {/* Add Truck Details Section */}
                            <div className="mb-4">
                                <h5 className="card-title mb-3 text-primary fw-bold">Add Truck Details</h5>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="row g-3 mb-4">
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="truckNumber" className="form-label fw-semibold">Truck Number <span className="text-danger">*</span></label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.truckNumber ? 'is-invalid' : ''}`}
                                                id="truckNumber"
                                                placeholder="Enter truck number"
                                                {...register("truckNumber", { required: "Truck Number is required" })}
                                            />
                                            {errors.truckNumber && <div className="invalid-feedback">{errors.truckNumber.message}</div>}
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="type" className="form-label fw-semibold">Type of Vehicle <span className="text-danger">*</span></label>
                                            <select
                                                className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                                                id="type"
                                                name='type'
                                                {...register("type", { required: "Please select a type of vehicle" })}
                                            >
                                                <option value="">Select Vehicle Type</option>
                                                <option value="6">6 Wheel</option>
                                                <option value="8">8 Wheel</option>
                                                <option value="10">10 Wheel</option>
                                                <option value="12">12 Wheel</option>
                                                <option value="14">14 Wheel</option>
                                                <option value="16">16 Wheel</option>
                                                <option value="18">18 Wheel</option>
                                                <option value="22">22 Wheel</option>
                                            </select>
                                            {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="tokenNo" className="form-label fw-semibold">Token Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="tokenNo"
                                                name='tokenNo'
                                                placeholder="Enter token number"
                                                {...register("tokenNo")}
                                            />
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <label htmlFor="rcStatus" className="form-label fw-semibold">RC Status <span className="text-danger">*</span></label>
                                            <select
                                                className={`form-select ${errors.rcStatus ? 'is-invalid' : ''}`}
                                                id="rcStatus"
                                                name='rcStatus'
                                                {...register("rcStatus", { required: "Please select RC status" })}
                                            >
                                                <option value="">Select RC Status</option>
                                                <option value="N">Not Submitted</option>
                                                <option value="Y">Submitted</option>
                                            </select>
                                            {errors.rcStatus && <div className="invalid-feedback">{errors.rcStatus.message}</div>}
                                        </div>
                                    </div>

                                    {/* Buttons Section */}
                                    <div className="d-flex justify-content-center gap-3 mb-4">
                                        <button type="submit" className="btn btn-primary px-4 py-2">Add</button>
                                        <button type="button" className="btn btn-outline-secondary px-4 py-2">Clear</button>
                                    </div>
                                </form>
                            </div>

                            {/* Truck List Table Section */}
                            <div className="overflow-auto">
                                <h5 className="card-title mb-3 text-primary fw-bold">All Truck Details</h5>
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered table-hover">
                                        <thead className="table-dark">
                                            <tr className='text-center'>
                                                <th className='p-2' scope="col">SL. Number</th>
                                                <th className='p-2' scope="col">Truck Number</th>
                                                <th className='p-2' scope="col">Type of Vehicle</th>
                                                <th className='p-2' scope="col">Token Number</th>
                                                <th className='p-2' scope="col">RC Status</th>
                                                <th className='p-2' scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {truckList && truckList.length > 0 ? (
                                                truckList.map((record, index) => (
                                                    <tr key={index}>
                                                        <td className='p-2 text-center'>{index + 1}</td>
                                                        <td className='p-2'>{record.truckNumber}</td>
                                                        <td className='p-2 text-center'>{`${record.type} Wheel`}</td>
                                                        <td className='p-2 text-center'>{record.tokenNo}</td>
                                                        <td className='p-2 text-center'>
                                                            <span className={`badge ${record.rcStatus === 'Y' ? 'bg-success' : 'bg-warning'}`}>
                                                                {record.rcStatus === 'Y' ? "Submitted" : "Not Submitted"}
                                                            </span>
                                                        </td>
                                                        <td className='p-2 text-center'>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <button 
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    title="Edit"
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-target="#editModal"
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </button>
                                                                <button 
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    title="Delete"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center py-4 text-muted">
                                                        No trucks found. Add a truck to get started.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNewTruck;
