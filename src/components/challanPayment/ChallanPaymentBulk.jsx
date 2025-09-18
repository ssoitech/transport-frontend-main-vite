import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Tab, Tabs } from 'react-bootstrap';
import ReferenceWiseList from './challanPaymentBulkSections/ReferenceWiseList';
import ChallanWiseList from './challanPaymentBulkSections/ChallanWiseList';
import OwnerWiseList from './challanPaymentBulkSections/OwnerWiseList';
import axiosInstance from '../../config/AxiosConfig';

function ChallanPaymentBulk() {
    const [allCollectionCenterNames, setAllCollectionCenterNames] = useState();
    const [allUnloadingPoints, setAllUnloadingPoints] = useState();
    const [appUser, setAppUser] = useState();

    async function getAllCollectionCenterNames() {
        await axiosInstance.get('/api/v1/get/all/collection-center-names')
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

        await axiosInstance.get('/api/v1/get/all/unloading-point-names')
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

    async function getAllAppUsers() {
        await axiosInstance.get('/api/v1/get/all/usernames-and-ids')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        id: element[0],
                        name: element[1]
                    };
                });
                setAppUser(arrayOfObjects);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getAllCollectionCenterNames();
        getAllUnloadingPointNames();
        getAllAppUsers();
    }, [])


    const [formValues, setFormValues] = useState({
        receivedFromDate: null,
        receivedToDate: null,
        unloadingPoint: '',
        user: '',
        collectionCenter: '',
        orderBy: '',
        // add other fields as needed
    });

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle date changes
    const handleDateChange = (name, date) => {
        setFormValues(prev => ({
            ...prev,
            [name]: date
        }));
    };

    return (
        <div className="work-space-container">
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Challan Payment - Bulk Reference</span>
            </div>

            <form>
                <div className="form-row">

                    <div className="form-group col-md-3">
                        {/* <div className="form-check form-check-inline">
                            <label htmlFor="checkTds">Challan Received Date From</label>
                            <input
                                className="form-check-input mt-1 border-dark-subtle"
                                type="checkbox"
                                name="checkCenter"
                                id="checkCenter"
                            // onChange={handleChange}
                            />
                        </div> */}

                        <div className="date-picker-container">
                            <label htmlFor="checkTds">Challan Received Date From</label>
                            <DatePicker
                                className="date-picker-input pl-2"
                                selected={formValues.receivedFromDate}
                                onChange={date => handleDateChange('receivedFromDate', date)}
                                dateFormat="d-MMM-yyyy"
                                placeholderText="Select a date"
                                name="receivedFromDate"
                                id="receivedFromDate"
                                required={true}
                            />

                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputField2">Date To</label>
                        <div className="date-picker-container">

                            <DatePicker
                                className="date-picker-input pl-2"
                                selected={formValues.receivedToDate}
                                onChange={date => handleDateChange('receivedToDate', date)}
                                dateFormat="d-MMM-yyyy"
                                placeholderText="Select a date"
                                name="receivedToDate"
                                id="receivedToDate"
                                required={true}
                            />

                        </div>
                    </div>
                    <div className="form-group col-md-3">
                        {/* <div className="form-check form-check-inline">
                            <label htmlFor="checkTds">Select All Un-Loading Points</label>
                            <input
                                className="form-check-input mt-1 border-dark-subtle"
                                type="checkbox"
                                name="checkCenter"
                                id="checkCenter"
                            // onChange={handleChange}
                            />
                        </div> */}
                        <label htmlFor="unloadingPoint">Un-Loading Point</label>
                        {allUnloadingPoints ?
                            <select
                                className="form-select form-select-sm border-dark-subtle"
                                aria-label="Default select example"
                                name='unloadingPoint'
                                id='unloadingPoint'
                                value={formValues.unloadingPoint}
                                onChange={handleInputChange}
                            >
                                <option value="">All Unloading Points</option>
                                {allUnloadingPoints.map((item, idx) => (
                                    <option key={idx} value={item.id}>{item.name}</option>
                                ))}
                            </select> :
                            <select className="form-select form-select-sm" aria-label="Default select example">
                                <option value=""></option>
                            </select>
                        }
                    </div>
                    <div className="form-group col-md-2">
                        {/* <div className="form-check form-check-inline">
                            <label htmlFor="checkTds">Select All User</label>
                            <input
                                className="form-check-input mt-1 border-dark-subtle"
                                type="checkbox"
                                name="checkCenter"
                                id="checkCenter"
                            // onChange={handleChange}
                            />
                        </div> */}
                        <label htmlFor="checkTds">Select User</label>
                        {appUser ?
                            <select
                                className="form-select form-select-sm border-dark-subtle"
                                aria-label="Default select example"
                                name='user'
                                id='user'
                                value={formValues.user}
                                onChange={handleInputChange}
                            >
                                <option value="">All Users</option>
                                {appUser.map((item, idx) => (
                                    <option key={idx} value={item.id}>{item.name}</option>
                                ))}
                            </select> :
                            <select className="form-select form-select-sm" aria-label="Default select example">
                                <option value=""></option>
                            </select>
                        }
                        {/* <input
                            type="text"
                            className="form-control form-control-sm border-dark-subtle"
                            id="inputField5"
                            name="user"
                            value={formValues.user}
                            onChange={handleInputChange}
                        /> */}
                    </div>


                </div>
                <div className="form-row">
                    <div className="form-group col-md-3">
                        {/* <div className="form-check form-check-inline">
                            <label htmlFor="checkTds">Select All Collection Center</label>
                            <input
                                className="form-check-input mt-1 border-dark-subtle"
                                type="checkbox"
                                name="checkCenter"
                                id="checkCenter"
                            // onChange={handleChange}
                            />
                        </div> */}
                        <label htmlFor="collectionCenter">Collection Center</label>
                        {allCollectionCenterNames ?
                            <select
                                className="form-select form-select-sm border-dark-subtle"
                                aria-label="Default select example"
                                name='collectionCenter'
                                id='collectionCenter'
                                value={formValues.collectionCenter}
                                onChange={handleInputChange}
                            >
                                <option value="">All Collection Center</option>
                                {allCollectionCenterNames.map((item, idx) => (
                                    <option key={idx} value={item.id}>{item.name}</option>
                                ))}
                            </select> :
                            <select className="form-select form-select-sm" aria-label="Default select example">
                                <option value=""></option>
                            </select>
                        }
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="inputField6">Order By</label>
                        <select
                            className="form-select form-select-sm border-dark-subtle"
                            aria-label="Default select example"
                            name="orderBy"
                            value={formValues.orderBy}
                            onChange={handleInputChange}
                        >
                            <option value="">Reference Number</option>
                            <option value="challanHolder">Challan Holder</option>
                            <option value="receivedDate">Received Date</option>
                            <option value="paybleAmount">Payble Amount</option>
                            <option value="collectionCenter">Collection Center</option>
                            <option value="entryDate">Entry Date</option>
                        </select>
                    </div>

                    <div className="form-group col-md-2 p-2">
                        <button type="button" className="btn btn-sm btn-primary  mt-4 ml-2">Proceed</button>
                        <button type="button" className="btn btn-sm btn-outline-primary  mt-4 ml-2">Clear</button>
                    </div>
                </div>
            </form>

            <hr />
            <div>
                <Tabs
                    defaultActiveKey="reference-wise"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="reference-wise" title="Reference-Wise List">
                        <ReferenceWiseList formValues={formValues} />
                    </Tab>
                    <Tab eventKey="challan-wise" title="Challan-Wise List">
                        <ChallanWiseList formValues={formValues} />
                    </Tab>
                    <Tab eventKey="Owner-wise" title="Owner-Wise List">
                        <OwnerWiseList formValues={formValues} />
                    </Tab>
                </Tabs>

            </div>

        </div>
    )
}

export default ChallanPaymentBulk;
