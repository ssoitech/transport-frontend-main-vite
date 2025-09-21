import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useApiQuery } from '../../../hooks/api/useApiQuery';
import ReusableForm from '../../reusable/ReusableForm';
import ReusableInput from '../../reusable/ReusableInput';
import ReusableButton from '../../reusable/ReusableButton';
import ReusableSelect from '../../reusable/ReusableSelect';
import ReusableDatePicker from '../../reusable/ReusableDatePicker';
import ReusableCard from '../../reusable/ReusableCard';
import ReusableLoader from '../../reusable/ReusableLoader';
import ReusableToast from '../../reusable/ReusableToast';
import ReusableTable from '../../reusable/ReusableTable';


/**
 * PaymentDetails - Refactored to use reusable components and React Query
 * - All form, input, select, button, datepicker, card, loader, toast, and table elements use reusable components
 * - API logic migrated to useApiQuery (React Query)
 * - Business logic preserved
 * - Detailed comments added
 */
function PaymentDetails() {
    // State for filters and table data
    const [filters, setFilters] = useState({
        petrolPump: '',
        paidFrom: '',
        paidTo: '',
        orderBy: 'pump',
    });
    const [tableData, setTableData] = useState([]);
    const [toast, setToast] = useState({ message: '', type: 'info' });

    // Fetch petrol pump options using React Query
    const {
        data: fillingStationsData,
        isLoading: isFillingStationsLoading,
        error: fillingStationsError,
    } = useApiQuery({
        key: 'filling-stations',
        url: '/api/v1/get/filling-stations',
        method: 'get',
        select: (data) =>
            Array.isArray(data)
                ? data.map((element) => ({ value: element[0], label: element[1] }))
                : [],
    });

    // Handle input changes for filters
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle Search button click
    const handleSearch = async () => {
        const filterData = {
            petrolPumpId: filters.petrolPump,
            startDate: filters.paidFrom,
            endDate: filters.paidTo,
            sortBy: filters.orderBy,
        };
        try {
            const response = await fetch(
                `/api/v1/hsd/search/payment-details?petrolPumpId=${filterData.petrolPumpId}&startDate=${filterData.startDate}&endDate=${filterData.endDate}&sortBy=${filterData.sortBy}`
            );
            const result = await response.json();
            if (!result.success) {
                setTableData([]);
                setToast({ message: 'No data found for the given filters.', type: 'warning' });
                return;
            }
            setTableData(result.data || []);
            } catch {
                setTableData([]);
                setToast({ message: 'Error fetching payment details.', type: 'error' });
            }
    };

    // Clear button handler
    const handleClear = () => {
        setFilters({
            petrolPump: '',
            paidFrom: '',
            paidTo: '',
            orderBy: 'pump',
        });
        setTableData([]);
    };

    // Excel export handler (.xlsx)
    const handleExcel = () => {
        if (!tableData || tableData.length === 0) {
            setToast({ message: 'No data to export!', type: 'warning' });
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
                row.voucherNumber,
            ]),
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PaymentDetails');
        XLSX.writeFile(wb, 'hsd_payment_details.xlsx');
        setToast({ message: 'Excel exported successfully!', type: 'success' });
    };

    // Table columns for ReusableTable
    const columns = [
        { header: 'SLNo', accessor: 'slno' },
        { header: 'Petrol Pump Name', accessor: 'petrolPump' },
        { header: 'Payment Date', accessor: 'paymentDate' },
        { header: 'Paid Amount', accessor: 'paidAmount' },
        { header: 'Payment Mode', accessor: 'paymentMode' },
        { header: 'Details', accessor: 'voucherNumber' },
    ];

    // Prepare table data with SLNo
    const tableRows = tableData.map((row, idx) => ({ ...row, slno: idx + 1 }));

    // Loader and error handling for filling stations
    if (isFillingStationsLoading) {
        return <ReusableLoader text="Loading petrol pumps..." />;
    }
    if (fillingStationsError) {
        return (
            <ReusableToast
                message={fillingStationsError?.message || 'Error loading petrol pumps.'}
                type="error"
                onClose={() => setToast({ message: '', type: 'info' })}
            />
        );
    }

    return (
        <div className="container mt-3">
            <ReusableCard title={<span className="mb-0 h6">Payment Details</span>}>
                {toast.message && (
                    <ReusableToast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast({ message: '', type: 'info' })}
                    />
                )}
                <ReusableForm onSubmit={(e) => e.preventDefault()} className="mb-3">
                    <div className="row align-items-end mb-3 g-2">
                        <div className="col-md-3">
                            <ReusableSelect
                                label="Petrol Pump"
                                name="petrolPump"
                                value={filters.petrolPump}
                                onChange={handleFilterChange}
                                options={fillingStationsData || []}
                                className="form-select form-select-sm"
                            />
                        </div>
                        <div className="col-md-2">
                            <ReusableDatePicker
                                label="Paid From"
                                name="paidFrom"
                                value={filters.paidFrom}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                            />
                        </div>
                        <div className="col-md-2">
                            <ReusableDatePicker
                                label="Paid To"
                                name="paidTo"
                                value={filters.paidTo}
                                onChange={handleFilterChange}
                                className="form-control form-control-sm"
                            />
                        </div>
                        <div className="col-md-2">
                            <ReusableSelect
                                label="Order By"
                                name="orderBy"
                                value={filters.orderBy}
                                onChange={handleFilterChange}
                                options={[{ value: 'pump', label: 'Petrol Pump Name' }, { value: 'date', label: 'Payment Date' }]}
                                className="form-select form-select-sm"
                            />
                        </div>
                        <div className="col-md-1">
                            <ReusableButton className="btn btn-primary btn-sm w-100" onClick={handleSearch}>
                                Search
                            </ReusableButton>
                        </div>
                        <div className="col-md-1">
                            <ReusableButton className="btn btn-success btn-sm w-100" onClick={handleExcel}>
                                Excel
                            </ReusableButton>
                        </div>
                        <div className="col-md-1">
                            <ReusableButton className="btn btn-secondary btn-sm w-100" onClick={handleClear}>
                                Clear
                            </ReusableButton>
                        </div>
                    </div>
                </ReusableForm>
                <hr style={{
                    border: 'none',
                    borderTop: '3px solid #0d6efd',
                    margin: '10px 0 20px 0',
                    borderRadius: '2px',
                    boxShadow: '0 1px 2px rgba(13,110,253,0.15)',
                }} />
                <div className="table-responsive">
                    <ReusableTable
                        columns={columns}
                        data={tableRows}
                        className="table table-bordered table-hover table-sm align-middle"
                        ariaLabel="Payment Details Table"
                    />
                </div>
            </ReusableCard>
        </div>
    );
}

export default PaymentDetails;
