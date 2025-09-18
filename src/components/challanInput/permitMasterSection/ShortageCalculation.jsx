import React, { useEffect, useState } from 'react';
import './shortage_calculation.css';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../../config/AxiosConfig';
import Swal from "sweetalert2";
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../services/AuthContext';
import { useContext } from 'react';

function ShortageCalculation({ permitNo }) {
    const { username, logout } = useContext(AuthContext);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [penaltyType, setPenaltyType] = useState("");

    const [penaltyPerKgInRupees, setPenaltyPerKgInRupees] = useState("");

    const [exemptedPercentDesabled, setExemptedPercentDesabled] = useState(false);

    const [startSpneer, setStartSpneer] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const { getValues, setValue, watch, register, handleSubmit, reset, formState: { errors } } = useForm();

    async function getLoggedInUserId() {

        await axiosInstance.get(`/api/v1/get/one/userId?username=${username}`)
            .then(function (response) {
                // handle success
                console.log(response.data);
                setLoggedInUserId(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getLoggedInUserId();
    })

    // Saving the data
    async function postData(fdata) {
        await axiosInstance.post('/api/v1/add/one/shortage-calculation',
            fdata
        ).then(function (response) {
            // handle success
            if (response.data === "success" && response.status === 201) {
                toast.success('Successfully Saved!', {
                    position: "bottom-center",
                    duration: 6000,
                    style: {
                        background: "green",
                        color: "#fff",
                    }
                });
                setIsSaved(true);
                setStartSpneer(false);

            } else {
                toast.error("Some Error Occured!");
                return;
            }
        })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    toast.error(permitNo + " Permit Number already exists! Duplicate entry found");
                    setStartSpneer(false);
                } else {
                    toast.error("Some Error Occured!");
                    setStartSpneer(false);
                }

            });
    };




    // function handleChange(e) {
    //     const { name, value } = e.target;

    //     setFormData({
    //         ...formData,
    //         [name]: value,
    //     });
    // };

    async function handleSave(data) {

        setStartSpneer(true);

        if (!permitNo) {
            toast.error("There is no Permit Number Specified!!");
            setStartSpneer(false);
            return
        }
        if (!penaltyType) {
            setStartSpneer(false);

            Swal.fire({
                text: "Please select the mode for shortage calculation",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok"
            }).then((result) => {
                if (result.isConfirmed) {
                    return;
                }
            });
            return;
        }

        console.log(data);

        if (loggedInUserId == 0 || loggedInUserId == null) {
            logout();
        }

        const fData = {
            "permitNumber": permitNo,
            "shortageCalculationMode": penaltyType,
            "exemptedUpto6wheel": data.exemptedUpto6Wheel,
            "exemptedUpto8wheel": data.exemptedUpto8Wheel,
            "exemptedUpto10wheel": data.exemptedUpto10Wheel,
            "exemptedUpto12wheel": data.exemptedUpto12Wheel,
            "exemptedUpto14wheel": data.exemptedUpto14Wheel,
            "exemptedUpto16wheel": data.exemptedUpto16Wheel,
            "exemptedUpto18wheel": data.exemptedUpto18Wheel,
            "exemptedUpto22wheel": data.exemptedUpto22Wheel,
            "calculationOn": data.exemptedUptoPercent ? "P" : "Q",
            "exemptedUptoPercent": data.exemptedUptoPercent,
            "exemptedRangeUpto6wheel": data.exemptedRangeUpto6Wheel,
            "exemptedRangeUpto8wheel": data.exemptedRangeUpto8Wheel,
            "exemptedRangeUpto10wheel": data.exemptedRangeUpto10Wheel,
            "exemptedRangeUpto12wheel": data.exemptedRangeUpto12Wheel,
            "exemptedRangeUpto14wheel": data.exemptedRangeUpto14Wheel,
            "exemptedRangeUpto16wheel": data.exemptedRangeUpto16Wheel,
            "exemptedRangeUpto18wheel": data.exemptedRangeUpto18Wheel,
            "penaltyPerKgInRupees": data.penaltyPerKgInRupees,
            "officeExpensesCalculationOn": data.oerAmount ? "A" : "",
            "oer6wheel": data.oer6Wheel,
            "oer8wheel": data.oer8Wheel,
            "oer10wheel": data.oer10Wheel,
            "oer12wheel": data.oer12Wheel,
            "oer14wheel": data.oer14Wheel,
            "oer16wheel": data.oer16Wheel,
            "oer18wheel": data.oer18Wheel,
            "oer22wheel": data.oer22Wheel,
            "oerAmount": data.oerAmount,
            "createdBy": loggedInUserId
        }

        // console.table(fData);

        await postData(fData);

    };

    return (
        <div className='container mb-5 card p-4 custom-class'>
            <div className='mb-4 text-center bg-success text-white p-1 rounded'>
                <span>Permit Number : </span><span>{permitNo}</span>
            </div>
            <form
                onSubmit={handleSubmit(handleSave)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                    }
                }}
            >
                <div className='row'>
                    <div className="col-sm">
                        <div className="form-check">
                            <input
                                className="form-check-input border-dark-subtle"
                                type="radio"
                                id="check1"
                                name="penaltyType"
                                value="B"
                                onChange={(e) => { setPenaltyType(e.target.value) }}

                            />
                            <label className="form-check-label" htmlFor="check1">
                                Penalty On Balance Qty
                            </label>
                        </div>

                    </div>
                    <div className="col-sm">
                        <div className="form-check">
                            <input
                                className="form-check-input border-dark-subtle"
                                type="radio"
                                id="check2"
                                name="penaltyType"
                                value="S"
                                checked={penaltyType === 'S'}
                                onChange={(e) => { setPenaltyType(e.target.value) }}

                            />
                            <label className="form-check-label" htmlFor="check2">
                                Penalty On Total Shortage Qty
                            </label>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="form-check">
                            <input
                                className="form-check-input border-dark-subtle"
                                type="radio"
                                id="check3"
                                name="penaltyType"
                                value="R"
                                checked={penaltyType === 'R'}
                                onChange={(e) => { setPenaltyType(e.target.value) }}

                            />
                            <label className="form-check-label" htmlFor="check3">
                                Penalty On a Range
                            </label>
                        </div>
                    </div>

                </div>
                <hr />
                <div className='row mt-4'>
                    <div className='col-sm-9'>
                        <div className='bg-success rounded text-white p-2'>
                            <span>Exempted Upto{'(Kg)'}</span>
                        </div>

                        <div className='row mt-4 p-2'>
                            <div class="col-sm">
                                <label>6 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedUpto6Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedUpto6Wheel'
                                    id='exemptedUpto6Wheel'
                                    {...register("exemptedUpto6Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })} // Only allows numbers with optional 2 decimal points   
                                />
                                {errors.exemptedUpto6Wheel && errors.exemptedUpto6Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>8 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedUpto8Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedUpto8Wheel'
                                    id='exemptedUpto8Wheel'
                                    {...register("exemptedUpto8Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedUpto8Wheel && errors.exemptedUpto8Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>10 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedUpto10Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedUpto10Wheel'
                                    id='exemptedUpto10Wheel'
                                    {...register("exemptedUpto10Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedUpto10Wheel && errors.exemptedUpto10Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>12 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedUpto12Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedUpto12Wheel'
                                    id='exemptedUpto12Wheel'
                                    {...register("exemptedUpto12Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedUpto12Wheel && errors.exemptedUpto12Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>14 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedUpto14Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedUpto14Wheel'
                                    id='exemptedUpto14Wheel'
                                    {...register("exemptedUpto14Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedUpto14Wheel && errors.exemptedUpto14Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>16 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedUpto16Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedUpto16Wheel'
                                    id='exemptedUpto16Wheel'
                                    {...register("exemptedUpto16Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedUpto16Wheel && errors.exemptedUpto16Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>18 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedUpto18Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedUpto18Wheel'
                                    id='exemptedUpto18Wheel'
                                    {...register("exemptedUpto18Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedUpto18Wheel && errors.exemptedUpto18Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>22 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedUpto22Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedUpto22Wheel'
                                    id='exemptedUpto22Wheel'
                                    {...register("exemptedUpto22Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedUpto22Wheel && errors.exemptedUpto22Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>

                        </div>

                    </div>
                    <div className='col-sm-1'>
                        OR
                    </div>
                    <div className='col-sm-2'>
                        <div className='bg-success text-white p-2 rounded'>
                            <span>Exempt Upto{'(%)'}</span>
                        </div>

                        <div class="col-sm mt-4 p-2">
                            <label>Percent</label>
                            <input
                                type="text"
                                className={`form-control form-control-sm ${errors.exemptedUptoPercent ? 'is-invalid' : 'border-dark-subtle'}`}
                                name='exemptedUptoPercent'
                                id='exemptedUptoPercent'
                                {...register("exemptedUptoPercent", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                            />
                            {errors.exemptedUptoPercent && errors.exemptedUptoPercent.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                        </div>
                    </div>

                </div>

                <div className='row mt-4'>
                    <div className='col-sm-9'>
                        <div className='bg-success text-white p-2 rounded'>
                            <span>Exempted Range Upto {'(Kg)'}</span>
                        </div>

                        <div className='row mt-4 p-2'>
                            <div class="col-sm">
                                <label>6 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedRangeUpto6Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedRangeUpto6Wheel'
                                    id='exemptedRangeUpto6Wheel'
                                    {...register("exemptedRangeUpto6Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedRangeUpto6Wheel && errors.exemptedRangeUpto6Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>8 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedRangeUpto8Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedRangeUpto8Wheel'
                                    id='exemptedRangeUpto8Wheel'
                                    {...register("exemptedRangeUpto8Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedRangeUpto8Wheel && errors.exemptedRangeUpto8Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>10 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedRangeUpto10Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedRangeUpto10Wheel'
                                    id='exemptedRangeUpto10Wheel'
                                    {...register("exemptedRangeUpto10Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedRangeUpto10Wheel && errors.exemptedRangeUpto10Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>12 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedRangeUpto12Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedRangeUpto12Wheel'
                                    id='exemptedRangeUpto12Wheel'
                                    {...register("exemptedRangeUpto12Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedRangeUpto12Wheel && errors.exemptedRangeUpto12Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>14 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedRangeUpto14Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedRangeUpto14Wheel'
                                    id='exemptedRangeUpto14Wheel'
                                    {...register("exemptedRangeUpto14Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedRangeUpto14Wheel && errors.exemptedRangeUpto14Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>16 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedRangeUpto16Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedRangeUpto16Wheel'
                                    id='exemptedRangeUpto16Wheel'
                                    {...register("exemptedRangeUpto16Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedRangeUpto16Wheel && errors.exemptedRangeUpto16Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>18 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedRangeUpto18Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedRangeUpto18Wheel'
                                    id='exemptedRangeUpto18Wheel'
                                    {...register("exemptedRangeUpto18Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedRangeUpto18Wheel && errors.exemptedRangeUpto18Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>22 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.exemptedRangeUpto22Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='exemptedRangeUpto22Wheel'
                                    id='exemptedRangeUpto22Wheel'
                                    {...register("exemptedRangeUpto22Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.exemptedRangeUpto22Wheel && errors.exemptedRangeUpto22Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>

                        </div>

                    </div>
                    <div className='col-sm-3'>
                    </div>

                </div>
                <div className='row mt-4'>
                    <div >
                        <span className='bg-success text-white p-2 rounded'>Penalty Per Kg</span>
                    </div>

                    <div className="row mb-3 mt-4">
                        <label
                            htmlFor="penaltyPerKgInRupees"
                            className="col-sm-2 col-form-label col-form-label"
                        >
                            In Rupees
                        </label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                className={`form-control form-control-sm ${errors.penaltyPerKgInRupees ? 'is-invalid' : 'border-dark-subtle'}`}
                                name='penaltyPerKgInRupees'
                                id='penaltyPerKgInRupees'
                                {...register("penaltyPerKgInRupees", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                            />
                            {errors.penaltyPerKgInRupees && errors.penaltyPerKgInRupees.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                        </div>
                    </div>


                </div>

                {/* last section */}
                <div className='row mt-4'>
                    <div className='col-sm-9'>
                        <div className='bg-success text-white p-2 rounded'>
                            <span>Office Expenses Recovery Per Challan {"(Fixed Amount)"}</span>
                        </div>

                        <div className='row mt-4 p-2'>
                            <div class="col-sm">
                                <label>6 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.oer6Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='oer6Wheel'
                                    id='oer6Wheel'
                                    {...register("oer6Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.oer6Wheel && errors.oer6Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>8 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.oer8Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='oer8Wheel'
                                    id='oer8Wheel'
                                    {...register("oer8Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.oer8Wheel && errors.oer8Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>10 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.oer10Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='oer10Wheel'
                                    id='oer10Wheel'
                                    {...register("oer10Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.oer10Wheel && errors.oer10Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>12 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.oer12Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='oer12Wheel'
                                    id='oer12Wheel'
                                    {...register("oer12Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.oer12Wheel && errors.oer12Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>14 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.oer14Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='oer14Wheel'
                                    id='oer14Wheel'
                                    {...register("oer14Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.oer14Wheel && errors.oer14Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>16 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.oer16Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='oer16Wheel'
                                    id='oer16Wheel'
                                    {...register("oer16Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.oer16Wheel && errors.oer16Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>18 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.oer18Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='oer18Wheel'
                                    id='oer18Wheel'
                                    {...register("oer18Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.oer18Wheel && errors.oer18Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>
                            <div class="col-sm">
                                <label>22 wheel</label>
                                <input
                                    type="text"
                                    className={`form-control form-control-sm ${errors.oer22Wheel ? 'is-invalid' : 'border-dark-subtle'}`}
                                    name='oer22Wheel'
                                    id='oer22Wheel'
                                    {...register("oer22Wheel", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                                />
                                {errors.oer22Wheel && errors.oer22Wheel.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                            </div>

                        </div>

                    </div>
                    <div className='col-sm-1'>
                        OR
                    </div>
                    <div className='col-sm-2'>
                        <div className='bg-success text-white p-2 rounded'>
                            <span>OER {'(Per Tone)'}</span>
                        </div>

                        <div class="col-sm mt-4 p-2">
                            <label>Amount</label>
                            <input
                                type="text"
                                className={`form-control form-control-sm ${errors.oerAmount ? 'is-invalid' : 'border-dark-subtle'}`}
                                name='oerAmount'
                                id='oerAmount'
                                {...register("oerAmount", { pattern: /^[0-9]+(\.[0-9]{1,2})?$/ })}
                            />
                            {errors.oerAmount && errors.oerAmount.type === 'pattern' && <p style={{ color: 'red' }}>Enter a valid number</p>}
                        </div>
                    </div>

                </div>
                <div className='mt-5 text-center'>

                    <button className="btn btn-primary m-2 pl-3 pr-3" type="submit">
                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                        </div>}
                        Save
                    </button>
                    <button type="reset" className="btn btn-outline-primary">
                        Clear
                    </button>
                </div>
                <Toaster
                    position="bottom-center"
                    reverseOrder={true}
                />
            </form>
        </div>
    )
}

export default ShortageCalculation;
