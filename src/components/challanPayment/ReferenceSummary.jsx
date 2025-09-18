import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BaseUrl } from '../../services/BaseURI';
import PermitWiseData from './referenceSummarySections/PermitWiseData';
import OwnerWiseData from './referenceSummarySections/OwnerWiseData';
import DateWiseData from './referenceSummarySections/DateWiseData';
import CollectionCenterWiseData from './referenceSummarySections/CollectionCenterWiseData';
import { format } from 'date-fns';

const defaultOptions = [
    { name: '', label: 'loading..' },
];
function ReferenceSummary() {
    const [allCollectionCenterNames, setAllCollectionCenterNames] = useState();
    const [centerValue, setCenterValue] = useState(0);

    const [receivedFromDate, setReceivedFromDate] = useState(null);
    const handleFromDateChange = (date) => {
        setReceivedFromDate(format(date, 'yyyy-MM-dd'));
    };
    const [receivedToDate, setReceivedToDate] = useState(null);
    const handleToDateChange = (date) => {
        setReceivedToDate(format(date, 'yyyy-MM-dd'));
    };

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

    useEffect(() => {
        getAllCollectionCenterNames();
    }, [])



    return (
        <div className="work-space-container">
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Payment Reference Summary</span>
            </div>
            <div className="form-row">
                <div className="form-group col-sm-3">
                    <label htmlFor="ownerName">Collection Center</label>

                    {allCollectionCenterNames ?
                        <select
                            className="form-select form-select-sm"
                            aria-label="Default select example"
                            name='collectionCenter'
                            id='collectionCenter'
                            onChange={e => setCenterValue(e.target.value)}

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
                <div className="form-group col-sm-4 ml-4">
                    <label htmlFor="contact">Receive Period From</label>
                    <div className="date-picker-container">

                        <DatePicker
                            className="date-picker-input pl-2"
                            selected={receivedFromDate}
                            onChange={handleFromDateChange}
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
                            selected={receivedToDate}
                            onChange={handleToDateChange}
                            dateFormat="d-MMM-yyyy"
                            placeholderText="Select a date"
                            name="receivedToDate"
                            id="receivedToDate"
                            required={true}
                        />

                    </div>

                </div>
            </div>
            <hr />
            <div>
                <Tabs
                    defaultActiveKey="permit-wise"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="permit-wise" title="Permit Wise">
                        <PermitWiseData />
                    </Tab>
                    <Tab eventKey="owner-wise" title="Owner / Beneficiary Wise">
                        <OwnerWiseData />
                    </Tab>
                    <Tab eventKey="date-wise" title="Date Wise">
                        <DateWiseData center={centerValue} fromDate={receivedFromDate} toDate={receivedToDate} />
                    </Tab>
                    <Tab eventKey="collection-center-wise" title="Collection Center Wise">
                        <CollectionCenterWiseData />
                    </Tab>

                </Tabs>

            </div>
        </div>
    )
}

export default ReferenceSummary
