import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReferenceDetails from './paymentPendingSection/ReferenceDetails';
import BeneficiaryWiseSummary from './paymentPendingSection/BeneficiaryWiseSummary';
import ChallanWiseDetails from './paymentPendingSection/ChallanWiseDetails';
import SummaryReport from './paymentPendingSection/SummaryReport';
import TollGateAmount from './paymentPendingSection/TollGateAmount';
import CheckOffExp from './paymentPendingSection/CheckOffExp';
import { BaseUrl } from '../../services/BaseURI';
import axiosInstance from '../../config/AxiosConfig';

function PendingForProcess() {


    const [allCollectionCenterNames, setAllCollectionCenterNames] = useState();
    const [collectionCenterCeckBox, setCollectionCenterCheckBox] = useState(false);

    const [receivedFromDate, setReceivedFromDate] = useState(null);
    const handleFromDateChange = (date) => {
        setReceivedFromDate(date);
    };
    const [receivedToDate, setReceivedToDate] = useState(null);
    const handleToDateChange = (date) => {
        setReceivedToDate(date);
    };

    async function getAllCollectionCenterNames() {
        const URL = '/api/v1/get/all/collection-center-names';
        await axiosInstance.get(URL)
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

    useEffect(() => {
        getAllCollectionCenterNames();
    }, []);


    const handleChange = (e) => {
        console.log(e.target.checked);
        setCollectionCenterCheckBox(e.target.checked);
        if (e.target.checked) {
            getAllCollectionCenterNames();
        } else {
            setAllCollectionCenterNames(null);
        }
    }




    return (
        <div className="work-space-container">
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Payment Pending For Process</span>
            </div>


            <div className="form-row">
                <div className="form-group col-sm-3">
                    {/* <label htmlFor="ownerName">Collection Center</label> */}
                    <div className="form-check form-check-inline">
                        <label htmlFor="checkTds">Collection Center</label>

                    </div>


                    {allCollectionCenterNames ?
                        <select
                            className="form-select form-select-sm"
                            aria-label="Default select example"
                            name='collectionCenter'
                            id='collectionCenter'
                        // disabled={!collectionCenterCeckBox}
                        >
                            <option value="">Select All</option>
                            {
                                allCollectionCenterNames.map((item, idx) => {
                                    return <option key={idx} value={item.id}>{item.name}</option>
                                })
                            }

                        </select> :
                        <select
                            className="form-select form-select-sm"
                            aria-label="Default select example"
                        // disabled={!collectionCenterCeckBox}
                        >
                            <option value=""></option>
                        </select>
                    }

                </div>
                <div className="form-group col-sm-4 ml-4">
                    <label htmlFor="contact">Receive Period From</label>
                    <div className="date-picker-container">

                        <DatePicker
                            className="date-picker-input pl-2"
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
                <div className="form-group col-sm-4">
                    <label htmlFor="panNumber">Receive Period To</label>
                    <div className="date-picker-container">

                        <DatePicker
                            className="date-picker-input pl-2"
                            // selected={receivedToDate}
                            // onChange={handleToDateChange}
                            dateFormat="d-MMM-yyyy"
                            placeholderText="Select a date"
                            name="receivedToDate"
                            id="receivedToDate"
                            required={true}
                        />

                    </div>

                </div>
                <div className="form-group col-md-3">
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

                <div className="form-group col-md-3">
                    <label htmlFor="inputField8">Challan Holder Name</label>
                    <input type="text" className="form-control form-control-sm border-dark-subtle" id="inputField8" />
                </div>
            </div>
            <hr />
            <div>
                <Tabs
                    defaultActiveKey="reference-details"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="reference-details" title="Reference Details">
                        <ReferenceDetails />
                    </Tab>
                    <Tab eventKey="Beneficiary-wise-summary" title="Beneficiary Wise Summary">
                        <BeneficiaryWiseSummary />
                    </Tab>
                    <Tab eventKey="challan-wise-details" title="Challan Wise Details">
                        <ChallanWiseDetails />
                    </Tab>
                    <Tab eventKey="summary-report" title="Summary Report">
                        <SummaryReport />
                    </Tab>
                    <Tab eventKey="toll-gate-amount" title="Toll Gate Amount">
                        <TollGateAmount />
                    </Tab>
                    <Tab eventKey="check-off-exp" title="Check Off Exp">
                        <CheckOffExp />
                    </Tab>

                </Tabs>

            </div>
        </div>
    )
}

export default PendingForProcess;
