import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../../config/AxiosConfig';


function FillingStationPump() {
    const [data, setData] = useState();
    const [isSaved, setIsSaved] = useState(false);
    const [updateData, setUpdateData] = useState(false);
    const [startSpneer, setStartSpneer] = useState(false);
    const [dataIsLoading, setDataIsLoading] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        getValues,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    async function getData() {
        setDataIsLoading(true);
        await axiosInstance.get(`/api/v1/get/all/filling-stations`)
            .then(function (response) {
                // handle success
                setDataIsLoading(false)
                const filteredData = response.data.filter(obj => obj.id !== 152);
                setData(filteredData);

            })
            .catch(function (error) {
                // handle error
                setDataIsLoading(false)
                console.log(error);
            });
    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        if (updateData) {
            getData();
            setUpdateData(false);
            reset();
        }
    }, [updateData])


    // Saving the data
    async function postData(fdata) {
        await axiosInstance.post('/api/v1/add/one/filling-station',
            fdata
        )

            .then(function (response) {
                // handle success
                console.log(response.data);
                if (response.data === "success" && response.status === 201) {

                    setIsSaved(true);
                    setUpdateData(true);
                    setStartSpneer(false);
                    toast.success('Successfully Added!', {
                        position: "bottom-center",
                        style: {
                            background: "green",
                            color: "#fff",
                        }
                    });

                } else {
                    toast.error("Some Error Occured!");
                    return false;
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);
                if (error.response.data === "duplicate" && error.response.status === 409) {
                    toast.error("Short name already exists!");
                    setStartSpneer(false);
                } else {
                    toast.error("Some Error Occured!");
                    setStartSpneer(false);
                }

            });
    }

    const onSubmit = async (formData) => {
        setStartSpneer(true);
        const fData = {
            "fillingStationName": formData.fillingStationName,
            "createdBy": ""
        }

        await postData(fData);
    }


    return (
        <div className="mx-auto">
            <div
                className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1 w-50 mx-auto"
                role="alert"
            >
                {/* name of the table */}
                <span className="mb-0 h6">Pump</span>
            </div>
            <div className="container">
                <div className="card-body font-weight-normal textColor">
                    <form className="justify-content-around" id="form1" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group m-1 row">
                            <div className="input-group input-group-sm m-1 w-50 text-center mx-auto">
                                <div className="input-group-prepend">
                                    <span
                                        className="input-group-text"
                                        id="inputGroup-sizing-sm"
                                    >
                                        Filling Station Name
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="form-control"
                                    aria-label="Small"
                                    aria-describedby="inputGroup-sizing-sm m-4"
                                    id='fillingStationName'
                                    {...register("fillingStationName", { required: true })}
                                />
                            </div>
                            <div id="buttons" className="btn-div mx-auto mt-2 mb-2">
                                <button
                                    type="submit"
                                    disabled={startSpneer}
                                    className="btn btn-sm btn-primary m-2 border-primary"

                                >
                                    {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                    </div>}
                                    <span>Add</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary m-2"
                                    onClick={(e) => { reset() }}
                                >
                                    New
                                </button>
                                <button
                                    type="button"
                                    disabled="true"
                                    className="btn btn-sm btn-primary m-2"
                                // onClick={(e) => { handleSave(e) }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </form>
                    <div
                        className="card-header py-2 d-flex flex-row align-items-center justify-content-around">
                        <h6 className="m-0 font-weight-bold text-primary text-center">List of filling Stations</h6>

                    </div>

                    {data &&
                        <div className="overflow-auto">
                            <table className="table table-sm table-striped table-bordered table-hover align-middle">
                                <thead className="thead-dark">
                                    <tr className='text-center'>
                                        <th className='p-1' scope="col">SL No.</th>
                                        <th className='p-1' scope="col">Filling Station Name</th>
                                        <th className='p-1' scope="col" colSpan="2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='font-weight-normal textColor'>
                                    {data.map((item, idx) => (
                                        <tr key={idx}>
                                            <td className='p-1 text-center'>{idx + 1}</td>
                                            <td className='p-1'>{item.fillingStationName}</td>
                                            <td className='p-1 text-center' data-toggle="modal" data-target="#editModal"><i className="bi bi-pencil-square text-primary custom-cursor-hand"></i></td>
                                            <td className='p-1 text-center'><i className="bi bi-trash text-danger custom-cursor-hand"></i></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>

                        </div>
                    }
                    {dataIsLoading && <div className="spinner-border text-primary m-5" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>}

                </div>
            </div>
            <Toaster
                position="bottom-center"
                reverseOrder={true}
            />
        </div>

    )
}

export default FillingStationPump
