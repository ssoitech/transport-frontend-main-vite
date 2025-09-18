import React, { useState, useEffect } from 'react';
import './css/markChallanAsUnload.css';
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AutoComplete from '../searchComponent/AutoComplete';
import { format } from 'date-fns';
import axiosInstance from '../../config/AxiosConfig';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function MarkChallanAsUnload() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const [permit, setPermit] = useState("");
    const [challanData, setChallanData] = useState([]);
    const [totalLoadWeight, setTotalLoadWeight] = useState("");
    const [loading, setLoading] = useState(false);
    const [getDataLoading, setGetDataLoading] = useState(false);

    // Watch fields for controlled components (like DatePicker)
    const startDate = watch("startDate");
    const endDate = watch("endDate");


    useEffect(() => {
        if (accessDetails) {
            if (accessDetails.role !== 'ADMIN') {
                if (accessDetails.role === 'USER') {
                    if (accessDetails.challanInputAccess !== "Y") {
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

    }, []);

    async function getIntransitChallans(permit, startDate, endDate) {
        setGetDataLoading(true);
        await axiosInstance.get(`/api/v1/get/challan/mark-as-unload?permitNumber=${permit}&startDate=${startDate}&endDate=${endDate}`)
            .then(function (response) {
                // handle success
                console.log(response.data);
                setGetDataLoading(false);
                setChallanData(response.data);

                const totalWeight = response.data.reduce((sum, item) => sum + item.loadWeight, 0);
                setTotalLoadWeight(totalWeight)
            })
            .catch(function (error) {
                // handle error
                setGetDataLoading(false);
                console.log(error);
            });
    }

    const onSubmit = async (data) => {

        let startDate = data.startDate ? format(data.startDate, 'yyyy-MM-dd') : null;
        let endDate = data.endDate ? format(data.endDate, 'yyyy-MM-dd') : null;

        if (!permit) {
            return;
        }
        if (!permit.name) {
            return;
        }
        if (!startDate) {
            return;
        }
        if (!endDate) {
            return;
        }

        await getIntransitChallans(permit.name, startDate, endDate);

    };


    const handleClick = async () => {
        if (challanData.length === 0) {
            return;
        }
        setLoading(true);
        // Update each object in the array
        let unLoadedData = challanData.map((item) => ({
            ...item, // Spread the existing object properties
            challanStatus: "unloaded", // Update the status
            updatedBy: accessDetails.userId ? accessDetails.userId : null
        }));

        // console.log(unLoadedData);

        await axiosInstance.post('/api/v1/mark/challan/as-unload', unLoadedData)
            .then(function (response) {
                // handle success
                setLoading(false);
                if (response.data === "success") {
                    Swal.fire("Updated", "Challans Successfully Marked as Unloaded", "success");
                } else {
                    Swal.fire("Error", "Some Error Occured!!", "error");
                }
            })
            .catch(function (error) {
                // handle error
                setLoading(false);
                Swal.fire("Error", "Internal Server Error!!", "error");
                console.log(error);
            });
    }


    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>Mark Challan As Unload</span>
            </div>
            <div className='card p-2'>


                <form onSubmit={handleSubmit(onSubmit)} className="challanUnload-first-container">
                    {/* Permit Number */}
                    <div className="item1">
                        <label htmlFor="permitNumber" className="form-label">Permit Number</label>
                        <div className="row">
                            <div className="col-auto">
                                <AutoComplete
                                    placeholder={"Search here"}
                                    url={'/api/v1/get/permit-number?keyword='}
                                    datakey={"name"}
                                    customLoading={<>Loading..</>}
                                    onSelect={(res) => setPermit(res)}
                                    onChange={(input) => { }}
                                    onBlur={(e) => { }}
                                    onFocus={(e) => { }}
                                    customStyles={{}}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Loading Period */}
                    <div className="item1">
                        <label htmlFor="loadingPeriod" className="form-label">Loading Period</label>
                        <div className="row">
                            <div className="col-sm-5">
                                <DatePicker
                                    className="date-picker-input pl-2"
                                    dateFormat="d-MMM-yyyy"
                                    placeholderText="Select Start Date"
                                    selected={startDate}
                                    onChange={(date) => setValue("startDate", date)}
                                />

                            </div>
                            <span className="col-sm-auto">To</span>
                            <div className="col-sm-5">
                                <DatePicker
                                    className="date-picker-input pl-2"
                                    dateFormat="d-MMM-yyyy"
                                    placeholderText="Select End Date"
                                    selected={endDate}
                                    onChange={(date) => setValue("endDate", date)}
                                />

                            </div>
                        </div>

                    </div>

                    {/* Display Order */}
                    <div className="item1">
                        {/* <label htmlFor="displayOrder" className="form-label">Display Order</label> */}

                        <div className="col-sm mt-4">

                            <button type="submit" className="btn btn-sm btn-primary mb-3 mt-1" disabled={getDataLoading}>
                                {getDataLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Finding ...
                                    </>
                                ) : (
                                    'Get Details'
                                )}
                            </button>
                        </div>

                    </div>

                </form>



                <div className='challanUnload-second-container'>
                    <div className='item'>

                        <button type="button" className="btn btn-sm btn-primary mr-3" disabled={loading} onClick={handleClick}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Processing ...
                                </>
                            ) : (
                                'Mark as Unloaded'
                            )}
                        </button>
                        <button type="button" class="btn btn-sm btn-primary mr-3">New</button>
                        <button type="button" class="btn btn-sm btn-primary mr-3">Clear</button>
                    </div>

                    <div className="item">
                        <div class="mr-3 row">
                            <label for="inputPassword" class="col-sm-4 col-form-label">Nos.</label>
                            <div class="col-sm-6">
                                <input type="number"
                                    class="form-control form-control-sm"
                                    id="nos"
                                    value={challanData ? challanData.length : ""}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="item">
                        <div class="mr-3 row">
                            <label for="inputPassword" class="col-sm-4 col-form-label">Tons.</label>
                            <div class="col-sm-6">
                                <input
                                    type="number"
                                    class="form-control form-control-sm"
                                    id="tons"
                                    value={totalLoadWeight ? parseFloat(totalLoadWeight).toFixed(2) : ""}
                                />
                            </div>
                        </div>

                    </div>
                </div>


            </div>

            <div className="container mt-4">
                <h5 className="mb-3">Challan Details</h5>
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>Load Date</th>
                            <th>Permit Number</th>
                            <th>TP Number</th>
                            <th>Truck Number</th>
                            <th>Load Weight</th>
                            <th>Challan Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {challanData ? challanData.map((challan, index) => (
                            <tr key={index}>
                                <td>{challan.loadDate ? format(challan.loadDate, "dd-MMM-yyyy") : ""}</td>
                                <td>{challan.permitNumber}</td>
                                <td>{challan.tpNumber}</td>
                                <td>{challan.truckNumber}</td>
                                <td className='text-center'>{challan.loadWeight}</td>
                                <td className='text-center'>
                                    <span className="bg-danger text-white px-2 py-1 rounded">
                                        {challan.challanStatus}
                                    </span>
                                </td>
                            </tr>
                        )) : ""
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default MarkChallanAsUnload;
