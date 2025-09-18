import React, { useEffect } from 'react';
import './vehicleRateForPayment.css';
import { toast, Toaster } from 'react-hot-toast';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Swal from "sweetalert2";
import axiosInstance from '../../../config/AxiosConfig';


function VehicleRateReadOnly({ rateData }) {

    return (
        <div className='container card custom-class'>
            <div className='m-4 text-center bg-success text-white p-1 rounded'>
                <span>Permit Number : </span><span>{rateData && rateData.length > 0 ? rateData[0].permitNumber : ""}</span>
            </div>
            <div class="row">
                <div class="col-sm">
                    <form action="" id='vehicleRateForm'>
                        <div className='mt-4'>
                            <div className="row mb-3">
                                <label htmlFor="unionVehicleRate" className="col-sm-5 col-form-label col-form-label-sm">Union Vehicle Rate{"(Per ton)"}</label>
                                <div className="col-sm-7">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm border-dark-subtle"
                                        id="unionVehicleRate"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="vehicleRate" className="col-sm-5 col-form-label col-form-label-sm">Vehicle Rate{"(Per ton)"}</label>
                                <div className="col-sm-7">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm border-dark-subtle"
                                        id="vehicleRate"
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Effective Date</label>
                                <div className="col-sm-8">
                                    <div className="date-picker-container">
                                        <DatePicker
                                            className="date-picker-input pl-2"
                                            name="date"
                                            dateFormat="d-MMM-yyyy"
                                            placeholderText="Select a date"
                                            id="date"
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='container mb-2'>
                                <div className='mx-auto'>
                                    <button type="button" className="m-2 btn btn-sm btn-primary" disabled>
                                        Add
                                    </button>

                                    <button type="button" className="m-2 btn btn-sm btn-outline-primary ml-2" disabled>
                                        Clear
                                    </button>
                                </div>

                            </div>

                        </div>
                    </form>
                </div>
                <div class="col-sm">

                    <div className="overflow-auto mt-4">
                        <table className="table table-striped table-bordered table-hover align-middle">
                            <thead className="">
                                <tr className='text-center table-dark'>
                                    <th className='p-1' scope="col">SL No.</th>
                                    <th className='p-1' scope="col">Effective Date</th>
                                    <th className='p-1' scope="col">Vehicle Rate</th>
                                    <th className='p-1' scope="col">Union Vehicle Rate</th>
                                    <th className='p-1' scope="col">Actions</th>
                                </tr>
                            </thead>
                            {rateData && rateData.length > 0 ?
                                <tbody className='font-weight-normal textColor'>
                                    {rateData.map((data, idx) => (
                                        <tr key={idx}>
                                            <td className='p-1 text-center'>{idx + 1}</td>
                                            <td className='p-1 text-center'>{format(data.effectiveDate, 'd-MMM-yyyy')}</td>
                                            <td className='p-1 text-center'>{data.vehicleRate}</td>
                                            <td className='p-1 text-center'>{data.unionVehicleRate}</td>
                                            <td className='p-1 text-center'><i className="bi bi-trash rounded custom-hover-delete-icon p-1"></i></td>
                                        </tr>
                                    ))}

                                </tbody> : ""

                            }
                        </table>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default VehicleRateReadOnly;
