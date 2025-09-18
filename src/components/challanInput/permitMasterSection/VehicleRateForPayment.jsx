import React, { useEffect } from 'react';
import './vehicleRateForPayment.css';
import { toast, Toaster } from 'react-hot-toast';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Swal from "sweetalert2";
import axiosInstance from '../../../config/AxiosConfig';


function VehicleRateForPayment({ permitNo }) {

    const [permitNumber, setPermitNumber] = useState(permitNo);

    const [allVehicleRateData, setAllVechicleRateData] = useState(null);

    const [vehicleRate, setVehicleRate] = useState();
    const [effectiveDate, setEffectiveDate] = useState(null);
    const [vehicleRateIsEmpty, setVehicleRateIsEmpty] = useState(false);
    const [effectiveDateIsEmpty, setEffectiveDateIsEmpty] = useState(false);
    const [vehicleRateSpneer, setStartVehicleRateSpneer] = useState(false);
    const [vehiclerateIsSaved, setVehicleRateIsSaved] = useState(false);
    const [vehicleRateUpdateData, setVehicleRateUpdateData] = useState(false);
    const [vehicleRatePostError, setVehicleRatePostError] = useState(false);

    const [unionVehicleRate, setUnionVehicleRate] = useState("");
    const [startSpneer, setStartSpneer] = useState(false);


    const handleDate = (date) => {
        setEffectiveDate(format(date, 'yyyy-MM-dd'));
    }


    useEffect(() => {
        setPermitNumber(permitNo);
    }, [permitNo]);

    useEffect(() => {
        if (vehiclerateIsSaved) {
            getDataByPermitNumber();
            setVehicleRateIsSaved(false);
        }
        if (vehicleRateUpdateData) {
            getDataByPermitNumber();
            setUnionVehicleRate("");
            setVehicleRate("");
            setEffectiveDate("");
            document.getElementById("vehicleRateForm").reset();
            setVehicleRateUpdateData(false);
        }

    }, [vehiclerateIsSaved, vehicleRateUpdateData])

    async function getDataByPermitNumber() {
        await axiosInstance.get(`/api/v1/get/all/vehicle-rates/by-permit-number/${permitNumber}`)
            .then(function (response) {
                // handle success
                setAllVechicleRateData(response.data);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function postVehicleRateData(fdata) {
        await axiosInstance.post('/api/v1/add/one/vehicle-rate',
            fdata
        ).then(function (response) {
            // handle success
            console.log(response.data);
            if (response.data === "success" && response.status === 201) {
                toast.success('Successfully Added!!', {
                    position: "bottom-center",
                    style: {
                        background: "green",
                        color: "#fff",
                    }
                });
                setStartSpneer(false);
                setVehicleRateIsSaved(true);
                setVehicleRateUpdateData(true);
                setStartVehicleRateSpneer(false);

            } else {
                toast.error("Some Error Occured!");
                setVehicleRatePostError(true);
                return false;
            }
        })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    toast.error("Short name already exists!");
                    setStartVehicleRateSpneer(false);
                } else {
                    toast.error("Some Error Occured!");
                    setStartVehicleRateSpneer(false);
                }
            });
    }


    function handleVehicleRateSave(e) {
        e.preventDefault();
        if (e.key === "Enter") {
            e.preventDefault();
            return;
        }

        setStartSpneer(true);
        setStartVehicleRateSpneer(true);
        if (!permitNumber) {
            setStartSpneer(false);
            Swal.fire({
                title: "Permit Number Should Not Be Empty!!",
                confirmButtonText: "OK",
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    return;
                }
            });
            return;
        }
        if (!vehicleRate) {
            setStartSpneer(false);
            setVehicleRateIsEmpty(true);
            setStartVehicleRateSpneer(false);
            Swal.fire({
                title: "Please Enter Vehicle Rate",
                confirmButtonText: "OK",
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    return;
                }
            });
            return
        }
        if (!effectiveDate) {
            setStartSpneer(false);
            setEffectiveDateIsEmpty(true);
            setStartVehicleRateSpneer(false);
            Swal.fire({
                title: "Please Enter Effective Date",
                confirmButtonText: "OK",
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    return;
                }
            });
            return;
        }

        const fdata = {
            "permitNumber": permitNumber,
            "unionVehicleRate": unionVehicleRate ? unionVehicleRate : 0,
            "vehicleRate": vehicleRate,
            "effectiveDate": effectiveDate,
            "createdBy": ""
        }
        postVehicleRateData(fdata);

    }


    async function deleteOneData(id) {
        await axiosInstance.get(`/api/v1/delete/one/vehicle-rate/${id}`)
            .then(function (response) {
                // handle success
                if (response.data === "success") {
                    toast.remove();
                    setVehicleRateIsSaved(true);
                    toast.success('Successfully Deleted!', {
                        position: "bottom-center",
                        style: {
                            background: "green",
                            color: "#fff",
                        }
                    });
                }
            })
            .catch(function (error) {
                // handle error
                toast.remove();
                toast.error('Not able to delete. Some error occured !!', {
                    style: {
                        background: "red",
                        color: "#fff",
                    }
                });
                console.log(error);
            });
    }


    function handleDelete(id) {
        const isConfirmed = window.confirm("Are you sure to delete ?");
        if (isConfirmed) {
            deleteOneData(id);
            toast.loading("deleting..");
        }
    }

    function handleClear(e) {
        e.preventDefault();
        setUnionVehicleRate("");
        setVehicleRate("");
        setEffectiveDate("");
        document.getElementById("vehicleRateForm").reset();
    }


    return (
        <div className='container card custom-class'>
            <div className='m-4 text-center bg-success text-white p-1 rounded'>
                <span>Permit Number : </span><span>{permitNo}</span>
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
                                        onChange={(e) => { setUnionVehicleRate(e.target.value) }}
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
                                        onChange={(e) => { setVehicleRate(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="colFormLabelSm" className="col-sm-4 col-form-label col-form-label-sm">Effective Date</label>
                                <div className="col-sm-8">
                                    <div className="date-picker-container">
                                        <DatePicker
                                            className="date-picker-input pl-2"
                                            selected={effectiveDate}
                                            onChange={handleDate}
                                            name="date"
                                            dateFormat="d-MMM-yyyy"
                                            placeholderText="Select a date"
                                            id="date"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='container mb-2'>
                                <div className='mx-auto'>
                                    <button type="button" className="m-2 btn btn-sm btn-primary" onClick={(e) => { handleVehicleRateSave(e) }}>
                                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                        </div>}
                                        <span>Add</span>
                                    </button>

                                    <button type="button" className="m-2 btn btn-sm btn-outline-primary ml-2" onClick={(e) => { handleClear(e) }}>
                                        Clear
                                    </button>
                                </div>

                            </div>

                        </div>
                        <Toaster
                            position="bottom-center"
                            reverseOrder={true}
                        />
                    </form>
                </div>
                <div class="col-sm">

                    <div className="overflow-auto mt-4">
                        <table className="table table-striped table-bordered table-hover align-middle">
                            <thead className="thead-dark">
                                <tr className='text-center'>
                                    <th className='p-1' scope="col">SL No.</th>
                                    <th className='p-1' scope="col">Effective Date</th>
                                    <th className='p-1' scope="col">Vehicle Rate</th>
                                    <th className='p-1' scope="col">Union Vehicle Rate</th>
                                    <th className='p-1' scope="col">Actions</th>
                                </tr>
                            </thead>
                            {allVehicleRateData &&
                                <tbody className='font-weight-normal textColor'>
                                    {allVehicleRateData.map((data, idx) => (
                                        <tr key={idx}>
                                            <td className='p-1 text-center'>{idx + 1}</td>
                                            <td className='p-1 text-center'>{format(data.effectiveDate, 'd-MMM-yyyy')}</td>
                                            <td className='p-1 text-center'>{data.vehicleRate}</td>
                                            <td className='p-1 text-center'>{data.unionVehicleRate}</td>

                                            <td className='p-1 text-center'><i className="bi bi-trash rounded custom-hover-delete-icon p-1" onClick={() => { handleDelete(data.id) }}></i></td>
                                        </tr>
                                    ))}

                                </tbody>

                            }
                        </table>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default VehicleRateForPayment
