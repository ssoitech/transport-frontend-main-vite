import React, { useEffect, useState } from 'react';
import VehiclePassingWeightModal from './modals/VehiclePassingWeightModal';
import axiosInstance from '../../config/AxiosConfig';
import { format } from 'date-fns';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function VehiclePassingWeight() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [data, setData] = useState();
    const [res, setRes] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const [updateData, setUpdateData] = useState(false);

    const [displayModal, setDisplayModal] = useState(false);


    console.log(accessDetails);

    async function getData() {
        await axiosInstance.get('/api/v1/get/all-vehicle-passing-weight')
            .then(function (response) {
                // handle success
                console.log("avbjdbjdbjdwdjdjwdwjdwdjdbejj-----------------")
                console.log(response.data[0]);
                setData(response.data[0]);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        if (accessDetails) {
            if (accessDetails.role === 'ADMIN') {
                getData();
                setUpdateData(false);
            } else if (accessDetails.role === 'USER') {
                if (accessDetails.setupApplicationAccess === "Y") {
                    getData();
                    setUpdateData(false);
                }

            }

        } else {
            Swal.fire("Error", "You don't have access to this section.", "error");
            navigate('/work-space');
        }

    }, []);

    useEffect(() => {
        if (updateData) {
            getData();
            setUpdateData(false);
        }
    }, [updateData]);

    async function handleEdit(e) {
        e.preventDefault();
        setDisplayModal(true);
    }

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center mt-auto p-1" role="alert">
                <span className='mb-0 text-black h6'>Passing Weight of Different Type of Vehicles</span>
            </div>
            {data ?
                <div className="col-xl-5 col-lg-4 card shadow mb-4 mx-auto">
                    <table className="table table-sm text-center table-bordered bg-info text-light mt-4">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Type Of Vehicle</th>
                                <th scope="col">Weight in Tone</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th className='bg-primary text-white text-center justify-content-center' scope="row">6 Wheel</th>
                                <td className='bg-primary text-white text-center'>
                                    {data.sixWheel ? parseFloat(data.sixWheel).toFixed(2) : ""}
                                </td>


                            </tr>
                            <tr>
                                <th className='bg-primary text-white text-center' scope="row">8 Wheel</th>
                                <td className='bg-primary text-white text-center'>
                                    {data.eightWheel ? parseFloat(data.eightWheel).toFixed(2) : ""}
                                </td>


                            </tr>
                            <tr>
                                <th className='bg-primary text-white text-center' scope="row">10 Wheel</th>
                                <td className='bg-primary text-white text-center'>

                                    {data.tenWheel ? parseFloat(data.tenWheel).toFixed(2) : ""}
                                </td>


                            </tr>
                            <tr>
                                <th className='bg-primary text-white text-center' scope="row">12 Wheel</th>
                                <td className='bg-primary text-white text-center'>

                                    {data.twelveWheel ? parseFloat(data.twelveWheel).toFixed(2) : ""}
                                </td>

                            </tr>
                            <tr>
                                <th className='bg-primary text-white text-center' scope="row">14 Wheel</th>
                                <td className='bg-primary text-white text-center'>

                                    {data.fourteenWheel ? parseFloat(data.fourteenWheel).toFixed(2) : ""}
                                </td>

                            </tr>
                            <tr>
                                <th className='bg-primary text-white text-center' scope="row">16 Wheel</th>
                                <td className='bg-primary text-white text-center'>

                                    {data.sixteenWheel ? parseFloat(data.sixteenWheel).toFixed(2) : ""}
                                </td>


                            </tr>
                            <tr>
                                <th className='bg-primary text-white text-center' scope="row">18 Wheel</th>
                                <td className='bg-primary text-white text-center'>

                                    {data.eighteenWheel ? parseFloat(data.eighteenWheel).toFixed(2) : ""}
                                </td>

                            </tr>
                            <tr>
                                <th className='bg-primary text-white text-center' scope="row">22 Wheel</th>
                                <td className='bg-primary text-white text-center'>

                                    {data.twentyTwoWheel ? parseFloat(data.twentyTwoWheel).toFixed(2) : ""}
                                </td>

                            </tr>
                        </tbody>
                    </table>
                    <div className='row'>
                        <div className='col-xl-10 col-lg-4'>
                            <p>Last Updated By : <span>{data.username ? data.username : ""}</span> </p>
                            {data.lastUpdatedAt && <p>Updated Date : <span>{data.lastUpdatedAt ? format(data.lastUpdatedAt, 'd-MMM-yyyy') : ""}</span></p>}
                        </div>
                        <div className='col-xl-2 col-lg-4'>
                            <button className="btn btn-sm btn-primary m-1 border-info" disabled={accessDetails.role !== 'ADMIN'} onClick={(e) => { handleEdit(e) }}>
                                Edit
                            </button>
                        </div>

                    </div>
                </div> : <div className="spinner-border text-primary text-center m-5" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            }

            {
                displayModal && <VehiclePassingWeightModal eData={data ? data : ""} closeModal={() => {
                    setDisplayModal(false);
                }} updated={() => { setUpdateData(true) }} />
            }

        </div>
    )
}

export default VehiclePassingWeight;
