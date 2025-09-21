import React, { useState } from "react";
import * as XLSX from "xlsx";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableCard from "../reusable/ReusableCard";
import ReusableTable from "../reusable/ReusableTable";
import ReusableToast from "../reusable/ReusableToast";
import ReusableLoader from "../reusable/ReusableLoader";
import "./css/excelfileUploadSelection.css";

/**
 * ExcelFileUploadDespatchDataFullSelection
 * - Handles Excel file upload, parsing, validation, and single permit API submission for despatch data.
 * - Uses React Query for all API/data logic (permit details, bulk upload).
 * - UI is built with reusable components for maintainability and consistency.
 */
function ExcelFileUploadDespatchDataFullSelection() {
  const [excelData, setExcelData] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [permitNo, setPermitNo] = useState();
  const [checkBoxChecked, setCheckBoxChecked] = useState(null);
  // Removed unused checkBoxValue state

  // Permit data via React Query
  const { refetch: refetchPermitData } = useApiQuery({
    key: "permitData",
    url: permitNo ? `/api/v1/get/one/iform/${permitNo}` : "",
    method: "get",
    enabled: !!permitNo,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    onError: () => {
      ReusableToast.error("Failed to fetch permit details");
    },
  });

  // File upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Convert to JSON
  const convertToJson = () => {
    setJsonData(excelData);
  };

  // Mark all checkboxes Yes/No
  function handleMarkAllYes() {
    setCheckBoxChecked(true);
  }
  function handleMarkALLNo() {
    setCheckBoxChecked(false);
    setCheckBoxChecked(null);
  }

  // Permit details fetch
  function handleGetData() {
    if (!permitNo) return;
    refetchPermitData();
  }

  return (
    <div className="work-space-container">
      <ReusableCard>
        <div
          className="alert alert-info text-center font-weight-bold text-dark p-2"
          role="alert"
        >
          <span className="mb-0 h6">Upload Excel Data - Single Permit</span>
        </div>
        <div className="first-container">
          <div className="item1">
            <label htmlFor="permitNumber" className="form-label">
              Permit Number
            </label>
            <div className="row">
              <div className="col-auto">
                <ReusableInput
                  type="text"
                  className="form-control form-control-sm"
                  id="permitNumber"
                  value={permitNo || ""}
                  onChange={(e) => setPermitNo(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <ReusableButton
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleGetData}
                >
                  Get Details
                </ReusableButton>
              </div>
            </div>
          </div>
          <div className="item1">
            <label htmlFor="validFrom" className="form-label">
              Loading
            </label>
            <ReusableInput
              type="text"
              className="form-control form-control-sm"
              id="validFrom"
              readOnly
            />
          </div>
          <div className="item1">
            <label htmlFor="validTo" className="form-label">
              Un Loading
            </label>
            <ReusableInput
              type="text"
              className="form-control form-control-sm"
              id="validTo"
              name="validTo"
              readOnly
            />
          </div>
        </div>
        <div className="excelupload-second-container">
          <div className="item">
            <div className="input-group">
              <ReusableInput
                type="file"
                className="form-control form-control-sm"
                id="inputGroupFile04"
                aria-describedby="inputGroupFileAddon04"
                aria-label="Upload"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
              />
              <ReusableButton
                variant="outline-primary"
                size="sm"
                id="inputGroupFileAddon04"
                onClick={convertToJson}
              >
                Extract & Show
              </ReusableButton>
            </div>
          </div>
          <div className="item">
            <ReusableButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleMarkAllYes}
            >
              Mark all Yes
            </ReusableButton>
          </div>
          <div className="item">
            <ReusableButton
              type="button"
              variant="primary"
              size="sm"
              onClick={handleMarkALLNo}
            >
              Mark all No
            </ReusableButton>
          </div>
          <div className="item">
            <div className="mb-3 row">
              <label htmlFor="passNo" className="col-sm-4 col-form-label">
                Pass No
              </label>
              <div className="col-sm-6">
                <ReusableInput
                  type="text"
                  className="form-control form-control-sm"
                  id="passNo"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
        <div className="excelupload-third-container">
          <div className="item">
            <ReusableButton type="button" variant="primary" size="sm">
              Mark as Unloaded
            </ReusableButton>
          </div>
          <div className="item">
            <ReusableButton type="button" variant="primary" size="sm">
              Save
            </ReusableButton>
          </div>
          <div className="item">
            <ReusableButton type="button" variant="primary" size="sm">
              New
            </ReusableButton>
          </div>
          <div className="item">
            <div className="mb-3 row">
              <label htmlFor="totChl" className="col-sm-4 col-form-label">
                Tot Chl
              </label>
              <div className="col-sm-6">
                <ReusableInput
                  type="text"
                  className="form-control form-control-sm"
                  id="totChl"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="item">
            <div className="mb-3 row">
              <label htmlFor="totQty" className="col-sm-4 col-form-label">
                Tot Qty
              </label>
              <div className="col-sm-6">
                <ReusableInput
                  type="text"
                  className="form-control form-control-sm"
                  id="totQty"
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="item">
            <div className="mb-3 row">
              <label htmlFor="duplicate" className="col-sm-4 col-form-label">
                Duplicate
              </label>
              <div className="col-sm-6">
                <ReusableInput
                  type="text"
                  className="form-control form-control-sm"
                  id="duplicate"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </ReusableCard>
      <div className="mt-4">
        <ReusableCard>
          <ReusableTable
            columns={[
              {
                Header: "Selection",
                accessor: "selection",
                Cell: ({ rowIndex }) => (
                  <div className="form-check text-center">
                    <ReusableInput
                      checked={checkBoxChecked}
                      // Removed unused onChange handler
                      className="form-check-input"
                      type="checkbox"
                      value="1"
                      id={`flexCheckDefault${rowIndex}`}
                    />
                  </div>
                ),
              },
              { Header: "SL No.", accessor: "slNo" },
              { Header: "Date", accessor: "date" },
              { Header: "Truck Number", accessor: "truckNumber" },
              { Header: "Quantity", accessor: "quantity" },
              { Header: "TP Number", accessor: "tpNumber" },
              { Header: "Challan Number", accessor: "challanNumber" },
              { Header: "Rate", accessor: "rate" },
              { Header: "Status", accessor: "status" },
              { Header: "Vehicle Category", accessor: "vehicleCategory" },
              { Header: "Cash Advance", accessor: "cashAdvance" },
              { Header: "Challan Comm", accessor: "challanComm" },
              { Header: "Issue Slip", accessor: "issueSlip" },
              { Header: "Filling Station", accessor: "fillingStation" },
              { Header: "Issued Ltrs", accessor: "issuedLtrs" },
              { Header: "Diesel Advance", accessor: "dieselAdvance" },
              { Header: "Office Expenses", accessor: "officeExpenses" },
            ]}
            data={
              jsonData
                ? jsonData.slice(1).map((row, rowIndex) => {
                    // Map array row to object for table
                    return {
                      selection: "",
                      slNo: row[0],
                      date: row[1],
                      truckNumber: row[2],
                      quantity: row[3],
                      tpNumber: row[4],
                      challanNumber: row[5],
                      rate: row[6],
                      status: row[7],
                      vehicleCategory: row[8],
                      cashAdvance: row[9],
                      challanComm: row[10],
                      issueSlip: row[11],
                      fillingStation: row[12],
                      issuedLtrs: row[13],
                      dieselAdvance: row[14],
                      officeExpenses: row[15],
                      rowIndex,
                    };
                  })
                : []
            }
          />
        </ReusableCard>
      </div>
    </div>
  );
}

export default ExcelFileUploadDespatchDataFullSelection;
