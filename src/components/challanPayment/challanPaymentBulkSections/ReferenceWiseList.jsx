import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import SelectedDataModal from './SelectedDataModal'; // Import the modal

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function ReferenceWiseList({ formValues }) {
    ModuleRegistry.registerModules([AllCommunityModule]);
    const { register, handleSubmit, reset } = useForm();
    const [rowData, setRowData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const columnDefs = [
        {
            headerName: "Select",
            checkboxSelection: true,
            headerCheckboxSelection: true,
            width: 100,
            cellClass: "border-cell text-center"
        },
        { headerName: "SL No", valueGetter: "node.rowIndex + 1", width: 80, cellClass: "border-cell text-center" },
        { headerName: "Owner/Discounter Name", field: "challanDate", sortable: true, filter: true },
        { headerName: "Permanent A/C No", field: "truckNumber" },
        { headerName: "Contact No", field: "tpNumber" },
        { headerName: "Received Date", field: "freightAmt" },
        { headerName: "Ref. No.", field: "cashHsd" },
        { headerName: "No. of TP", field: "bankAdvance", sortable: true, filter: true },
        { headerName: "Total Qty", field: "balanceDue" },
        { headerName: "Payable Amount", field: "advancePercent" },
        { headerName: "Total Amount", field: "bankAccountNumber" },
        { headerName: "TDS %", field: "ifsc" },
        { headerName: "TDS Amount", field: "bankName" },
        { headerName: "Challan Amount", field: "branch" },
        { headerName: "Collection Center", field: "ownerName", sortable: true, filter: true },
        { headerName: "Bank Name", field: "pan" },
        { headerName: "Bank Account No", field: "contactNumber" },
        { headerName: "IFSC", field: "bankAdvanceNote" },
        { headerName: "Branch Name", field: "bankAdvanceNote" },
        { headerName: "CC Amount", field: "bankAdvanceNote" },
        { headerName: "Payment Process", field: "bankAdvanceNote" },
        { headerName: "Entered By", field: "bankAdvanceNote" },
    ];

    const rowDataSample = [
        {
            slNo: 1,
            challanDate: "2025-04-01",
            truckNumber: "MH12AB1234",
            tpNumber: "TP001",
            freightAmt: 25000,
            cashHsd: 8000,
            bankAdvance: 10000,
            balanceDue: 7000,
            advancePercent: 60,
            bankAccountNumber: "123456789012",
            ifsc: "HDFC0001234",
            bankName: "HDFC Bank",
            branch: "Pune Main",
            ownerName: "Ravi Kumar",
            pan: "ABCDE1234F",
            contactNumber: "9876543210",
            bankAdvanceNote: "Advance cleared"
        },
        {
            slNo: 2,
            challanDate: "2025-04-03",
            truckNumber: "MH14CD5678",
            tpNumber: "TP002",
            freightAmt: 30000,
            cashHsd: 10000,
            bankAdvance: 12000,
            balanceDue: 8000,
            advancePercent: 66.7,
            bankAccountNumber: "987654321000",
            ifsc: "SBIN0005678",
            bankName: "State Bank of India",
            branch: "Mumbai Central",
            ownerName: "Anjali Mehta",
            pan: "XYZAB9876K",
            contactNumber: "9123456780",
            bankAdvanceNote: "Payment scheduled"
        },
        {
            slNo: 3,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 4,
            challanDate: "2025-04-06",
            truckNumber: "GJ01EF2222",
            tpNumber: "TP004",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 5,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 6,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 7,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 8,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 9,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 10,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 11,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 12,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 13,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 14,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        },
        {
            slNo: 15,
            challanDate: "2025-04-05",
            truckNumber: "GJ01EF1111",
            tpNumber: "TP003",
            freightAmt: 18000,
            cashHsd: 6000,
            bankAdvance: 9000,
            balanceDue: 3000,
            advancePercent: 83.3,
            bankAccountNumber: "111122223333",
            ifsc: "ICIC0001122",
            bankName: "ICICI Bank",
            branch: "Ahmedabad West",
            ownerName: "Suresh Patel",
            pan: "LMNOP1234Q",
            contactNumber: "9001234567",
            bankAdvanceNote: "Settled"
        }
    ];

    const onSubmit = async (data) => {
        setRowData(rowDataSample);
    };

    const handleClear = () => {
        reset();
        setRowData([]);
    };

    const [gridApi, setGridApi] = useState(null);

    const handleExcel = () => {
        if (gridApi) {
            const selectedData = gridApi.getSelectedRows();
            setSelectedRows(selectedData);
            setShowModal(true);
        }
    };

    const handleNext = () => {
        if (gridApi) {
            const selectedData = gridApi.getSelectedRows();
            setSelectedRows(selectedData);
            setShowModal(true);
        }
    };

    const onSelectionChanged = () => {
        if (gridApi) {
            const selectedRows = gridApi.getSelectedRows();
            setSelectedCount(selectedRows.length);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePrevious = () => {
        setShowModal(false);
    };

    const handleConfirm = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className="container-fluid mt-3">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-4 align-items-end mb-2">
                        <div className="col-md-1 col-4">
                            <button type="button" className="btn btn-sm btn-success w-100" onClick={handleExcel}>
                                Excel
                            </button>
                            <button type="button" className="btn btn-sm btn-success w-100" onClick={onSubmit}>
                                proceed
                            </button>
                        </div>
                        <div className="col-md-1 col-4">
                            <button type="button" className="btn btn-sm btn-primary w-100" onClick={handleClear}>
                                Import
                            </button>
                        </div>
                        <div className="col-md-1 col-4">
                            <button type="button" className="btn btn-sm btn-primary w-100" onClick={handleNext}>
                                Next
                            </button>
                        </div>
                        <div className="col-md-1 col-4">
                            <label htmlFor="selected" className='col-form-label col-form-label-sm'>Selected</label>
                            <input
                                id='selected'
                                type="text"
                                className="form-control form-control-sm"
                                value={selectedCount}
                                readOnly
                            />
                        </div>
                        <div className="col-md-1 col-4">
                            <label htmlFor="toPayable" className='col-form-label col-form-label-sm'>Tot.Payable</label>
                            <input id='toPayable' type="text" className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-1 col-4">
                            <label htmlFor="beneficiary" className='col-form-label col-form-label-sm'>Beneficiary</label>
                            <input id='beneficiary' type="text" className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-1 col-4">
                            <label htmlFor="reference" className='col-form-label col-form-label-sm'>Reference</label>
                            <input id='reference' type="text" className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-1 col-4">
                            <label htmlFor="challan" className='col-form-label col-form-label-sm'>Challan</label>
                            <input id='challan' type="text" className="form-control form-control-sm" />
                        </div>
                        <div className="col-md-1 col-6">
                            <label htmlFor="refTotal" className='col-form-label col-form-label-sm'>Ref.Total</label>
                            <input id='refTotal' type="text" className="form-control form-control-sm" />
                        </div>
                    </div>
                </form>
                <hr />
                <div className="ag-theme-alpine" style={{ height: "1000px", width: "100%" }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        pagination={true}
                        domLayout="autoHeight"
                        rowSelection="multiple"
                        onGridReady={(params) => setGridApi(params.api)}
                        onSelectionChanged={onSelectionChanged}
                    />
                </div>
            </div>
            <SelectedDataModal
                show={showModal}
                handleClose={handleCloseModal}
                selectedData={selectedRows}
                onConfirm={handleConfirm}
                onPrevious={handlePrevious}
            />
        </div>
    )
}

export default ReferenceWiseList;