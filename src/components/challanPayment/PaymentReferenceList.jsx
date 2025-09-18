import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BaseUrl } from '../../services/BaseURI';

function PaymentReferenceList() {
    const [allCollectionCenterNames, setAllCollectionCenterNames] = useState();
    const [allUnloadingPoints, setAllUnloadingPoints] = useState();

    async function getAllCollectionCenterNames() {
        const URL = BaseUrl + '/api/v1/get/all/collection-center-names';
        await axios.get(URL)
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        name: element[1]
                    };
                });

                setAllCollectionCenterNames(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllUnloadingPointNames() {
        const URL = BaseUrl + '/api/v1/get/all/unloading-point-names';
        await axios.get(URL)
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        name: element[1]
                    };
                });

                setAllUnloadingPoints(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getAllCollectionCenterNames();
        getAllUnloadingPointNames();
    }, [])


    return (
        <div className="work-space-container">
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Payment Reference List</span>
            </div>

            <form>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <label htmlFor="inputField1">Select On</label>
                        <select
                            className="form-select form-select-sm border-dark-subtle"
                            aria-label="Default select example"

                        >
                            <option value="">Received Date</option>
                        </select>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="inputField1">Date From</label>
                        <div className="date-picker-container">

                            <DatePicker
                                className="date-picker-input w-100 pl-2"
                                // selected={receivedFromDate}
                                // onChange={handleFromDateChange}
                                dateFormat="d-MMM-yyyy"
                                placeholderText="Select a date"
                                name="receivedFromDate"
                                id="receivedFromDate"
                                required={true}
                            />

                        </div>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="inputField2">Date To</label>
                        <div className="date-picker-container">

                            <DatePicker
                                className="date-picker-input w-100 pl-2"
                                // selected={receivedFromDate}
                                // onChange={handleFromDateChange}
                                dateFormat="d-MMM-yyyy"
                                placeholderText="Select a date"
                                name="receivedFromDate"
                                id="receivedFromDate"
                                required={true}
                            />

                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputField4">Un-Loading Point</label>
                        {allUnloadingPoints ?
                            <select
                                className="form-select form-select-sm border-dark-subtle"
                                aria-label="Default select example"
                                name='collectionCenter'
                                id='collectionCenter'

                            >
                                <option value={0}>Select All</option>
                                {
                                    allUnloadingPoints.map((item, idx) => {
                                        return <option key={idx} value={item.id}>{item.name}</option>
                                    })
                                }

                            </select> :
                            <select
                                className="form-select form-select-sm"
                                aria-label="Default select example"

                            >
                                <option value=""></option>
                            </select>
                        }
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputField3">Collection Center</label>
                        {allCollectionCenterNames ?
                            <select
                                className="form-select form-select-sm border-dark-subtle"
                                aria-label="Default select example"
                                name='collectionCenter'
                                id='collectionCenter'

                            >
                                <option value={0}>Select All</option>
                                {
                                    allCollectionCenterNames.map((item, idx) => {
                                        return <option key={idx} value={item.id}>{item.name}</option>
                                    })
                                }

                            </select> :
                            <select
                                className="form-select form-select-sm"
                                aria-label="Default select example"

                            >
                                <option value=""></option>
                            </select>
                        }
                    </div>


                </div>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <label htmlFor="inputField5">Entered By</label>
                        <input type="text" className="form-control form-control-sm border-dark-subtle" id="inputField5" />
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="inputField6">Order By</label>
                        <select
                            className="form-select form-select-sm border-dark-subtle"
                            aria-label="Default select example"

                        >
                            <option value="">Reference Number</option>
                            <option value="">Challan Holder</option>
                            <option value="">Received Date</option>
                            <option value="">Payble Amount</option>
                            <option value="">Collection Center</option>
                            <option value="">Entry Date</option>
                        </select>
                    </div>
                    <div className="form-group col-md-2 p-2">
                        <label htmlFor="inputField8"></label>
                        <button type="button" className="btn btn-sm btn-primary mt-4">Search A</button>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="inputField8">Permit Number</label>
                        <input type="text" className="form-control form-control-sm border-dark-subtle" id="inputField8" />
                    </div>
                    <div className="form-group col-md-2 p-2">
                        <button type="button" className="btn btn-sm btn-primary  mt-4">Search B</button>
                    </div>
                    <div className="form-group col-md-2 p-2">
                        <button type="button" className="btn btn-sm btn-primary  mt-4">Export To Excel</button>
                    </div>
                </div>
            </form>
            <hr />




        </div>
    )
}

export default PaymentReferenceList
