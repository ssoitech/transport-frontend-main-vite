import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { BaseUrl } from '../../../services/BaseURI';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';



const defaultOptions = [
    { name: '', label: 'loading..' },
];

function FillingStationPumpRate() {
    const [allFillingStationsName, setAllFillingStationsName] = useState();
    const [fillingStationNameId, setFillingStationNameId] = useState();
    const [ratePerLtr, setRatePerLtr] = useState();
    const [effectiveDate, setEffectiveDate] = useState();
    const [startSpneer, setStartSpneer] = useState(false);
    const [saveIsSuccess, setSaveIsSuccess] = useState();
    const [allPumpRateData, setAllPumpRateData] = useState();

    async function getAllPumpNames() {
        const URL = BaseUrl + '/api/v1/get/filling-stations';
        await axios.get(URL)
            .then(function (response) {


                const arrayOfObjects = response.data.map(element => {
                    return {
                        name: element[0],
                        label: element[1]
                    };
                });
                setAllFillingStationsName(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllPumpRates() {
        const URL = BaseUrl + '/api/v1/get/all/filling-stations-rate';
        await axios.get(URL)
            .then(function (response) {
                console.log(response.data);
                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        pumpName: element[1],
                        rate: element[2],
                        date: element[3]
                    };
                });
                setAllPumpRateData(arrayOfObjects);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }


    useEffect(() => {
        getAllPumpNames();
        getAllPumpRates();
    }, [])

    useEffect(() => {
        if (saveIsSuccess) {
            getAllPumpRates();
            setFillingStationNameId(null);
            setRatePerLtr(null);
            setEffectiveDate(null);
            document.getElementById("pumpRate").reset();
            setSaveIsSuccess(false);
        }

    }, [saveIsSuccess])


    // Saving the data
    async function postData(fdata) {
        const URL = BaseUrl + '/api/v1/add/one/filling-station-rate';
        await axios.post(URL,
            fdata
        )

            .then(function (response) {
                // handle success
                console.log(response.data);
                if (response.data === "success" && response.status === 201) {

                    // setSubmitSuccess(true);
                    // setIsSaved(true);
                    // setUpdateData(true);
                    setSaveIsSuccess(true);
                    setStartSpneer(false);


                    toast.success('Successfully Saved!', {
                        position: "bottom-center",
                        style: {
                            background: "green",
                            color: "#fff",
                        }
                    });


                } else {
                    toast.error("Some Error Occured!");
                    // setPostError(true);
                    setStartSpneer(false);
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error.response);

                toast.error("Some Error Occured!");
                setStartSpneer(false);

            });
    }





    async function handleSave(e) {
        setStartSpneer(true);
        if (!fillingStationNameId) {
            setStartSpneer(false);
            return
        }

        const fdata = {
            "fillingStationPumpId": fillingStationNameId,
            "ratePerLtr": ratePerLtr,
            "effectiveDate": effectiveDate,
            "createdBy": ""
        }

        await postData(fdata);
    }

    return (
        <div className="mx-auto">
            <div
                className="mb-4 alert alert-primary text-center font-weight-bold text-dark position-relative p-1 w-50 mx-auto"
                role="alert"
            >
                {/* name of the table */}
                <span className="mb-0 h6">Rate</span>
            </div>
            <div className="mb-4">
                <div className="container">
                    <div className="card-body font-weight-normal textColor">
                        <form className="justify-content-around" id="pumpRate">
                            <div className="form-group m-1 row">
                                <div className='col-sm'>
                                    {
                                        allFillingStationsName ?
                                            <Select
                                                options={allFillingStationsName}
                                                placeholder="Select Filling Station Name.."
                                                name='fillingStationName'
                                                id='fillingStationName'
                                                defaultValue={"hello"}
                                                onChange={(e) => { setFillingStationNameId(e.name) }}
                                                required={true}
                                            />
                                            :
                                            <Select
                                                options={defaultOptions}
                                                placeholder="Select Filling Station Name.."
                                                name='fillingStationName'
                                                id='fillingStationName'
                                                defaultValue={"hello"}
                                                onChange={(e) => { setFillingStationNameId(e.name) }}
                                                required={true}
                                            />

                                    }

                                </div>

                                <div className=" col-sm input-group input-group-sm m-1">
                                    <div className="input-group-prepend">
                                        <span
                                            className="input-group-text"
                                            id="inputGroup-sizing-sm"
                                        >
                                            Rate Per Liter
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control"
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm m-4"
                                        onChange={(e) => { setRatePerLtr(e.target.value) }}
                                    />
                                </div>
                                <div className=" col-sm input-group input-group-sm m-1">
                                    <div className="input-group-prepend">
                                        <span
                                            className="input-group-text"
                                            id="inputGroup-sizing-sm"
                                        >
                                            Effective Date
                                        </span>
                                    </div>
                                    <input
                                        type="Date"
                                        className="form-control"
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm m-4"
                                        onChange={(e) => { setEffectiveDate(e.target.value) }}
                                    />
                                </div>
                                <div id="buttons"
                                    className="m-1 btn-div mx-auto justify-content-around"
                                >
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary m-2"
                                        onClick={(e) => { handleSave(e) }}
                                    >
                                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                        </div>}
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary m-2"
                                    // onClick={(e) => { handleSave(e) }}
                                    >
                                        {/* {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                        </div>} */}
                                        New
                                    </button>
                                    <button
                                        type="button"
                                        disabled={true}
                                        className="btn btn-sm btn-primary m-2"
                                    // onClick={(e) => { handleSave(e) }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </form>
                        {allPumpRateData ?
                            <div className="overflow-auto">
                                <table className="table table-sm table-striped table-bordered table-hover align-middle">
                                    <thead className="thead-dark">
                                        <tr className='text-center'>
                                            <th className='p-1' scope="col">SL No.</th>
                                            <th className='p-1' scope="col">Filling Station Name</th>
                                            <th className='p-1' scope="col">Rate Per Lt.</th>
                                            <th className='p-1' scope="col">Effective Date</th>
                                            <th className='p-1' scope="col" colSpan="2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='font-weight-normal textColor'>
                                        {allPumpRateData.map((item, idx) => (
                                            <tr key={idx}>
                                                <td className='p-1 text-center'>{idx + 1}</td>
                                                <td className='p-1'>{item.pumpName}</td>
                                                <td className='p-1'>{item.rate}</td>
                                                <td className='p-1'>{item.date}</td>
                                                <td className='p-1 text-center' data-toggle="modal" data-target="#editModal"><i className="bi bi-pencil-square text-primary"></i></td>
                                                <td className='p-1 text-center'><i className="bi bi-trash text-danger"></i></td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                            </div>
                            : ""
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

export default FillingStationPumpRate
