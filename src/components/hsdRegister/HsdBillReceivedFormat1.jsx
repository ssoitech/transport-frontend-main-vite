import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../../config/AxiosConfig';
import AutoComplete from '../searchComponent/AutoComplete';
import { set } from 'lodash';

const DEBOUNCE_DELAY = 300;

const HsdBillReceivedFormat1 = () => {

    const [petrolPumps, setPetrolPumps] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [allFillingStationsName, setAllFillingStationsName] = useState(null);
    const [tpNumberData, setTpNumberData] = useState();

    // Bill number suggestions
    const [billSuggestions, setBillSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [billExists, setBillExists] = useState(false);
    const [billDetails, setBillDetails] = useState(null);

    const debounceTimer = useRef();

    const { register, handleSubmit, setValue, getValues, watch, reset, control } = useForm();
    const {
        register: permitNumberSectionRegister,
        handleSubmit: permitNumberSectionHandleSubmit,
        setValue: permitNumberSectionSetValue,
        getValues: permitNumberSectionGetValues,
        reset: permitNumberSectionReset,
        control: permitNumberSectionControl
    } = useForm();

    const {
        register: vehicleNumberSectionRegister,
        handleSubmit: vehicleNumberSectionHandleSubmit,
        setValue: vehicleNumberSectionSetValue,
        reset: vehicleNumberSectionReset,
        control: vehicleNumberSectionControl
    } = useForm();

    // Watch for required fields
    const selectedPetrolPump = watch('petrolPump');
    const billingPeriodFrom = watch('billingPeriodFrom');
    const billingPeriodTo = watch('billingPeriodTo');
    const billNumber = watch('billNumber');


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

    // Fetch petrol pump options when component mounts
    useEffect(() => {
        getAllFillingStationsName();
    }, [])


    // Bill number input change handler with debounce
    const handleBillNumberChange = (e) => {
        const value = e.target.value;
        setValue('billNumber', value);
        setBillExists(false);

        // Remove suggestions if input is empty
        if (!value || value.trim() === '') {
            setShowSuggestions(false);
            setBillSuggestions([]);
            return;
        }

        // Only fetch suggestions if required fields are filled
        if (selectedPetrolPump && value.length > 1) {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(async () => {
                try {
                    const response = await axiosInstance.get('/api/v1/search-billno', {
                        params: {
                            petrolPumpId: selectedPetrolPump,
                            billNumber: value,
                            billingPeriodFrom,
                            billingPeriodTo
                        }
                    });
                    console.log(response);
                    setBillSuggestions(response.data.data || []);
                    setShowSuggestions((response.data.data || []).length > 0);
                } catch (error) {
                    setBillSuggestions([]);
                    setShowSuggestions(false);
                }
            }, DEBOUNCE_DELAY);
        } else {
            setShowSuggestions(false);
            setBillSuggestions([]);
        }
    };

    // Hide suggestions when input loses focus (optional UX)
    const handleBillNumberBlur = () => {
        setTimeout(() => setShowSuggestions(false), 150);
    };


    // When user selects a suggestion
    const handleSuggestionClick = async (suggestion) => {
        setValue('billNumber', suggestion.billNumber);
        setShowSuggestions(false);
    };

    // Save bill handler
    const saveBill = async () => {
        const data = getValues();

        try {
            const response = await axiosInstance.post('/api/v1/create-hsdbill', data);
            console.log(response);
            if (response.data.message === 'Success') {
                alert('Bill saved successfully');
            }// Replace with actual API endpoint      
            reset();
            setBillExists(false);
        } catch (error) {
            alert('Failed to save bill');
        }
    };

    // Handle "Find Bill" button click
    const findBill = async (data) => {
        try {
            const billNumber = data.billNumber;
            if (!billNumber || billNumber.trim() === '') {
                alert('Please enter a bill number to search');
                return;
            }
            const response = await axiosInstance.get(`/api/v1/get/bill-details/${billNumber}`);
            if (response.data) {
                console.log(response.data);
                if (!response.data.success) {
                    alert('No bill found with the given number');
                    setBillExists(false);
                    return;
                }
                const billDetails = response.data.data.billDetails;
                setBillDetails(billDetails);
                setTableData(response.data.data.challans || []);
                setBillExists(true);
                setValue('billDate', billDetails.billDate);
                setValue('totalChallan', billDetails.totalChallan);
                setValue('totalLiter', billDetails.totalLiter);
                setValue('totalBillAmount', billDetails.totalBillAmount);
                setValue('otherBillAmount', billDetails.otherBillAmount);
                setValue('billTds', billDetails.billTds);
                setValue('discount', billDetails.discount);
                setValue('finalPayble', billDetails.finalPayble);
                setValue('narration', billDetails.narration);
            } else {
                setBillExists(false);
            }
        } catch (error) {
            setBillExists(false);
        }
    };

    // Handle "Update Bill" button click
    const updateBill = async (data) => {
        try {
            await axios.post('/api/bills/update', data); // Replace with actual API endpoint
            alert('Bill updated successfully');
            reset();
            setBillExists(false);
        } catch (error) {
            alert('Failed to update bill');
        }
    };

    const handleGetTPNumber = async () => {
        const tpNumber = tpNumberData ? tpNumberData.name.replace(/\//g, "_") : '';
        if (tpNumber) {
            try {
                const response = await axiosInstance.get(`/api/v1/get/tp/for-hsd/${tpNumber}`);
                if (response.data.data) {
                    vehicleNumberSectionSetValue('fillingDate', response.data.data.fillingDate);
                    vehicleNumberSectionSetValue('vehicleNumber', response.data.data.truckNumber);
                    vehicleNumberSectionSetValue('ChallanNumber', response.data.data.ChallanNumber);
                    vehicleNumberSectionSetValue('hsdAdvance', response.data.data.hsdAdvance);
                    vehicleNumberSectionSetValue('challanDate', response.data.data.challanDate);
                }
            } catch (error) {
                console.error('Error fetching TP details:', error);
            }
        }
    }

    const handleAddToList = async () => {
        const tpNumberId = tpNumberData ? tpNumberData.id : '';
        const hsdbillNumber = billDetails ? billDetails.billNumber : '';
        const billId = billDetails ? billDetails.billId : '';
        console.log(billId);

        if (!tpNumberId || !hsdbillNumber || !billId) {
            alert('Please ensure TP Number and Bill are selected/found before adding to list.');
            return;
        }

        try {
            const response = await axiosInstance.post('/api/v1/hsd/add-to-list', {
                tpNumberId: tpNumberId,
                hsdBillNumber: hsdbillNumber,
                hsdBillId: billId
            });

            if (response.data && response.data.data) {
                setTableData(response.data.data);
                vehicleNumberSectionReset();
                setTpNumberData(null);
            }
        } catch (error) {
            console.error('Error adding to list:', error);
        }

    };

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>HSD Bill Received Format 1</span>
            </div>

            <div className="container mt-4">
                <form onSubmit={handleSubmit(saveBill)}>
                    <div className="row">
                        <div className="col-sm-4">
                            <label>Petrol Pump</label>

                            {allFillingStationsName ?
                                <select
                                    className="form-select form-select-sm"
                                    aria-label="Default select example"
                                    name='petrolPump'
                                    id='petrolPump'
                                    {...register("petrolPump")}
                                >
                                    <option value="">Select Pump</option>
                                    {
                                        allFillingStationsName.map((item, idx) => {
                                            return <option key={idx} value={item.nameId}>{item.name}</option>
                                        })
                                    }

                                </select> :
                                <select className="form-select form-select-sm" aria-label="Default select example">
                                    <option value=""></option>
                                </select>
                            }
                        </div>
                        <div className="col-sm-3">
                            <label>Billing Period From</label>
                            {/* <input {...register('billingPeriodFrom')} type="date" className="form-control" /> */}
                            <Controller
                                name="billingPeriodFrom"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select date"
                                        className='date-picker-input pl-2'
                                        onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                        selected={field.value ? new Date(field.value) : null}
                                        dateFormat="d-MMM-yyyy"

                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-3">
                            <label>Billing Period To</label>
                            <Controller
                                name="billingPeriodTo"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select date"
                                        className='date-picker-input pl-2'
                                        onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                        selected={field.value ? new Date(field.value) : null}
                                        dateFormat="d-MMM-yyyy"

                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-4 position-relative">
                            <label>Search Bill Number</label>
                            <input
                                {...register('billNumber')}
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                autoComplete="off"
                                onChange={handleBillNumberChange}
                                onBlur={handleBillNumberBlur}
                            />
                            {/* Suggestions dropdown */}
                            {showSuggestions && billSuggestions.length > 0 && (
                                <ul className="list-group position-absolute w-100 shadow" style={{ zIndex: 20, top: '100%' }}>
                                    {billSuggestions.map((suggestion, idx) => (
                                        <li
                                            key={idx}
                                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                            style={{ cursor: 'pointer', fontWeight: 500, fontSize: '1rem' }}
                                            onMouseDown={() => handleSuggestionClick(suggestion)}
                                        >
                                            <span>{suggestion.billNumber}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="col-sm-3 mt-2">
                            <button type="button" className="btn btn-sm btn-primary mt-4" onClick={() => findBill(getValues())}>Find Bill</button>
                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-sm-3">
                            <label>Bill Date</label>
                            {/* <input {...register('billDate')} type="date" className="form-control" /> */}
                            <Controller
                                name="billDate"
                                control={control}
                                defaultValue={null}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select date"
                                        className='date-picker-input pl-2'
                                        onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                        selected={field.value ? new Date(field.value) : null}
                                        dateFormat="d-MMM-yyyy"

                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-3">
                            <label>Total Challan</label>
                            <input {...register('totalChallan')} type="number" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-3">
                            <label>Total Liter</label>
                            <input {...register('totalLiter')} type="number" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-3">
                            <label>Total Bill Amount</label>
                            <input {...register('totalBillAmount')} type="number" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-sm-3">
                            <label>Other Bill Amount</label>
                            <input {...register('otherBillAmount')} type="number" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-3">
                            <label>Bill TDS</label>
                            <input {...register('billTds')} type="number" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-3">
                            <label>Discount</label>
                            <input {...register('discount')} type="number" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-3">
                            <label>Final Payble</label>
                            <input {...register('finalPayble')} type="number" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-6">
                            <label>Narration</label>
                            <textarea {...register('narration')} className="form-control form-control-sm border-dark-subtle"></textarea>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col">
                            <button type="submit" className="btn btn-sm btn-primary">Save Bill</button>
                            <button type="button" className="btn btn-sm btn-success ms-2">Update Bill</button>
                            <button type="button" className="btn btn-sm btn-danger ms-2">Delete Bill</button>
                            <button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => reset()}>Clear</button>
                        </div>
                    </div>
                </form>

                <form className="mt-4">
                    <div className="row">
                        <div className="col-sm-3">
                            <label htmlFor="tpNumber" className="form-label">TP Number</label>
                            <AutoComplete
                                placeholder={"Search here"}
                                url={'/api/v1/get/tp-number?keyword='}
                                datakey={"name"}
                                customLoading={<>Loading..</>}
                                onSelect={(res) => setTpNumberData(res)}
                                onChange={(input) => { }}
                                onBlur={(e) => { }}
                                onFocus={(e) => { }}
                                customStyles={{}}
                            />
                        </div>

                        <div className="col-sm-1 mt-2">
                            <button type="button" className="btn btn-sm btn-primary mt-4" onClick={handleGetTPNumber}>Get A</button>
                        </div>
                        <div className="col-sm-3">
                            <label>Filling Date</label>
                            {/* <input type="date" className="form-control" /> */}
                            <Controller
                                name="fillingDate"
                                control={vehicleNumberSectionControl}
                                defaultValue={null}
                                render={({ field }) => (
                                    < DatePicker
                                        placeholderText="Select date"
                                        className='date-picker-input pl-2'
                                        onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                        selected={field.value ? new Date(field.value) : null}
                                        dateFormat="d-MMM-yyyy"

                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-3 mt-2">
                            <button type="button" className="btn btn-sm btn-primary mt-4" onClick={handleAddToList}>Add to List</button>
                            <button type="button" className="btn btn-sm btn-secondary ms-2 mt-4">Cls</button>
                            <button type="button" className="btn btn-sm btn-danger ms-2 mt-4">Del</button>
                        </div>
                    </div>
                </form>

                <form className="mt-4">
                    <div className="row">
                        <div className="col-sm-3">
                            <label>Vehicle Number</label>
                            <input type="text" {...vehicleNumberSectionRegister("vehicleNumber")} className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-3">
                            <label>Challan Number</label>
                            <input type="text" {...vehicleNumberSectionRegister("ChallanNumber")} className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-3">
                            <label>HSD Advance</label>
                            <input type="number" {...vehicleNumberSectionRegister("hsdAdvance")} className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-sm-3">
                            <label>Challan Date</label>
                            {/* <input type="date" className="form-control" /> */}
                            <Controller
                                name="challanDate"
                                control={vehicleNumberSectionControl}
                                defaultValue={null}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select date"
                                        className='date-picker-input pl-2'
                                        onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                                        selected={field.value ? new Date(field.value) : null}
                                        dateFormat="d-MMM-yyyy"

                                    />
                                )}
                            />
                        </div>
                    </div>
                </form>

                {/* Data Table */}
                <div className="table-responsive mt-4">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>SL NO</th>
                                <th>TP Number</th>
                                <th>Truck Number</th>
                                <th>HSD Amount</th>
                                <th>HSD Slip</th>
                                <th>Challan Date</th>
                                <th>Filling Date</th>
                                <th>Remark</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{row.tpNumber}</td>
                                    <td>{row.truckNumber}</td>
                                    <td>{row.hsdAdvance}</td>
                                    <td>{row.issueSlip}</td>
                                    <td>{row.loadDate}</td>
                                    <td>{row.hsdFilling}</td>
                                    <td>{row.remark}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HsdBillReceivedFormat1;
