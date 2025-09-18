import React from 'react';
import AutoComplete from '../searchComponent/AutoComplete';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";

function NrTruckPosting() {

    const { control, getValues, setValue, watch, register, handleSubmit, reset, formState: { errors } } = useForm();

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>NR Truck Posting</span>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-5">

                        <div className="container">
                            <div className="row mb-2">
                                <div className="col">
                                    <div className="">
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
                                                            // onSelect={(res) => setTpNumberData(res)}
                                                            onChange={(input) => { }}
                                                            onBlur={(e) => { }}
                                                            onFocus={(e) => { }}
                                                            customStyles={{}}
                                                        />


                                                    </div>
                                                    <div className="col-auto">
                                                        <button type="button" class="btn btn-sm btn-primary w-100 mb-2" >Find</button>
                                                    </div>
                                                    {/* <div className="col-auto">
                                                            <button type="button" class="btn btn-sm btn-outline-primary mb-3">New</button>
                                                        </div> */}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container p-3" style={{ backgroundColor: '#D6EFD8', border: '1px solid #D6EFD8', borderRadius: '10px' }}>

                            <div className=''>
                                <p className='text-center text-gray-600'>Unloading Information</p>
                                <hr />
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <div className="">
                                        <p htmlFor="ownerName" className='mb-2'>Posting Date</p>
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
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="">
                                        <div className="">
                                            <label for="truckType" className="form-label">Type Of Vehicle</label>
                                            <div className="">
                                                <div className="">
                                                    <select
                                                        className="form-select form-select-sm w-75 border-dark-subtle"
                                                        aria-label=".form-select-sm example"
                                                        id="truckType"
                                                        name="truckType"
                                                        {...register("truckType")}
                                                    >
                                                        <option value="nonunion" selected>Not Known</option>
                                                        <option value="union">Know</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <div className="">

                                        <div className="mt-3">
                                            <label htmlFor="causeTextArea" className="form-label">
                                                NR Cause/Note
                                            </label>
                                            <textarea
                                                className="form-control border-dark-subtle"
                                                id="causeTextArea"
                                                rows="4"
                                                placeholder="Enter the cause here..."
                                            ></textarea>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="container mt-3">
                            <div className="row text-center">
                                <div className="col-6 col-md-3 mb-2">
                                    <button className="btn btn-sm btn-primary w-100">New</button>
                                </div>
                                <div className="col-6 col-md-3 mb-2">
                                    <button className="btn btn-sm btn-secondary w-100">Save</button>
                                </div>
                                <div className="col-6 col-md-3 mb-2">
                                    <button className="btn btn-sm btn-danger w-100">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-7">
                        <div className="p-3" style={{ backgroundColor: '#D6EFD8', border: '1px solid #D6EFD8', borderRadius: '10px' }}>
                            <div className=''>
                                <p className='text-center text-gray-600'>Loading Information</p>
                                <hr />
                            </div>

                            <div className="container mt-3">
                                <div className="row mb-3">
                                    <label htmlFor="loadingDate" className="col-sm-4 col-form-label">
                                        Loading Date
                                    </label>
                                    <div className="col-sm-8">
                                        <Controller
                                            name="loadingDate"
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
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="mines" className="col-sm-4 col-form-label">
                                        Mines/Crusher
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            className="form-select form-select-sm w-75 border-dark-subtle"
                                            aria-label=".form-select-sm example"
                                            id="mines"
                                            name="mines"
                                            {...register("mines")}
                                        >
                                            <option value="nonunion" selected>Not Known</option>
                                            <option value="union">Know</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="exporter" className="col-sm-4 col-form-label">
                                        Exporter
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            className="form-select form-select-sm w-75 border-dark-subtle"
                                            aria-label=".form-select-sm example"
                                            id="exporter"
                                            name="exporter"
                                            {...register("exporter")}
                                        >
                                            <option value="nonunion" selected>Not Known</option>
                                            <option value="union">Know</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="loadingPoint" className="col-sm-4 col-form-label">
                                        Loading Point
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            className="form-select form-select-sm w-75 border-dark-subtle"
                                            aria-label=".form-select-sm example"
                                            id="loadingPoint"
                                            name="loadingPoint"
                                            {...register("loadingPoint")}
                                        >
                                            <option value="nonunion" selected>Not Known</option>
                                            <option value="union">Know</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="unloadingPoint" className="col-sm-4 col-form-label">
                                        Loading Point
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            className="form-select form-select-sm w-75 border-dark-subtle"
                                            aria-label=".form-select-sm example"
                                            id="unloadingPoint"
                                            name="unloadingPoint"
                                            {...register("unloadingPoint")}
                                        >
                                            <option value="nonunion" selected>Not Known</option>
                                            <option value="union">Know</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="material" className="col-sm-4 col-form-label">
                                        Material
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            className="form-select form-select-sm w-75 border-dark-subtle"
                                            aria-label=".form-select-sm example"
                                            id="material"
                                            name="material"
                                            {...register("material")}
                                        >
                                            <option value="nonunion" selected>Not Known</option>
                                            <option value="union">Know</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="challanNo" className="col-sm-4 col-form-label">
                                        Challan No
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="challanNo"

                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="truckNo" className="col-sm-4 col-form-label">
                                        Truck No
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="truckNo"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="despatchedQty" className="col-sm-4 col-form-label">
                                        Despatched Qty
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="despatchedQty"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="hsdIssued" className="col-sm-4 col-form-label">
                                        HSD Issued
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="hsdIssued"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="hsdIssued" className="col-sm-4 col-form-label">
                                        Advance
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="Advance"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="driverWelfare" className="col-sm-4 col-form-label">
                                        Driver Welfare Comm.
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="driverWelfare"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="challanAmtCollected" className="col-sm-4 col-form-label">
                                        Challan Amt Collected
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="challanAmtCollected"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="tpNumber" className="col-sm-4 col-form-label">
                                        TP Number
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="tpNumber"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="transeRate" className="col-sm-4 col-form-label">
                                        Trans. Rate
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="transeRate"
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="petrolPump" className="col-sm-4 col-form-label">
                                        Petrol Pump
                                    </label>
                                    <div className="col-sm-8">
                                        <select
                                            className="form-select form-select-sm w-75 border-dark-subtle"
                                            aria-label=".form-select-sm example"
                                            id="petrolPump"
                                            name="petrolPump"
                                            {...register("petrolPump")}
                                        >
                                            <option value="nonunion" selected>Not Known</option>
                                            <option value="union">Know</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <hr />
                            <div className="container mt-3">
                                <div className="row mb-3">
                                    <label htmlFor="ownerName" className="col-sm-4 col-form-label">
                                        Owner Name
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm w-75 border-dark-subtle"
                                            id="ownerName"

                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="tds" className="col-sm-4 col-form-label">
                                        TDS %
                                    </label>
                                    <div className="col-sm-4">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm border-dark-subtle"
                                            id="tds"

                                        />
                                    </div>
                                </div>
                            </div>

                        </div>


                        <div className="container mt-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row mb-3">
                                        <label htmlFor="totalTrucks" className="col-sm-8 col-form-label">
                                            Total Owned Truck/s
                                        </label>
                                        <div className="col-sm-4">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm border-dark-subtle"
                                                id="totalTrucks"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="row mb-3">
                                        <label htmlFor="totalTruckLoaded" className="col-sm-8 col-form-label">
                                            Total Truck/s Loaded
                                        </label>
                                        <div className="col-sm-4">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm border-dark-subtle"
                                                id="totalTruckLoaded"

                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </div>
    )
}

export default NrTruckPosting;
