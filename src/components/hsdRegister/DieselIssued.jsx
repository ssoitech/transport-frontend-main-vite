import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { Tab, Tabs } from 'react-bootstrap';
import ChallanWiseIssued from './dieselIssuedSections/ChallanWiseIssued';
import DateWiseIssued from './dieselIssuedSections/DateWiseIssued';
import PermitWiseIssued from './dieselIssuedSections/PermitWiseIssued';
import OnlyPaidChallans from './dieselIssuedSections/OnlyPaidChallans';
import SearchOnNumber from './dieselIssuedSections/SearchOnNumber';
import PumpWiseSummary from './dieselIssuedSections/PumpWiseSummary';
import axiosInstance from '../../config/AxiosConfig';

function DieselIssued() {

    const [petrolPump, setPetrolPump] = useState(null);
    const [dateType, setDateType] = useState("CD");
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [allFillingStationsName, setAllFillingStationsName] = useState(null);

    const handleFromDate = (date) => {
        setFromDate(date ? format(date, 'yyyy-MM-dd') : null);
    }
    const handleToDate = (date) => {
        setToDate(date ? format(date, 'yyyy-MM-dd') : null);
    }

    async function getAllFillingStationsName() {
        await axiosInstance.get('/api/v1/get/filling-stations')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        nameId: element[0],
                        name: element[1]
                    };
                });
                setAllFillingStationsName(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getAllFillingStationsName();
    }, [])

    const handleClear = () => {

    };


    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Query On Diesel Issued</span>
            </div>
            <form className="row g-2">
                <div className="col-md-4 d-flex align-items-center">
                    <label htmlFor="dropdown1" className="form-label me-2">
                        PetrolPump
                    </label>
                    {/* <select
                        id="dropdown1"
                        name="dropdown1"
                        className="form-select form-select-sm border-dark-subtle"
                        value={petrolPump}
                        onChange={(e) => { setPetrolPump(e.target.value) }}
                    >
                        <option value="">Select All Pump</option>
                        <option value="item2">Item 2</option>
                        <option value="item3">Item 3</option>
                    </select> */}
                    {allFillingStationsName ?
                        <select
                            className="form-select form-select-sm"
                            aria-label="Default select example"
                            name='petrolPump'
                            id='petrolPump'
                            value={petrolPump}
                            onChange={(e) => { setPetrolPump(e.target.value) }}
                        >
                            <option value="">All Pumps</option>
                            {
                                allFillingStationsName.map((item, idx) => {
                                    return <option key={idx} value={item.name}>{item.name}</option>
                                })
                            }

                        </select> :
                        <select className="form-select form-select-sm"
                            aria-label="Default select example"
                            value={petrolPump}
                            onChange={(e) => { setPetrolPump(e.target.value) }}
                        >
                            <option value=""></option>
                        </select>
                    }
                </div>

                <div className="col-md-2">
                    <select
                        name="dropdown2"
                        className="form-select form-select-sm border-dark-subtle w-75"
                        value={dateType}
                        onChange={(e) => { setDateType(e.target.value) }}
                    >
                        <option value="CD">Challan Date</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <DatePicker
                        className="date-picker-input pl-2"
                        selected={fromDate}
                        onChange={handleFromDate}
                        name="fromDate"
                        dateFormat="d-MMM-yyyy"
                        placeholderText="Select from Date"
                        id="fromDate"
                    />

                </div>

                <div className="col-md-3">
                    <DatePicker
                        className="date-picker-input pl-2"
                        selected={toDate}
                        onChange={handleToDate}
                        name="toDate"
                        dateFormat="d-MMM-yyyy"
                        placeholderText="Select To date"
                        id="toDate"
                    />

                </div>

                <div className="col-md-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>
            </form>

            <div>
                <Tabs
                    defaultActiveKey="challan-wise-issued"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="challan-wise-issued" title="Challan Wise Issued">
                        <ChallanWiseIssued petrolPumpId={petrolPump} fromDate={fromDate} toDate={toDate} />
                    </Tab>

                    <Tab eventKey="date-wise-issued" title="Date Wise Issued">
                        <DateWiseIssued petrolPumpId={petrolPump} fromDate={fromDate} toDate={toDate} />
                    </Tab>

                    <Tab eventKey="permit-wise-issued" title="Permit Wise Issued">
                        <PermitWiseIssued petrolPumpId={petrolPump} fromDate={fromDate} toDate={toDate} />
                    </Tab>

                    <Tab eventKey="only-paid-challans" title="Only Paid Challans">
                        <OnlyPaidChallans petrolPumpId={petrolPump} fromDate={fromDate} toDate={toDate} />
                    </Tab>

                    <Tab eventKey="search-on-number" title="Search On Number">
                        <SearchOnNumber />
                    </Tab>
                    <Tab eventKey="pump-wise-summary" title="Pump Wise Summary">
                        <PumpWiseSummary />
                    </Tab>

                </Tabs>

            </div>

        </div>
    )
}

export default DieselIssued;
