import React, { useState, useEffect } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { BaseUrl } from '../../../services/BaseURI';
import axiosInstance from '../../../config/AxiosConfig';

function ChallanCollectionCenter() {
    const [centreNames, setCentreNames] = useState([]);
    const [startSpneer, setStartSpneer] = useState(false);
    const [updated, setUpdated] = useState(false);
    const { getValues, setValue, watch, register, handleSubmit, reset, formState: { errors } } = useForm();

    async function getData() {
        await axiosInstance.get('/api/v1/get/all/challan-collection-centers')
            .then(function (response) {
                // handle success
                setCentreNames(response.data);
                setUpdated(false);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        if (updated) {
            reset();
            getData();
        }

    }, [updated]);

    useEffect(() => {
        getData();
    }, []);


    async function postData(fdata) {
        await axiosInstance.post('/api/v1/add/one/challan-collection-center',
            fdata
        )
            .then(function (response) {
                // handle success
                if (response.data === "success" && response.status === 201) {
                    toast.success('Successfully Added!', {
                        position: "bottom-center",
                        style: {
                            background: "green",
                            color: "#fff",
                        }
                    });

                    setUpdated(true);
                    setStartSpneer(false);

                } else {
                    toast.error("Some Error Occured!!");
                    setStartSpneer(false);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    // setIsDuplicate(true);
                    toast.error("Name Already Exists!");
                    setStartSpneer(false);
                } else {
                    setStartSpneer(false);
                }

            });
    }


    const onSubmit = async (data) => {
        setStartSpneer(true)
        const fdata = {
            "name": data.name
        }
        try {
            await postData(fdata);
        } catch (error) {
            setStartSpneer(false);
        }


    };


    return (
        <div className="mx-auto col-8">
            <div
                className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                role="alert"
            >
                {/* name of the table */}
                <span className="mb-0">Challan Collection Center</span>
            </div>

            <div className="card mb-4">
                <div className="container">
                    <div className="card-body font-weight-normal textColor">
                        <form className="justify-content-around" id="collectionCenterForm" onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group m-1 row">
                                <div className="row mb-3">
                                    <label htmlFor="name" className="col-sm-3 text-sm-start col-form-label col-form-label-sm">Name</label>
                                    <div className="col-sm-5">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="collectionCenterName"
                                            name='name'
                                            {...register("name")}

                                        />
                                    </div>
                                    <div id="buttons" className="col-sm-4">
                                        <button
                                            type="submit"
                                            form="collectionCenterForm"
                                            className="btn btn-sm btn-primary mr-1"
                                        >
                                            {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                            </div>}
                                            Add
                                        </button>
                                        <button
                                            type="button"
                                            form="collectionCenterForm"
                                            className="btn btn-sm btn-outline-primary ml-1"
                                        // onClick={(e) => { handleSave(e) }}
                                        >
                                            clear
                                        </button>
                                    </div>
                                    <div>
                                        <Toaster
                                            position="bottom-center"
                                            reverseOrder={true}
                                        />
                                    </div>
                                </div>

                            </div>
                        </form>

                        {/* <table className="table table-striped table-bordered table-hover align-middle">
                            <thead className="thead-dark">
                                <tr className="text-center">
                                    <th scope="col" className="col-2">
                                        SL No.
                                    </th>
                                    <th scope="col" className="col-10">
                                        Center
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="font-weight-normal textColor">
                                <tr className="text-center">
                                    <td>1</td>
                                    <td>BARBIL</td>
                                </tr>
                            </tbody>
                        </table> */}


                        {centreNames && <table className="table table-sm table-striped table-bordered table-hover align-middle">
                            <thead className="thead-dark">
                                <tr className="text-center">
                                    <th scope="col" className='p-1'>
                                        SL No.
                                    </th>
                                    <th scope="col" className='p-1'>
                                        Center
                                    </th>
                                    {/* <th className='p-1' scope="col" colSpan="2">Actions</th> */}
                                </tr>
                            </thead>
                            <tbody className="font-weight-normal textColor">
                                {centreNames.map((item, idx) => (
                                    <tr className="text-center" key={idx}>
                                        <td className='p-1'>{idx + 1}</td>
                                        <td className='p-1'>{item.name}</td>
                                        {/* <td className='p-1' data-toggle="modal" data-target="#editModal"><i className="bi bi-pencil-square text-primary" onClick={() => { handleEdit(item.id, item.materialName) }}></i></td>
                                        <td className='p-1'><i className="bi bi-trash text-danger" onClick={() => { handleDelete(item.id) }}></i></td> */}
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        }

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

export default ChallanCollectionCenter
