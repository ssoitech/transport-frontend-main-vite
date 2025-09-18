import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function BankAdvancePending() {
  ModuleRegistry.registerModules([AllCommunityModule]);
  const { register, handleSubmit, reset } = useForm();
  const [rowData, setRowData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const columnDefs = [
    {
      headerName: "Select",
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 100,
      cellClass: "border-cell text-center"
    },
    { headerName: "SL No", valueGetter: "node.rowIndex + 1", width: 80, cellClass: "border-cell text-center" },
    { headerName: "Challan Date", field: "challanDate", sortable: true, filter: true },
    { headerName: "Truck Number", field: "truckNumber" },
    { headerName: "TP Number", field: "tpNumber" },
    { headerName: "Freight Amt", field: "freightAmt" },
    { headerName: "Cash & HSD", field: "cashHsd" },
    { headerName: "Bank Advance", field: "bankAdvance", sortable: true, filter: true },
    { headerName: "Balance Due", field: "balanceDue" },
    { headerName: "Advance Percent", field: "advancePercent" },
    { headerName: "Bank Account Number", field: "bankAccountNumber" },
    { headerName: "IFSC", field: "ifsc" },
    { headerName: "Bank Name", field: "bankName" },
    { headerName: "Branch", field: "branch" },
    { headerName: "Owner Name", field: "ownerName", sortable: true, filter: true },
    { headerName: "PAN", field: "pan" },
    { headerName: "Contact Number", field: "contactNumber" },
    { headerName: "Bank Advance Note", field: "bankAdvanceNote" },
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
    }
  ];

  const onSubmit = async (data) => {
    const { despatchFrom, despatchTo } = data;
    try {
      // const response = await axios.get(
      //   `/api/despatch?from=${despatchFrom}&to=${despatchTo}`
      // );
      // setRowData(response.data);
      setRowData(rowDataSample);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleClear = () => {
    reset();
    setRowData([]);
  };

  const handleExcel = () => {
    if (gridApi) {
      const selectedData = gridApi.getSelectedRows();
      setSelectedRows(selectedData);
      console.log("Selected Data for Excel:", selectedData);
    }
  };

  const [gridApi, setGridApi] = useState(null);



  return (
    <div className='work-space-container'>
      <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
        <span className='mb-0 h6'>Bank Advance Pending</span>
      </div>
      <div>
        <div className="container-fluid mt-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-2 align-items-end mb-2">
              <div className="col-md-2 col-sm-6">
                <label className="form-label small">Despatch From</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  {...register("despatchFrom", { required: true })}
                />
              </div>
              <div className="col-md-2 col-sm-6">
                <label className="form-label small">Despatch To</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  {...register("despatchTo", { required: true })}
                />
              </div>
              <div className="col-md-1 col-4">
                <button type="submit" className="btn btn-sm btn-primary w-100">
                  Proceed
                </button>
              </div>
              <div className="col-md-1 col-4">
                <button type="button" className="btn btn-sm btn-secondary w-100" onClick={handleClear}>
                  Clear
                </button>
              </div>
              <div className="col-md-1 col-4">
                <button type="button" className="btn btn-sm btn-success w-100" onClick={handleExcel}>
                  Excel
                </button>
              </div>
              <div className="col-md-1 col-4">
                <input type="text" className="form-control form-control-sm" />
              </div>
              <div className="col-md-1 col-4">
                <input type="text" className="form-control form-control-sm" />
              </div>
              <div className="col-md-1 col-4">
                <input type="text" className="form-control form-control-sm" />
              </div>
            </div>
          </form>

          <hr />

          <div className="ag-theme-alpine" style={{ height: "1000px", width: "100%" }}>
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              pagination={true}
              domLayout="autoHeight" // Ensures the grid auto-sizes
              rowSelection="multiple"
              onGridReady={(params) => setGridApi(params.api)}

            />
          </div>
          {/* <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              domLayout="autoHeight" // Ensures the grid auto-sizes
              suppressClipboardApi={true} // Allows text selection
              onGridReady={(params) => setGridApi(params.api)}
            />
          </div> */}
        </div>

      </div>
    </div>
  )
}

export default BankAdvancePending
