import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axiosInstance from '../../../config/AxiosConfig';
import { useSelector } from 'react-redux';
import { get, set } from 'lodash';

function PaymentProcess() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const { register, handleSubmit, reset, getValues, setValue, resetField, control } = useForm();
    const [allFillingStationsName, setAllFillingStationsName] = useState(null);
    const [allBankDetails, setAllBankDetails] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editRowId, setEditRowId] = useState(null);

    const [previousPayments] = useState([
        { slNo: 1, paymentDate: '2025-09-01', paidAmount: 5000, mode: 'Bank', reference: 'REF123', status: 'Confirmed' },
        { slNo: 2, paymentDate: '2025-09-05', paidAmount: 2000, mode: 'Cash', reference: 'REF456', status: 'Pending' }
    ]);

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

    async function getAllBankNames() {
        await axiosInstance.get('/api/v1/get/all/bank-ids-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        nameId: element[0],
                        name: element[1]
                    };
                });
                setAllBankDetails(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    // Fetch petrol pump options when component mounts
    useEffect(() => {
        getAllFillingStationsName();
        getAllBankNames();
    }, [])

    const onSubmit = async (data) => {
        // Check petrolPumpId (from select)
        if (!data.petrolPump) {
            alert('Please select a Petrol Pump.');
            return;
        }
        // Prepare payload
        const payload = {
            fillingStationId: data.petrolPump,
            voucherNo: data.voucherNo,
            paymentDate: data.paymentDate,
            paidAmount: data.amountPaid,
            paymentMode: data.paymentMode,
            bankNameId: data.bankNameId,
            chequeNo: data.chequeNo,
            chequeDate: data.chequeDate,
            receivedBy: data.receivedBy,
            paidBy: data.paidBy,
            paymentNote: data.paymentNote,
            createdBy: accessDetails.userId ? accessDetails.userId : null
        };
        console.log('Submitting Payment:', payload);
        try {
            const response = await axiosInstance.post('/api/v1/hsd/add-payment', payload);
            if (response.data.success) {
                setPaymentInfo(response.data.data.payments || []);
                setValue('totalBillAmount', response.data.data.totalBillAmountSum);
                setValue('totalPaidAmount', response.data.data.amountPaidSum);
                setValue('balanceAmountDue', response.data.data.amountDue);

            }
            alert('Payment Details Saved Successfully!');
            resetLeftForm();

        } catch (error) {
            alert('Failed to save payment.');
        }
    };


    const onUpdate = async (data) => {
        if (!editRowId) return;
        const payload = {
            id: editRowId,
            fillingStationId: data.petrolPump,
            voucherNo: data.voucherNo,
            paymentDate: data.paymentDate,
            paidAmount: data.amountPaid,
            paymentMode: data.paymentMode,
            bankNameId: data.bankNameId,
            chequeNo: data.chequeNo,
            chequeDate: data.chequeDate,
            receivedBy: data.receivedBy,
            paidBy: data.paidBy,
            paymentNote: data.paymentNote,
            updatedBy: accessDetails.userId ? accessDetails.userId : null
        };
        try {
            const response = await axiosInstance.put('/api/v1/hsd/update-payment', payload);
            if (response.data.success) {
                setPaymentInfo(response.data.data.payments || []);
                setValue('totalBillAmount', response.data.data.totalBillAmountSum);
                setValue('totalPaidAmount', response.data.data.amountPaidSum);
                setValue('balanceAmountDue', response.data.data.amountDue);
            }
            alert('Payment Details Updated Successfully!');
            resetLeftForm();
        } catch (error) {
            alert('Failed to update payment.');
        }
    };

    const handleProceed = async () => {
        const petrolPumpId = getValues('petrolPump');
        if (!petrolPumpId) {
            alert('Please select a Petrol Pump before proceeding.');
            return;
        }

        await axiosInstance.get('/api/v1/hsd/get-payment-details', {
            params: {
                petrolPumpId: petrolPumpId
            }
        })
            .then(function (response) {
                // handle success       
                if (response.data) {
                    setPaymentInfo(response.data.data.payments || []);
                    setValue('totalBillAmount', response.data.data.totalBillAmountSum);
                    setValue('totalPaidAmount', response.data.data.amountPaidSum);
                    setValue('balanceAmountDue', response.data.data.amountDue);
                } else {
                    setPaymentInfo(null);
                    alert('No payment information found for the selected Petrol Pump.');
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    const handleEdit = (row) => {
        setEditMode(true);
        setEditRowId(row.id);
        setValue('voucherNo', row.voucherNumber);
        setValue('paymentDate', row.paymentDate);
        setValue('amountPaid', row.amountPaid);
        setValue('paymentMode', row.paymentMode);
        setValue('bankNameId', row.bankNameId);
        setValue('chequeNo', row.chequeNumber);
        setValue('chequeDate', row.chequeDate);
        setValue('receivedBy', row.receivedBy);
        setValue('paidBy', row.paidBy);
        setValue('paymentNote', row.paymentNote);
    };

    const handleDeleteRow = async (rowId) => {
        if (!window.confirm('Are you sure you want to delete this payment?')) return;
        try {
            const response = await axiosInstance.post(`/api/v1/hsd/delete-payment/${rowId}`);
            if (response.data.success) {
                setPaymentInfo(response.data.data.payments || []);
                setValue('totalBillAmount', response.data.data.totalBillAmountSum);
                setValue('totalPaidAmount', response.data.data.amountPaidSum);
                setValue('balanceAmountDue', response.data.data.amountDue);
                alert('Payment deleted successfully!');
            }
        } catch (error) {
            alert('Failed to delete payment.');
        }
        resetLeftForm();
    };

    const handleDelete = () => {
        // Handle delete logic here
        alert('Payment Deleted!');
        reset();
    };
    const resetLeftForm = () => {
        resetField('voucherNo');
        resetField('paymentDate');
        resetField('amountPaid');
        resetField('paymentMode');
        resetField('bankNameId');
        resetField('chequeNo');
        resetField('chequeDate');
        resetField('receivedBy');
        resetField('paidBy');
        resetField('paymentNote');
        setEditMode(false);
        setEditRowId(null);
    };

    const handleClear = () => {
        reset();
        setEditMode(false);
        setEditRowId(null);
        setPaymentInfo(null);
    };

    return (
        <div className="container mt-3">
            <h5>Payment Process</h5>
            {/* First Row */}
            <form onSubmit={editMode ? handleSubmit(onUpdate) : handleSubmit(onSubmit)}>
                <div className="row mb-3 align-items-end">
                    <div className="col-md-4">
                        <label className="form-label">Select Petrol Pump</label>

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
                    <div className="col-md-2">
                        <button type="button" className="btn btn-sm btn-primary w-50" onClick={handleProceed}>Proceed</button>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-sm btn-secondary w-50" onClick={handleClear}>Clear</button>
                    </div>
                </div>
                {/* Second Row */}
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label className="form-label" htmlFor='totalBillAmount'>Total Bill Amount</label>
                        <input type="number" id='totalBillAmount' disabled className="form-control form-control-sm border-dark-subtle" {...register('totalBillAmount')} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label" htmlFor='totalPaidAmount'>Total Paid Amount</label>
                        <input type="number" id='totalPaidAmount' disabled className="form-control form-control-sm border-dark-subtle" {...register('totalPaidAmount')} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label" htmlFor='balanceAmountDue'>Balance Amount Due</label>
                        <input type="number" id='balanceAmountDue' disabled className="form-control form-control-sm border-dark-subtle" {...register('balanceAmountDue')} />
                    </div>
                </div>
                {/* Third Row */}
                <div className="row">
                    {/* Left Column: Payment Form */}
                    <div className="col-md-4">
                        <div className="card p-3 mb-3">
                            <div className="mb-2">
                                <label className="form-label">Voucher No</label>
                                <input type="text" className="form-control form-control-sm" {...register('voucherNo')} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Payment Date</label>
                                <Controller
                                    name="paymentDate"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <input type="date" className="form-control form-control-sm" {...field} />
                                    )}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Amount Paid/Drawn</label>
                                <input type="number" className="form-control form-control-sm" {...register('amountPaid')} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Payment Mode</label>
                                <select className="form-select form-select-sm" {...register('paymentMode')}>
                                    <option value="">Select</option>
                                    <option value="Bank">Bank</option>
                                    <option value="Net">Net</option>
                                    <option value="Cash">Cash</option>
                                </select>
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Bank Name</label>

                                {allBankDetails ?
                                    <select
                                        className="form-select form-select-sm"
                                        aria-label="Default select example"
                                        name='fromBank'
                                        id='fromBank'
                                        {...register("bankNameId")}
                                    >
                                        <option value="">Select</option>
                                        {
                                            allBankDetails.map((item, idx) => {
                                                return <option key={idx} value={item.nameId}>{item.name}</option>
                                            })
                                        }

                                    </select> :
                                    <select className="form-select form-select-sm" aria-label="Default select example">
                                        <option value=""></option>
                                    </select>
                                }

                            </div>
                            <div className="mb-2">
                                <label className="form-label">Cheque No.</label>
                                <input type="text" className="form-control form-control-sm" {...register('chequeNo')} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Cheque Date</label>
                                <Controller
                                    name="chequeDate"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <input type="date" className="form-control form-control-sm" {...field} />
                                    )}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Received By</label>
                                <input type="text" className="form-control form-control-sm" {...register('receivedBy')} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Paid By</label>
                                <input type="text" className="form-control form-control-sm" {...register('paidBy')} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Payment Note</label>
                                <textarea className="form-control form-control-sm" {...register('paymentNote')} />
                            </div>
                            <div className="d-flex gap-2 mt-2">
                                <button type="submit" className={`btn btn-sm ${editMode ? 'btn-warning' : 'btn-success'}`}>
                                    {editMode ? 'Update' : 'Confirm'}
                                </button>
                                <button type="button" disabled={!editRowId} className="btn btn-sm btn-danger" onClick={() => handleDeleteRow(editRowId)}>Delete</button>
                                <button type="button" className="btn btn-sm btn-secondary" onClick={resetLeftForm}>Clear</button>
                            </div>
                        </div>
                    </div>
                    {/* Right Column: Previous Payment Details Table */}
                    <div className="col-md-8">
                        <div className="card p-3 mb-3">
                            <h6 className="mb-3">Previous Payment Details</h6>
                            <div className="table-responsive" style={{ maxHeight: 300, overflowY: 'auto' }}>
                                <table className="table table-bordered table-sm">
                                    <thead className="table-light">
                                        <tr>
                                            <th>SLNo</th>
                                            <th>Payment Date</th>
                                            <th>Paid Amount</th>
                                            <th>Mode</th>
                                            <th>Reference</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paymentInfo ? paymentInfo.map((row, idx) => (
                                            <tr key={idx}>
                                                <td>{idx + 1}</td>
                                                <td>{row.paymentDate}</td>
                                                <td>{row.amountPaid}</td>
                                                <td>{row.paymentMode}</td>
                                                <td>{row.voucherNumber}</td>
                                                <td>{"Paid"}</td>
                                                <td>
                                                    <button
                                                        type='button'
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => handleEdit(row)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : <p></p>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PaymentProcess;
