import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

function DateWiseData({ center, fromDate, toDate }) {
    const [selectOn, setSelectOn] = useState("rd");

    const [dateFrom, setDateFrom] = useState(null);
    const handleDateFromChange = (date) => {
        setDateFrom(format(date, 'yyyy-MM-dd'));
    };
    const [dateTo, setDateTo] = useState(null);
    const handleDateToChange = (date) => {
        setDateTo(format(date, 'yyyy-MM-dd'));
    };

    console.log(fromDate);
    console.log(toDate);

    console.log(selectOn)

    useEffect(() => {
        if (selectOn === "rd") {
            setDateFrom(fromDate);
            setDateTo(toDate);
        }
    }, [selectOn, fromDate, toDate])
    return (
        <div>
            <div className="form-row">
                <div className="form-group col-md-2">
                    <label htmlFor="selectOn">Select On</label>
                    <select
                        className="form-select form-select-sm border-dark-subtle"
                        aria-label="Default select example"
                        id='selectOn'
                        name='selectOn'
                        onChange={(e) => setSelectOn(e.target.value)}

                    >
                        <option selected value="rd">Received Date</option>
                        <option value="xyz">xyz</option>
                    </select>
                </div>
                <div className="form-group col-md-2">
                    <label htmlFor="inputField1">Date From</label>
                    <div className="date-picker-container">

                        <DatePicker
                            className="date-picker-input w-100 pl-2"
                            selected={dateFrom}
                            onChange={handleDateFromChange}
                            dateFormat="d-MMM-yyyy"
                            placeholderText="Select a date"
                            name="dateFrom"
                            id="dateFrom"
                            required={true}
                        />

                    </div>
                </div>
                <div className="form-group col-md-2">
                    <label htmlFor="inputField2">Date To</label>
                    <div className="date-picker-container">

                        <DatePicker
                            className="date-picker-input w-100 pl-2"
                            selected={dateTo}
                            onChange={handleDateToChange}
                            dateFormat="d-MMM-yyyy"
                            placeholderText="Select a date"
                            name="dateTo"
                            id="dateTo"
                            required={true}
                        />

                    </div>
                </div>
                <div className="form-group col-md-3 p-2">
                    <button type="button" className="btn btn-sm btn-primary  mt-4 ml-2">Proceed</button>
                    <button type="button" className="btn btn-sm btn-outline-primary  mt-4 ml-2">To Excel</button>
                </div>
                <div className="form-group col-md-3 p-2">

                    <input
                        type="number"
                        className="form-control form-control-sm border-dark-subtle mt-4"
                        id="inputField5"
                    />
                </div>
            </div>
        </div>
    )
}

export default DateWiseData
