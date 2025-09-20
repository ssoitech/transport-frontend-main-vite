import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import axiosInstance from '../../../config/AxiosConfig';
import { useSelector } from 'react-redux';



function AddNewTruckOwner() {
    const accessDetails = useSelector((state) => state.access.accessDetails);

    const [startSpneer, setStartSpneer] = useState(false);
    const [postError, setPostError] = useState(false);


    const { register, handleSubmit, formState: { errors } } = useForm();


    // Saving the data
    async function postData(fdata) {
        setStartSpneer(true);
        await axiosInstance.post('/api/v1/challan-holder/create',
            fdata
        )
            .then(function (response) {
                // handle success
                setStartSpneer(false);
                if (response.data === "success") {
                    setStartSpneer(false);
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

                } else if (response.data === "duplicate") {
                    Swal.fire({
                        icon: "warning",
                        text: "This Truck Owner Details Already Exists..",
                        confirmButtonText: "OK",
                    });
                    return;
                } else {
                    setPostError(true);
                    setStartSpneer(false);
                    toast.error("Some Error Occured!");
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate") {
                    // setIsDuplicate(true);
                    setStartSpneer(false);
                    // toast.error("Owner already exists.");
                    Swal.fire({
                        icon: "warning",
                        text: "Owner already exists.",
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
                    toast.error("Something went wrong!");
                }

            });
    }

    const onSubmit = async (data) => {
        console.log(data);
        const submitData = {
            "challanHolderDetails": {
                "challanHolderName": data.ownerName,
                "contactNumber": data.contact,
                "panNumber": data.panNumber,
                "adharNumber": data.adharNumber,
                "panAdharLinkStatus": data.linked,
                "address": data.address,
                "tdsStatus": data.checkTds === "yes" ? "yes" : "no",
                "tdsSubmissionDate": data.checkTds === "yes" ? data.tdsSubmissionDate : null,
                "docRefNo": data.checkTds === "yes" ? data.docRefNo : null,
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
                            <h5 className="card-title mb-4 text-primary fw-bold">Add New Truck Owner</h5>
                            
                            <form
                                id="form"
                                onSubmit={handleSubmit(onSubmit)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                {/* Personal Information Section */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <h6 className="text-secondary fw-semibold mb-3 border-bottom pb-2">Personal Information</h6>
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="ownerName" className="form-label fw-semibold">Owner Name <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="ownerName"
                                            name='ownerName'
                                            {...register("ownerName", { required: { value: true, message: 'Name is required' } })}
                                        />
                                        {errors.ownerName && <div className="text-danger small mt-1">{errors.ownerName.message}</div>}
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="contact" className="form-label fw-semibold">Contact Number <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="contact"
                                            name='contact'
                                            {...register("contact")}
                                        />
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="panNumber" className="form-label fw-semibold">PAN Number</label>
                                        <input
                                            type="text"
                                            className="form-control text-uppercase"
                                            id="panNumber"
                                            name='panNumber'
                                            style={{ textTransform: 'uppercase' }}
                                            {...register("panNumber", {
                                                pattern: {
                                                    value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                                                    message: "Please Enter Valid PAN Number"
                                                }
                                            })}
                                        />
                                        {errors.panNumber && <div className="text-danger small mt-1">{errors.panNumber.message}</div>}
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="adharNumber" className="form-label fw-semibold">Aadhar Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="adharNumber"
                                            {...register("adharNumber", {
                                                pattern: {
                                                    value: /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
                                                    message: "Please Enter Valid Adhar Number"
                                                }
                                            })}
                                        />
                                        {errors.adharNumber && <div className="text-danger small mt-1">Please Enter Valid Aadhar Number</div>}
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="linked" className="form-label fw-semibold">Adhar Linked with PAN</label>
                                        <select
                                            className="form-select"
                                            id="linked"
                                            name="linked"
                                            {...register("linked")}
                                        >
                                            <option value="no">No</option>
                                            <option value="yes">Yes</option>
                                        </select>
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="address" className="form-label fw-semibold">Address</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            {...register("address")}
                                        />
                                    </div>
                                </div>

                                {/* Bank Information Section */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <h6 className="text-secondary fw-semibold mb-3 border-bottom pb-2">Bank Information</h6>
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="accountNumber" className="form-label fw-semibold">Bank A/C Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="accountNumber"
                                            name="accountNumber"
                                            {...register("accountNumber")}
                                        />
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="bankName" className="form-label fw-semibold">Bank Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bankName"
                                            {...register("bankName")}
                                        />
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="ifscCode" className="form-label fw-semibold">IFSC Code</label>
                                        <input
                                            type="text"
                                            className="form-control text-uppercase"
                                            id="ifscCode"
                                            name="ifscCode"
                                            style={{ textTransform: 'uppercase' }}
                                            {...register("ifscCode")}
                                        />
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="branchName" className="form-label fw-semibold">Branch Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="branchName"
                                            {...register("branchName")}
                                        />
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="remark" className="form-label fw-semibold">Remark</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="remark"
                                            name="remark"
                                            {...register("remark")}
                                        />
                                    </div>
                                </div>

                                {/* TDS Information Section */}
                                <div className="row g-3 mb-4">
                                    <div className="col-12">
                                        <h6 className="text-secondary fw-semibold mb-3 border-bottom pb-2">TDS Information</h6>
                                    </div>
                                    
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="checkTds"
                                                id="checkTds" 
                                                {...register("checkTds")}
                                            />
                                            <label className="form-check-label fw-semibold" htmlFor="checkTds">
                                                TDS Declaration Submitted
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="tdsSubmissionDate" className="form-label fw-semibold">Submission Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="tdsSubmissionDate"
                                            {...register("tdsSubmissionDate")}
                                        />
                                    </div>
                                    
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <label htmlFor="docRefNo" className="form-label fw-semibold">Doc Ref No.</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="docRefNo"
                                            {...register("docRefNo")}
                                            placeholder="Enter document reference number"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="row">
                                    <div className="col-12">
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary me-2"
                                            disabled={startSpneer}
                                        >
                                            {startSpneer && <span className="spinner-border spinner-border-sm me-2" role="status"></span>}
                                            Save
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-secondary me-2"
                                        >
                                            Clear
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-info"
                                        >
                                            New
                                        </button>
                                    </div>
                                </div>

                                {/* Status Messages */}
                                {postError && (
                                    <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        Some Error Occurred!
                                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                )}
                            </form>
                            
                            <Toaster
                                position="bottom-center"
                                reverseOrder={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddNewTruckOwner
