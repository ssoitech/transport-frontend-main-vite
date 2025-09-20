import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import axiosInstance from '../../../config/AxiosConfig';
import { useSelector } from 'react-redux';




function AddChallanHolder({ toggleState }) {
    const accessDetails = useSelector((state) => state.access.accessDetails);

    const [startSpneer, setStartSpneer] = useState(false);
    const [postError, setPostError] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Saving the data
    async function postData(fdata) {
        setStartSpneer(true);
        await axiosInstance.post('/api/v1/challan-holder/create',
            fdata
        )
            .then(function (response) {
                // handle success
                console.log(response)
                setStartSpneer(false);
                if (response.data === "duplicate") {
                    Swal.fire({
                        icon: "warning",
                        text: "This Challan Holder Details Already Exists..",
                        confirmButtonText: "OK",
                    });
                    return;
                }
                if (response.data === "success") {
                    setStartSpneer(false);
                    toggleState();
                    Swal.fire({
                        icon: "success",
                        text: "Owner details successfully Saved.",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {

                            return;
                        }
                    });

                } else {
                    setPostError(true);
                    setStartSpneer(false);
                    toast.error("Some Error Occured!");
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    Swal.fire({
                        icon: "warning",
                        text: "Owner already exists.",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            return;
                        }
                    });
                } else {
                    setPostError(true);
                    setStartSpneer(false);
                    toast.error("Something went wrong!");
                }

            });
    }

    const onSubmit = async (data) => {
        if (data.accountNumber != data.accountNumberReType) {
            Swal.fire({
                icon: "warning",
                text: "Banck Account Number not matching..",
                confirmButtonText: "OK",
            });

            return;
        }
        console.log(data);
        const submitData = {
            "challanHolderDetails": {
                "challanHolderName": data.ownerName,
                "contactNumber": data.contact,
                "panNumber": data.panNumber,
                "adharNumber": data.adharNumber,
                "panAdharLinkStatus": data.linked,
                "address": data.address,
                "remark": data.remark,
                "paymentHold": "N",
                "createdBy": accessDetails.userId ? accessDetails.userId : null
            },

            "challanHolderBankDetails": {
                "accountNumber": data.accountNumber,
                "bankName": data.bankName,
                "ifscCode": data.ifscCode,
                "branch": data.branchName,
                "createdBy": accessDetails.userId ? accessDetails.userId : null
            }
        }

        await postData(submitData);
        // console.log(submitData);
    }



    return (
        <div className='container-fluid'>
            <div className='row justify-content-center'>
                <div className='col-12 col-xl-11'>
                    <div className='card shadow-sm border-0'>
                        <div className='card-body p-4'>
                            <form id="form" onSubmit={handleSubmit(onSubmit)}>
                                {/* Personal Information Section */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="ownerName" className="form-label fw-semibold">Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="ownerName"
                                            name='ownerName'
                                            placeholder="Enter full name"
                                            {...register("ownerName", { required: { value: true, message: 'Name is required' } })}
                                        />
                                        {errors.ownerName && <div className='text-danger small mt-1'>{errors.ownerName.message}</div>}
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="contact" className="form-label fw-semibold">Contact</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="contact"
                                            name='contact'
                                            placeholder="Enter contact number"
                                            {...register("contact")}
                                        />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="panNumber" className="form-label fw-semibold">PAN Number</label>
                                        <input
                                            type="text"
                                            className="form-control text-uppercase"
                                            id="panNumber"
                                            name='panNumber'
                                            placeholder="Enter PAN number"
                                            {...register("panNumber", {
                                                pattern: {
                                                    value: /[A-Z]{5}\d{4}[A-Z]/,
                                                    message: "Please Enter Valid PAN Number"
                                                }
                                            })}
                                        />
                                        {errors.panNumber && <div className='text-danger small mt-1'>{errors.panNumber.message}</div>}
                                    </div>
                                </div>

                                {/* Address & Documents Section */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="adharNumber" className="form-label fw-semibold">Aadhar Number</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="adharNumber"
                                            placeholder="Enter Aadhar number"
                                            {...register("adharNumber", {
                                                pattern: {
                                                    value: /^\d{12}$/,
                                                    message: "Please Enter Valid Adhar Number"
                                                }
                                            })}
                                        />
                                        {errors.adharNumber && <div className='text-danger small mt-1'>Please Enter Valid Aadhar Number</div>}
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="linked" className="form-label fw-semibold">Adhar Linked with PAN</label>
                                        <select
                                            className="form-select"
                                            id="linked"
                                            name="linked"
                                            {...register("linked")}
                                        >
                                            <option value="">Select an option</option>
                                            <option value="no">No</option>
                                            <option value="yes">Yes</option>
                                        </select>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="address" className="form-label fw-semibold">Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            placeholder="Enter address"
                                            {...register("address")}
                                        />
                                    </div>
                                </div>

                                {/* Bank Details Section */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="accountNumber" className="form-label fw-semibold">Bank A/C Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="accountNumber"
                                            name="accountNumber"
                                            placeholder="Enter account number"
                                            {...register("accountNumber")}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="accountNumberReType" className="form-label fw-semibold">Re-Enter A/C Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="accountNumberReType"
                                            name="accountNumberReType"
                                            placeholder="Re-enter account number"
                                            {...register("accountNumberReType")}
                                        />
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="bankName" className="form-label fw-semibold">Bank Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bankName"
                                            placeholder="Enter bank name"
                                            {...register("bankName")}
                                        />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="ifscCode" className="form-label fw-semibold">IFSC Code</label>
                                        <input
                                            type="text"
                                            className="form-control text-uppercase"
                                            id="ifscCode"
                                            name="ifscCode"
                                            placeholder="Enter IFSC code"
                                            {...register("ifscCode")}
                                        />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label htmlFor="branchName" className="form-label fw-semibold">Branch Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="branchName"
                                            placeholder="Enter branch name"
                                            {...register("branchName")}
                                        />
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-12 col-md-6">
                                        <label htmlFor="remark" className="form-label fw-semibold">Remark</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="remark"
                                            name="remark"
                                            placeholder="Enter remark (optional)"
                                            {...register("remark")}
                                        />
                                    </div>
                                </div>

                                {/* Buttons Section */}
                                <div className='d-flex justify-content-center gap-3 mt-4 pt-3 border-top'>
                                    <button type="submit" disabled={startSpneer} className="btn btn-primary px-4 py-2">
                                        {startSpneer && <output className="spinner-border text-light spinner-border-sm me-2" aria-live="polite"></output>}
                                        <span>Save</span>
                                    </button>
                                    <button type="button" className="btn btn-outline-primary px-4 py-2" onClick={() => { reset() }}>
                                        Clear
                                    </button>
                                    <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => { reset() }}>
                                        New
                                    </button>
                                </div>
                                {/* Error Messages */}
                                {postError && (
                                    <div className="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        Some Error Occurred! Please try again.
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                )}
                            </form>
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

export default AddChallanHolder;
