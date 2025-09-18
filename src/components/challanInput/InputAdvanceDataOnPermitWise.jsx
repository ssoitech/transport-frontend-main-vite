import React, { useState, useEffect, useref } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import { BaseUrl } from '../../services/BaseURI';
import Swal from "sweetalert2";
import AutoComplete from '../searchComponent/AutoComplete';
import axiosInstance from '../../config/AxiosConfig';
// needs to be changed
function InputAdvanceDataOnPermitWise() {
    const [searchedData, setSearchedData] = useState();
    const [tpNumberData, setTpNumberData] = useState();

    const [allFieldStaffNames, setAllFieldStaffNames] = useState();
    const [allBrokersName, setAllBrokersName] = useState();
    const [allFillingStationsName, setAllFillingStationsName] = useState();
    const [allBankDetails, setAllBankDetails] = useState();

    const [startSpneer, setStartSpneer] = useState(false);
    const [postError, setPostError] = useState(false);

    const [fieldStaffId, setFieldStaffId] = useState();
    const [brokerId, setBrokerId] = useState();
    const [petrolPumpId, setPetrolPumpId] = useState(152);
    const [bankDetailsId, setBankDetailsId] = useState();

    const [tpNoFindButtonDesabled, setTpNoFindButtonDesabled] = useState(false);
    const [tpNoFieldDisable, setTpNoFieldDisable] = useState(false);

    const { control, getValues, setValue, watch, register, handleSubmit, reset, formState: { errors } } = useForm();



    async function getAllFieldStaffNames() {
        await axiosInstance.get('/api/v1/get/all/field-staff-master')
            .then(function (response) {
                // handle success
                setAllFieldStaffNames(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllBrokersName() {
        await axiosInstance.get('/api/v1/get/all/fleet-agent-broker-master')
            .then(function (response) {
                // handle success
                setAllBrokersName(response.data);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllFillingStationsName() {
        await axiosInstance.get('/api/v1/get/filling-stations')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        nameId: element[0],
                        name: element[1]
                    };
                });
                setAllFillingStationsName(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllBankNames() {
        await axiosInstance.get('/api/v1/get/all/bank-ids-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        nameId: element[0],
                        name: element[1]
                    };
                });
                setAllBankDetails(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getAllFieldStaffNames();
        getAllBrokersName();
        getAllFillingStationsName();
        getAllBankNames();
    }, []);


    useEffect(() => {
        if (searchedData) {
            setTpNoFieldDisable(true);
            setValue("tpNumber", tpNumberData ? tpNumberData.name : null);
            setValue("challanDate", searchedData.permit_date ? searchedData.permit_date : null);
            setValue("vehicleNumber", searchedData.truck_number ? searchedData.truck_number : "");
            setValue("loadingQty", searchedData.load_weight ? parseFloat(Number(searchedData.load_weight)).toFixed(3) : 0.00);
            setValue("vehicleRate", searchedData.challan_vehicle_rate ? parseFloat(Number(searchedData.challan_vehicle_rate)).toFixed(2) : parseFloat(Number(searchedData.permit_vehicle_rate)).toFixed(2))
            setValue("loadingPoint", searchedData.loading_point_name ? searchedData.loading_point_name : "");
            setValue("destination", searchedData.un_loading_point_name ? searchedData.un_loading_point_name : "");
            setValue("paymentRate", searchedData.payment_rate ? parseFloat(Number(searchedData.payment_rate)).toFixed(2) : searchedData.challan_vehicle_rate ? parseFloat(Number(searchedData.challan_vehicle_rate)).toFixed(2) : parseFloat(Number(searchedData.permit_vehicle_rate)).toFixed(2));
            setValue("challanNumber", searchedData.challan_number ? searchedData.challan_number : "");
            setValue("invNumber", searchedData.inv_number ? searchedData.inv_number : "");
            setValue("driverWelfare", searchedData.driver_welfare ? parseFloat(Number(searchedData.driver_welfare)).toFixed(2) : 0.00);
            setValue("vehicleType", searchedData.truck_type ? searchedData.truck_type : "");
            setFieldStaffId(searchedData.field_staff_id);
            setValue("cashAdv", searchedData.cash_advance ? parseFloat(Number(searchedData.cash_advance)).toFixed(2) : 0.00);
            setValue("bankAdv", searchedData.bank_advance ? parseFloat(Number(searchedData.bank_advance)).toFixed(2) : 0.00);
            setValue("cashAndBank", parseFloat(Number(getValues("cashAdv")) + Number(getValues("bankAdv"))).toFixed(2));
            setValue("paymentDate", searchedData.payment_date ? searchedData.payment_date : null);
            setBankDetailsId(searchedData.from_bank_id);
            setValue("mode", searchedData.mode);
            if (searchedData.mode === "cheque") {
                setValue("chequeNo", searchedData.cheque_no);
                setValue("chequeDate", searchedData.cheque_date);
            }
            setValue("remark", searchedData.remark ? searchedData.remark : "");
            setPetrolPumpId(searchedData.petrol_pump_id)
            setValue("diesselSlipNo", searchedData.issue_slip ? searchedData.issue_slip : "")
            setValue("diesselCash", searchedData.hsd_advance ? parseFloat(Number(searchedData.hsd_advance)).toFixed(2) : 0.00);
            setBrokerId(searchedData.agent_broker_id);
            setValue("otherDed", searchedData.other_deduction ? parseFloat(Number(searchedData.other_deduction)).toFixed(2) : 0.00);
            setValue("towards", searchedData.deduction_towards ? searchedData.deduction_towards : "");
            setValue("totalAdv", parseFloat(Number(getValues("cashAdv")) + Number(getValues("bankAdv")) + Number(getValues("diesselCash"))).toFixed(2));
        }

    }, [searchedData])

    useEffect(() => {
        if (searchedData) {
            setValue("cashAndBank", parseFloat(Number(getValues("cashAdv")) + Number(getValues("bankAdv"))).toFixed(2));
            setValue("totalAdv", parseFloat(Number(getValues("cashAdv")) + Number(getValues("bankAdv")) + Number(getValues("diesselCash"))).toFixed(2));

        }

    }, [watch("cashAdv"), watch("bankAdv"), watch("diesselCash")])

    useEffect(() => {
        if (watch("mode") !== "cheque") {
            setValue("chequeNo", "");
            setValue("chequeDate", null);
        }
    }, [watch("mode")])




    async function getDataByTpNumber(tpNum) {
        await axiosInstance.get(`/api/v1/get/one/challan-details/for-advance-input/${tpNum}`)
            .then(function (response) {
                // handle success
                console.log(response.data);

                if (!response.data) {
                    setTpNoFindButtonDesabled(false);
                    reset();
                    Swal.fire({
                        icon: "error",
                        title: "No TP Found",
                        confirmButtonText: "OK",
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {

                            return;
                        }
                    });
                } else {

                    setSearchedData(response.data);

                }

                setTpNoFindButtonDesabled(false);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
                setTpNoFindButtonDesabled(false);
            });
    }

    const handleGetDataByTpNo = async () => {
        setTpNoFindButtonDesabled(true);
        const tpNo = getValues("tpNumber") || tpNumberData.name;
        if (!tpNo) {
            setTpNoFindButtonDesabled(false);
            Swal.fire({
                title: "Please Enter TP Number",
                confirmButtonText: "OK",
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    reset();
                    return;
                }
            });
        } else {
            const formattedTpNum = tpNo.replace(/\//g, "_");
            await getDataByTpNumber(formattedTpNum);
        }
    }



    // Saving the field data
    async function postAdvanceData(obj) {
        await axiosInstance.post('/api/v1/update/one/advance-data',
            obj
        )
            .then(function (response) {
                // handle success
                console.log(response.data);
                console.log(response.status);

                if (response.data = "updated" && response.status === 201) {
                    setStartSpneer(false);
                    Swal.fire({
                        icon: "success",
                        title: "Successfully Updated!",
                        confirmButtonText: "close",
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {

                            return;
                        }
                    });
                } else {
                    setStartSpneer(false);
                    Swal.fire({
                        icon: "error",
                        text: "Something Went Wrong!!",
                        confirmButtonText: "close",
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {

                            return;
                        }
                    });

                }

            })
            .catch(function (error) {
                // handle error
                console.log(error)
                setStartSpneer(false);
                Swal.fire({
                    icon: "error",
                    text: "Some Error Occured!!",
                    confirmButtonText: "close",
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {

                        return;
                    }
                });
            });
    }


    const handleAdvancedDataSubmit = async (data) => {
        console.log(data);
        setStartSpneer(true);
        if (!data.tpNumber) {
            setStartSpneer(false);
            console.log("hhhhhhhhhhhhhhhhhhhhhhhh")
            return;
        }

        await postAdvanceData(data);

    }

    const handleNew = () => {
        reset();
        setTpNoFieldDisable(false);
        setStartSpneer(false);

    }


    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>Input Advance Data Challan Wise</span>
            </div>
            <div className='card overflow-auto'>
                <div className='card-body'>
                    <form id="form" onSubmit={handleSubmit(handleAdvancedDataSubmit)}>
                        <div className="form-row">
                            <div className="">
                                <label htmlFor="tpNumber" className="form-label">Transit Pass Number</label>
                                <div className="row">
                                    <div className="col-auto">
                                        <AutoComplete
                                            placeholder={"Search here"}
                                            url={'/api/v1/get/tp-number?keyword='}
                                            datakey={"name"}
                                            customLoading={<>Loading..</>}
                                            onSelect={(res) => setTpNumberData(res)}
                                            onChange={(input) => { }}
                                            onBlur={(e) => { }}
                                            onFocus={(e) => { }}
                                            customStyles={{}}
                                        />

                                        <input
                                            hidden={true}
                                            type="text"
                                            id='tpNumber'
                                            name='tpNumber'
                                            value={tpNumberData ? tpNumberData.name : null}
                                            {...register("tpNumber")}
                                        />


                                    </div>
                                    <div className="col-auto">
                                        <button type="button" class="btn btn-sm btn-primary mb-3" onClick={handleGetDataByTpNo} disabled={tpNoFindButtonDesabled}>Find</button>
                                    </div>
                                    <div className="col-auto">
                                        <button type="button" class="btn btn-sm btn-outline-primary mb-3" onClick={handleNew}>New</button>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <hr />
                        {/* first section */}
                        <div className='pl-4 pr-4'>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="ownerName" className='mb-2'>Challan Date</p>
                                    <Controller
                                        name="challanDate"
                                        control={control}
                                        defaultValue={null}
                                        render={({ field }) => (
                                            <DatePicker
                                                placeholderText="Select date"
                                                className='date-picker-input pl-2'
                                                onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                                selected={field.value ? new Date(field.value) : null}
                                                dateFormat="d-MMM-yyyy"

                                            />
                                        )}
                                    />

                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="vehicleNumber" className='col-form-label col-form-label-sm'>Vehicle Number</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm custom-border w-75"
                                        id="vehicleNumber"
                                        name='vehicleNumber'
                                        {...register("vehicleNumber")}
                                    />

                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="loadingQty" className='col-form-label col-form-label-sm'>Loading Quantity</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm custom-border w-75"
                                        id="loadingQty"
                                        name='loadingQty'
                                        {...register("loadingQty")}
                                    />
                                </div>
                            </div>
                            <div className='form-row'>

                                <div className="form-group col-md-4">
                                    <label htmlFor="vehicleRate" className='col-form-label col-form-label-sm'>Vehicle Rate</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-sm custom-border w-75"
                                        id="vehicleRate"
                                        name='vehicleRate'
                                        {...register("vehicleRate")}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="loadingPoint" className='col-form-label col-form-label-sm'>Loading Point</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm custom-border w-75"
                                        id="loadingPoint"
                                        name='loadingPoint'
                                        {...register("loadingPoint")}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="destination" className='col-form-label col-form-label-sm'>Destination</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm custom-border w-75"
                                        id="destination"
                                        name='destination'
                                        {...register("destination")}
                                    />
                                </div>
                            </div>
                        </div>
                        <hr />

                        {/* first row */}
                        <div className="form-row mt-2">
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="paymentRate" className="col-sm-4 col-form-label col-form-label-sm">Payment Rate</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="paymentRate"
                                            name='paymentRate'
                                            {...register("paymentRate")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="challanNumber" className="col-sm-4 col-form-label col-form-label-sm">Challan No</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="challanNumber"
                                            name='challanNumber'
                                            {...register("challanNumber")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="invNumber" className="col-sm-4 col-form-label col-form-label-sm">WS/Inv No.</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="invNumber"
                                            name='invNumber'
                                            {...register("invNumber")}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* second row */}
                        <div className="form-row">
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="driverWelfare" className="col-sm-4 col-form-label col-form-label-sm">Driver Welfare</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="driverWelfare"
                                            name='driverWelfare'
                                            {...register("driverWelfare")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="vehicleType" className="col-sm-4 col-form-label col-form-label-sm">Vehicle Type</label>
                                    <div className="col-sm-8">

                                        <select
                                            className="form-select form-select-sm w-75 border-dark-subtle"
                                            aria-label=".form-select-sm example"
                                            id="vehicleType"
                                            name="vehicleType"
                                            {...register("vehicleType")}
                                        >
                                            <option value=""></option>
                                            <option value="nonunion" selected={watch("vehicleType") === 'nonunion'}>Non-Union</option>
                                            <option value="union" selected={watch("vehicleType") === 'nonunion'}>Union</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="fieldStaff" className="col-sm-4 col-form-label col-form-label-sm">Field Staff</label>
                                    <div className="col-sm-8">

                                        {allFieldStaffNames ?
                                            <select
                                                className="form-select form-select-sm w-75 border-dark-subtle"
                                                aria-label="Default select example"
                                                name='fieldStaff'
                                                id='fieldStaff'
                                                {...register("fieldStaff")}
                                            >

                                                <option value=""></option>
                                                {
                                                    allFieldStaffNames.map((item, idx) => {
                                                        return <option selected={item.id === fieldStaffId ? true : false} key={idx} value={item.id}>{item.name}</option>
                                                    })
                                                }

                                            </select> :
                                            <select className="form-select form-select-sm w-75 border-dark-subtle" aria-label="Default select example">
                                                <option value=""></option>
                                            </select>
                                        }
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* third row */}
                        <div className="form-row">
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="cashAdv" className="col-sm-4 col-form-label col-form-label-sm">Cash Adv.</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="cashAdv"
                                            name='cashAdv'
                                            {...register("cashAdv")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="bankAdv" className="col-sm-4 col-form-label col-form-label-sm">Bank Adv.</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="bankAdv"
                                            name='bankAdv'
                                            {...register("bankAdv")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="cashAndBank" className="col-sm-4 col-form-label col-form-label-sm">Cash & Bank</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="cashAndBank"
                                            name='cashAndBank'
                                            {...register("cashAndBank")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* fourth row */}
                        <div className="form-row">
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="paymentDate" className="col-sm-4 col-form-label col-form-label-sm">Payment Date</label>
                                    <div className="col-sm-8">

                                        <Controller
                                            name="paymentDate"
                                            control={control}
                                            defaultValue={null}
                                            render={({ field }) => (
                                                <DatePicker
                                                    placeholderText="Select date"
                                                    className='date-picker-input pl-2 w-75'
                                                    onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                                    selected={field.value ? new Date(field.value) : null}
                                                    dateFormat="d-MMM-yyyy"

                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="fromBank" className="col-sm-4 col-form-label col-form-label-sm">From Bank</label>
                                    <div className="col-sm-8">

                                        {allBankDetails ?
                                            <select
                                                className="form-select form-select-sm w-75 border-dark-subtle"
                                                aria-label="Default select example"
                                                name='fromBank'
                                                id='fromBank'
                                                {...register("fromBank")}
                                            >
                                                <option value=""></option>
                                                {
                                                    allBankDetails.map((item, idx) => {
                                                        return <option selected={item.nameId === bankDetailsId ? true : false} key={idx} value={item.nameId}>{item.name}</option>
                                                    })
                                                }

                                            </select> :
                                            <select className="form-select form-select-sm w-75 border-dark-subtle" aria-label="Default select example">
                                                <option value=""></option>
                                            </select>
                                        }



                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="mode" className="col-sm-4 col-form-label col-form-label-sm">Mode</label>
                                    <div className="col-sm-8">

                                        <select
                                            className="form-select form-select-sm w-75 border-dark-subtle"
                                            aria-label=".form-select-sm example"
                                            id="mode"
                                            name="mode"
                                            {...register("mode")}
                                        >
                                            <option value=""></option>
                                            <option value="net" selected={watch("mode") === 'net'}>On Net</option>
                                            <option value="cheque" selected={watch("mode") === 'cheque'}>Cheque</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* fifth row */}
                        <div className="form-row">
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="chequeNo" className="col-sm-4 col-form-label col-form-label-sm">Cheque No</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="chequeNo"
                                            name='chequeNo'
                                            disabled={watch("mode") === 'cheque' ? false : true}
                                            {...register("chequeNo")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="chequeDate" className='col-sm-4 col-form-label col-form-label-sm'>Cheque Date</label>
                                    <div className="col-sm-8">
                                        <Controller
                                            name="chequeDate"
                                            control={control}
                                            defaultValue={null}
                                            render={({ field }) => (
                                                <DatePicker
                                                    placeholderText="Select date"
                                                    className='date-picker-input pl-2 w-75'
                                                    onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                                    selected={field.value ? new Date(field.value) : null}
                                                    dateFormat="d-MMM-yyyy"
                                                    disabled={watch("mode") === 'cheque' ? false : true}

                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="remark" className="col-sm-4 col-form-label col-form-label-sm">Remark</label>
                                    <div className="col-sm-8">
                                        <textarea
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="remark"
                                            name='remark'
                                            {...register("remark")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* sixth row */}
                        <div className="form-row">
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="fillingStation" className="col-sm-4 col-form-label col-form-label-sm">Filling Station</label>
                                    <div className="col-sm-8">
                                        {allFillingStationsName ?
                                            <select
                                                className="form-select form-select-sm w-75 border-dark-subtle"
                                                aria-label="Default select example"
                                                name='fillingStation'
                                                id='fillingStation'
                                                {...register("fillingStation")}
                                            >
                                                <option value=""></option>
                                                {
                                                    allFillingStationsName.map((item, idx) => {
                                                        return <option selected={item.nameId === petrolPumpId ? true : false} key={idx} value={item.nameId}>{item.name}</option>
                                                    })
                                                }

                                            </select> :
                                            <select className="form-select form-select-sm w-75 border-dark-subtle" aria-label="Default select example">
                                                <option value=""></option>
                                            </select>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="diesselSlipNo" className="col-sm-4 col-form-label col-form-label-sm">Diessel Slip No</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="diesselSlipNo"
                                            name='diesselSlipNo'
                                            {...register("diesselSlipNo")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="diesselCash" className="col-sm-4 col-form-label col-form-label-sm">Diessel in Cash</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="diesselCash"
                                            name='diesselCash'
                                            {...register("diesselCash")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* seventh row */}
                        <div className="form-row">
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="agent" className="col-sm-4 col-form-label col-form-label-sm">Agent/Broker</label>
                                    <div className="col-sm-8">

                                        {allBrokersName ?
                                            <select
                                                className="form-select form-select-sm w-75 border-dark-subtle"
                                                aria-label="Default select example"
                                                name='agent'
                                                id='agent'
                                                {...register("agent")}
                                            >
                                                <option value=""></option>
                                                {
                                                    allBrokersName.map((item, idx) => {
                                                        return <option selected={item.id === brokerId ? true : false} key={idx} value={item.id}>{item.name}</option>
                                                    })
                                                }

                                            </select> :
                                            <select className="form-select form-select-sm w-75 border-dark-subtle" aria-label="Default select example">
                                                <option value=""></option>
                                            </select>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="otherDed" className="col-sm-4 col-form-label col-form-label-sm">Other Ded.</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="otherDed"
                                            name='otherDed'
                                            {...register("otherDed")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group col-sm-4">
                                <div className="form-group row">
                                    <label htmlFor="towards" className="col-sm-4 col-form-label col-form-label-sm">Towards</label>
                                    <div className="col-sm-8">
                                        <textarea
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="towards"
                                            name='towards'
                                            {...register("towards")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group col-sm-6 mt-1 p-2">
                                <div className="form-group row">
                                    <label htmlFor="totalAdv" className="col-sm-4 col-form-label text-black">Total Adv.</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm custom-border w-75"
                                            id="totalAdv"
                                            name='totalAdv'
                                            {...register("totalAdv")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-6 text-left'>

                                <button type="submit" disabled={startSpneer} className="btn btn-primary m-2">
                                    {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                    </div>}
                                    <span>Save</span>
                                </button>
                                <button type="button" className="btn btn-outline-primary" onClick={handleNew}>
                                    Clear
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
                <Toaster
                    position="bottom-center"
                    reverseOrder={true}
                />
            </div>
        </div>
    )
}

export default InputAdvanceDataOnPermitWise;


