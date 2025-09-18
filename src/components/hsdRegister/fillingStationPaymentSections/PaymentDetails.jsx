import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../config/AxiosConfig';
import * as XLSX from 'xlsx';

function PaymentDetails() {
    const [allFillingStationsName, setAllFillingStationsName] = useState(null);
    const [tableData, setTableData] = useState([]);

    const [filters, setFilters] = useState({
        petrolPump: '',
        paidFrom: '',
        paidTo: '',
        orderBy: 'PN'
    });

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

    // Handle input changes for filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle Search button click
    const handleSearch = async () => {
        const filterData = {
            petrolPumpId: filters.petrolPump,
            startDate: filters.paidFrom,
            endDate: filters.paidTo,
            sortBy: filters.orderBy
        };
        console.log('Filter Data:', filterData);
        try {
            const response = await axiosInstance.get('/api/v1/hsd/search/payment-details', {
                params: filterData
            });
            if (!response.data.success) {
                setTableData([]);
                alert('No data found for the given filters.');
                return;
            }
            setTableData(response.data.data || []);
        } catch (error) {
            setTableData([]);
        }
    };

    // Clear button handler
    const handleClear = () => {
        setFilters({
            petrolPump: '',
            paidFrom: '',
            paidTo: '',
            orderBy: 'pump'
        });
        setTableData([]);
    };

    // Excel export handler (.xlsx)
    const handleExcel = () => {
        if (!tableData || tableData.length === 0) {
            alert('No data to export!');
            return;
        }
        // Prepare worksheet data
        const wsData = [
            ['SLNo', 'Petrol Pump Name', 'Payment Date', 'Paid Amount', 'Payment Mode', 'Details'],
            ...tableData.map((row, idx) => [
                idx + 1,
                row.petrolPump,
                row.paymentDate,
                row.paidAmount,
                row.paymentMode,
                row.voucherNumber
            ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PaymentDetails');
        XLSX.writeFile(wb, 'hsd_payment_details.xlsx');
    };

    return (
        <div className="container mt-3">
            <h5 className="mb-3">Payment Details</h5>
            {/* Filter Row */}
            <div className="row align-items-end mb-3 g-2">
                <div className="col-md-3">
                    <label className="form-label">Petrol Pump</label>

                    {allFillingStationsName ?
                        <select
                            className="form-select form-select-sm"
                            aria-label="Default select example"
                            name='petrolPump'
                            id='petrolPump'
                            value={filters.petrolPump}
                            onChange={handleFilterChange}
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
                    <label className="form-label">Paid From</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        name="paidFrom"
                        value={filters.paidFrom}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Paid To</label>
                    <input
                        type="date"
                        className="form-control form-control-sm"
                        name="paidTo"
                        value={filters.paidTo}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="col-md-2">
                    <label className="form-label">Order By</label>
                    <select
                        className="form-select form-select-sm"
                        name="orderBy"
                        value={filters.orderBy}
                        onChange={handleFilterChange}
                    >
                        <option value="pump">Petrol Pump Name</option>
                        <option value="date">Payment Date</option>
                    </select>
                </div>
                <div className="col-md-1">
                    <button className="btn btn-primary btn-sm w-100" type="button" onClick={handleSearch}>Search</button>
                </div>
                <div className="col-md-1">
                    <button className="btn btn-success btn-sm w-100" type="button" onClick={handleExcel}>Excel</button>
                </div>
                <div className="col-md-1">
                    <button className="btn btn-secondary btn-sm w-100" type="button" onClick={handleClear}>Clear</button>
                </div>
            </div>
            {/*Horizontal Separator */}
            <div className="row">
                <div className="col">
                    <hr style={{
                        border: 'none',
                        borderTop: '3px solid #0d6efd',
                        margin: '10px 0 20px 0',
                        borderRadius: '2px',
                        boxShadow: '0 1px 2px rgba(13,110,253,0.15)'
                    }} />
                </div>
            </div>
            {/* Table */}
            <div className="table-responsive">
                <table className="table table-bordered table-hover table-sm align-middle">
                    <thead className="table-dark">
                        <tr className='text-center'>
                            <th>SLNo</th>
                            <th>Petrol Pump Name</th>
                            <th>Payment Date</th>
                            <th>Paid Amount</th>
                            <th>Payment Mode</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData ? tableData.map((row, idx) => (
                            <tr key={idx}>
                                <td className='text-center'>{idx + 1}</td>
                                <td>{row.petrolPump}</td>
                                <td>{row.paymentDate}</td>
                                <td>{row.paidAmount}</td>
                                <td>{row.paymentMode}</td>
                                <td>{row.voucherNumber}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PaymentDetails;
