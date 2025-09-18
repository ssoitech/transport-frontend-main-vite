import React, { useEffect, useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import axiosInstance from '../../../config/AxiosConfig';
import { useSelector } from 'react-redux';



function AddNewTruckOwner() {
    const accessDetails = useSelector((state) => state.access.accessDetails);

    const [isSaved, setIsSaved] = useState(false);
    const [startSpneer, setStartSpneer] = useState(false);
    const [postError, setPostError] = useState(false);


    const { control, getValues, setValue, watch, register, handleSubmit, reset, formState: { errors } } = useForm();


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
                    setIsSaved(true);
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
        <div className='card overflow-auto'>
            <div className='card-body'>
                <form
                    id="form"
                    onSubmit={handleSubmit(onSubmit)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                        }
                    }}
                >
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="ownerName">Name</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="ownerName"
                                name='ownerName'
                                {...register("ownerName", { required: { value: true, message: 'Name is required' } })}
                            />
                            {errors.ownerName && <p className='text-danger'>{errors.ownerName.message}</p>}
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="contact">Contact</label>
                            <input
                                type="number"
                                className="form-control form-control-sm custom-border w-75"
                                id="contact"
                                name='contact'
                                {...register("contact")}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="panNumber">PAN Number</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="panNumber"
                                name='panNumber'
                                {...register("panNumber", {
                                    pattern: {
                                        value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                                        message: "Please Enter Valid PAN Number"
                                    }
                                })}
                            />
                            {errors.panNumber && <p className='text-danger'>{errors.panNumber.message}</p>}
                        </div>
                    </div>
                    {/* second row */}
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="adharNumber">Aadhar Number</label>
                            <input
                                type="number"
                                className="form-control form-control-sm custom-border w-75"
                                id="adharNumber"
                                {...register("adharNumber", {
                                    pattern: {
                                        value: /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
                                        message: "Please Enter Valid Adhar Number"
                                    }
                                })}
                            />
                            {errors.adharNumber && <p className='text-danger'>Please Enter Valid Aadhar Number</p>}
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="linked">Adhar Linked with PAN</label>
                            <select
                                className="form-select form-select-sm border-dark-subtle w-75"
                                id="linked"
                                name="linked"

                                {...register("linked")}

                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>

                            </select>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="address">Address</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="address"
                                {...register("address")}
                            />
                        </div>
                    </div>
                    {/* third row */}
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="accountNumber">Bank A/C Number</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="accountNumber"
                                name="accountNumber"
                                {...register("accountNumber")}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="bankName">Bank Name</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="bankName"
                                {...register("bankName")}
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="ifscCode">IFSC Code</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="ifscCode"
                                name="ifscCode"
                                {...register("ifscCode")}
                            />
                        </div>
                    </div>
                    {/* fourth row */}
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="branchName">Branch Name</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="branchName"
                                {...register("branchName")}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="remark">Remark</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="remark"
                                name="remark"
                                {...register("remark")}
                            />
                        </div>
                        {/* <div className="form-group col-md-2">
                            <label htmlFor="inputPassword4">Owner Type</label>
                            <select
                                className="form-select"
                                id="floatingSelect"
                                aria-label="Floating label select example"
                                onChange={(e) => { setOwnerType(e.target.value) }}
                            >
                                <option value="actual">Actual</option>
                                <option value="lease">Lease</option>

                            </select>
                        </div> */}

                    </div>
                    {/* fifth row */}
                    <div className="form-row">
                        <div className="form-group col-md-4">

                            <div>
                                <div className="form-check form-check-inline mt-4">
                                    <label htmlFor="checkTds">TDS Declaration Submitted</label>
                                    <input
                                        className="form-check-input mt-1 border-dark-subtle"
                                        type="checkbox"
                                        name="checkTds"
                                        id="checkTds"
                                        value="yes"
                                        {...register("checkTds")}
                                    />

                                </div>
                                {/* <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input w-75"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        id="radio2"
                                        value="no"
                                        onClick={(e) => { setTdsStatus(e.target.value) }}
                                    />
                                    <label className="form-check-label" for="radio2">No</label>
                                </div> */}
                            </div>
                        </div>

                        <div className="form-group col-md-4">
                            <p htmlFor="tdsSubmissionDate" className='mb-1'>Submission Date</p>

                            <Controller
                                name="tdsSubmissionDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select date"
                                        disabled={watch("checkTds") === "yes" ? false : true}
                                        className='pl-2'
                                        onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                        selected={field.value ? new Date(field.value) : null}
                                        dateFormat="d-MMM-yyyy"
                                        required={watch("checkTds") === "yes"}
                                    />
                                )}
                            />

                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="docRefNo">Doc Ref No.</label>
                            <input
                                type="text"
                                className="form-control form-control-sm custom-border w-75"
                                id="docRefNo"
                                name='docRefNo'
                                disabled={watch("checkTds") === "yes" ? false : true}
                                {...register("docRefNo", { required: watch("checkTds") === "yes", message: "Please enter Doc Ref No." })}
                            />
                            {errors.docRefNo && <p className='text-danger'>{errors.docRefNo.message}</p>}
                        </div>

                    </div>

                    <div className='text-center'>
                        <button type="submit" disabled={startSpneer} className="btn btn-sm btn-primary ml-3">
                            {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                            </div>}
                            <span>Save</span>
                        </button>
                        <button type="button" className="btn btn-sm btn-outline-primary ml-3" onClick={(e) => { reset() }}>
                            Clear
                        </button>
                        <button type="button" className="btn btn-sm btn-primary ml-3" onClick={(e) => { reset() }}>
                            New
                        </button>
                    </div>
                    {
                        postError && <div className="alert alert-danger alert-dismissible fade show m-3" role="alert">
                            Some Error Occurred !!
                            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    }
                    {/* {
                        isDuplicate && <div className="alert alert-warning fade show m-2" role="alert">
                            Short Name already exist.
                        </div>
                    } */}
                    {/* {
                        isSaved && <div className="alert alert-success fade show m-2" role="alert">
                            Successfully Saved.
                        </div>
                    } */}
                </form>
            </div>
            <Toaster
                position="bottom-center"
                reverseOrder={true}
            />
        </div>
    )
}

export default AddNewTruckOwner
