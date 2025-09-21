import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// Reusable components
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableTable from "../reusable/ReusableTable";
import ReusableCard from "../reusable/ReusableCard";
import ReusableLoader from "../reusable/ReusableLoader";
import ReusableToast from "../reusable/ReusableToast";
import ReusableSection from "../reusable/ReusableSection";
// React Query hooks
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";

function UploadAdvanceDataFromExcel() {
  // State for summary and preview (must be top-level)
  const [allFillingStationsName, setAllFillingStationsName] = useState([]);
  const [allBrokersName, setAllBrokersName] = useState([]);
  const [totalValidRecords, setTotalValidRecords] = useState(null);
  const [misMatchData, setMisMatchData] = useState(null);
  // Navigation
  const navigate = useNavigate();

  // State
  const [excelData, setExcelData] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);
  const [duplicateChallanNumbers, setDuplicateChallanNumbers] = useState(
    new Set()
  );
  const [duplicateTp, setDuplicateTp] = useState(new Set());
  const [finalValidRecords, setFinalValidRecords] = useState([]);

  // Access details via React Query (replaces Redux useSelector)
  const { data: accessDetails } = useApiQuery({
    key: "accessDetails",
    url: "/api/v1/get/access-details",
    method: "get",
    select: (data) => data,
  });

  useEffect(() => {
    if (accessDetails) {
      if (accessDetails.role !== "ADMIN") {
        if (accessDetails.role === "USER") {
          if (accessDetails.challanInputAccess !== "Y") {
            Swal.fire(
              "Error",
              "You don't have access to this section.",
              "error"
            );
            navigate("/work-space");
          }
        } else {
          Swal.fire("Error", "You don't have access to this section.", "error");
          navigate("/work-space");
        }
      }
    } else {
      Swal.fire("Error", "You don't have access to this section.", "error");
      navigate("/work-space");
    }
  }, [accessDetails, navigate]);

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

  const convertToJson = () => {
    setJsonData(excelData);
  };

  function formatExcelDate(excelDate) {
    let date;

    // 1. Check if it's a number (Excel serial date)
    if (!isNaN(excelDate) && Number(excelDate) > 10000) {
      date = new Date((excelDate - 25569) * 86400000); // Convert Excel serial to JS Date
    }
    // 2. Try parsing standard date formats
    else {
      date = new Date(excelDate);
    }

    // Validate if the date is valid
    if (isNaN(date.getTime())) {
      return null; // Handle invalid cases
    }

    // Convert to DD-MMM-YYYY format
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    return format(`${day}-${month}-${year}`, "yyyy-MM-dd");
  }

  function convertToDate(value) {
    return formatExcelDate(value);
  }

  // Fetch filling stations and brokers using React Query
  const { data: fillingStations } = useApiQuery({
    key: "fillingStations",
    url: "/api/v1/get/filling-stations",
    method: "get",
    select: (data) =>
      data.map((element) => ({ nameId: element[0], name: element[1] })),
  });
  const { data: brokers } = useApiQuery({
    key: "brokers",
    url: "/api/v1/get/all/fleet-agent-broker-master",
    method: "get",
    select: (data) => data,
  });

  useEffect(() => {
    if (fillingStations) setAllFillingStationsName(fillingStations);
    if (brokers) setAllBrokersName(brokers);
  }, [fillingStations, brokers]);

  useEffect(() => {
    if (jsonData) {
      const uniqueChallanNumbers = new Set();
      const uniqueTPNumbers = new Set();
      const duplicateChallans = new Set();
      const duplicateTPs = new Set();
      const matchedData = [];
      const unmatchedData = [];

      // Step 1: Convert jsonData to an array of objects
      const arrayOfObjects = jsonData.slice(1).map((innerArray, idx) => ({
        idx: idx,
        tpNumber: innerArray[1] || "",
        challanNumber: innerArray[2] || "",
        truckNumber: innerArray[3] || "",
        challanRate:
          isNaN(innerArray[4]) || innerArray[4] === "" || innerArray[4] === null
            ? 0
            : Number(innerArray[4]),
        cashAdvance:
          isNaN(innerArray[5]) || innerArray[5] === "" || innerArray[5] === null
            ? 0
            : Number(innerArray[5]),
        hsdAdvance:
          isNaN(innerArray[6]) || innerArray[6] === "" || innerArray[6] === null
            ? 0
            : Number(innerArray[6]),
        hsdSlip: innerArray[7] || "",
        petrolPump: innerArray[8] || "",
        driverCommission: innerArray[9] || "",
        agent: innerArray[10] || "",
        despatchDate: innerArray[11]
          ? format(convertToDate(innerArray[11]), "yyyy-MM-dd")
          : null,
        updatedBy: accessDetails.userId || null,
      }));

      // Step 2: Identify duplicates
      arrayOfObjects.forEach((record) => {
        const { tpNumber, challanNumber } = record;

        if (challanNumber) {
          if (uniqueChallanNumbers.has(challanNumber)) {
            duplicateChallans.add(challanNumber);
          } else {
            uniqueChallanNumbers.add(challanNumber);
          }
        }

        if (tpNumber) {
          if (uniqueTPNumbers.has(tpNumber)) {
            duplicateTPs.add(tpNumber);
          } else {
            uniqueTPNumbers.add(tpNumber);
          }
        }
      });

      // Step 3: Filter valid records (no duplicates, no mismatches)
      const filteredData = arrayOfObjects.filter((record) => {
        const isDuplicateChallan = duplicateChallans.has(record.challanNumber);
        const isDuplicateTP = duplicateTPs.has(record.tpNumber);

        // Match petrolPump name and agent
        const pumpMatch = allFillingStationsName.find(
          (p) => p.name === record.petrolPump
        );
        const agentMatch = allBrokersName.find((a) => a.name === record.agent);

        // If valid, attach IDs
        if (pumpMatch) record.petrolPumpId = pumpMatch.nameId;
        if (agentMatch) record.agentId = agentMatch.id;

        const isValid =
          !isDuplicateChallan && !isDuplicateTP && pumpMatch && agentMatch;

        if (isValid) {
          matchedData.push(record);
        } else {
          unmatchedData.push(record);
        }

        return isValid;
      });

      // Step 4: Update state
      setFormattedData(arrayOfObjects);
      setTotalValidRecords(matchedData);
      setMisMatchData(unmatchedData.length);
      setDuplicateChallanNumbers(duplicateChallans);
      setDuplicateTp(duplicateTPs);
      setFinalValidRecords(filteredData); // Final clean records
    }
  }, [jsonData]);

  // Upload advance data mutation (React Query)
  const uploadAdvanceDataMutation = useApiMutation({
    key: "uploadAdvanceData",
    url: "/api/v1/process/advance-data/from-excel",
    method: "post",
    onSuccess: (response) => {
      // Show modal with failed uploads
      if (response) {
        let tableRows = "";
        for (const [tpNumber, status] of Object.entries(response)) {
          tableRows += `
                        <tr>
                            <td>${tpNumber}</td>
                            <td>${status}</td>
                        </tr>
                    `;
        }
        Swal.fire({
          title: "Upload Failed for below TPs",
          icon: "success",
          html: `
                        <div style="max-height: 300px; overflow-y: auto; overflow-x: auto; border: 1px solid #ccc;">
                            <table border="1" style="width:100%; text-align:left; border-collapse: collapse;">
                                <thead>
                                    <tr>
                                        <th>TP Number</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRows}
                                </tbody>
                            </table>
                        </div>
                    `,
          showCloseButton: true,
        });
      }
    },
    onError: () => {
      Swal.fire("Error", "Failed to upload data.", "error");
    },
  });

  // Upload data handler
  const uploadData = () => {
    if (!finalValidRecords) return;
    uploadAdvanceDataMutation.mutate(finalValidRecords);
  };

  // New handler
  const handleNew = () => {
    window.location.reload();
  };

  // --- UI: Refactored to use reusable components and child components ---
  return (
    <ReusableSection className="work-space-container">
      <ReusableCard>
        <div className="text-center font-weight-bold text-dark p-2">
          <span className="mb-0 h6">
            Upload Advance Data From Excel Without Bank
          </span>
        </div>
        {/* File Upload Bar */}
        <div className="row">
          <div className="col-sm">
            <div className="input-group">
              <ReusableInput
                type="file"
                id="inputGroupFile04"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="form-control form-control-sm custom-border"
                aria-describedby="inputGroupFileAddon04"
                aria-label="Upload"
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
        </div>
        {/* Excel Summary Stats */}
        <div className="excelupload-third-container mt-2">
          <ReusableCard className="item">
            <ReusableInput
              label="Total uploaded Challan"
              type="number"
              id="totChl"
              value={
                jsonData ? (jsonData.length > 1 ? jsonData.length - 1 : 0) : ""
              }
              readOnly
              className="form-control-sm text-center border-dark-subtle"
            />
          </ReusableCard>
          <ReusableCard className="item">
            <ReusableInput
              label="Pump & Agent Mis-Match"
              type="number"
              id="mismatch"
              value={misMatchData ? misMatchData : ""}
              readOnly
              className="form-control-sm text-center border-dark-subtle bg-danger-subtle"
            />
          </ReusableCard>
          <ReusableCard className="item">
            <ReusableInput
              label="Duplicate Challan"
              type="number"
              id="duplicateValues"
              value={
                duplicateChallanNumbers ? duplicateChallanNumbers.size : ""
              }
              readOnly
              className="form-control-sm text-center border-dark-subtle bg-warning-subtle"
            />
          </ReusableCard>
          <ReusableCard className="item">
            <ReusableInput
              label="Duplicate TP"
              type="number"
              id="duplicateTp"
              value={duplicateTp ? duplicateTp.size : ""}
              readOnly
              className="form-control-sm text-center border-dark-subtle bg-warning-subtle"
            />
          </ReusableCard>
        </div>
        {/* Valid Challan Count & Action Buttons */}
        <div className="excelupload-third-container mt-2">
          <ReusableCard>
            <ReusableInput
              label="Total Valid Chl"
              type="number"
              id="totChl"
              value={totalValidRecords ? totalValidRecords.length : ""}
              readOnly
              className="form-control-sm text-center border-dark-subtle"
            />
          </ReusableCard>
          <div className="item">
            <ReusableButton
              type="button"
              variant="primary"
              size="sm"
              className="mt-4"
              disabled={uploadAdvanceDataMutation.isLoading}
              onClick={uploadData}
            >
              {uploadAdvanceDataMutation.isLoading ? (
                <>
                  <ReusableLoader size="sm" />
                  Uploading ...
                </>
              ) : (
                "Upload"
              )}
            </ReusableButton>
          </div>
          <div className="item">
            <ReusableButton
              type="button"
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={handleNew}
            >
              New
            </ReusableButton>
          </div>
        </div>
        {/* Excel Preview Table */}
        <div className="row overflow-auto">
          <div className="col-sm-6 mt-4">
            <div className="p-2">
              <ReusableTable
                columns={[
                  { Header: "SL No.", accessor: "slNo" },
                  {
                    Header: "TP Number",
                    accessor: "tpNumber",
                    cellClass: (item) =>
                      duplicateTp.has(item.tpNumber) ? "bg-warning-subtle" : "",
                  },
                  {
                    Header: "Challan Number",
                    accessor: "challanNumber",
                    cellClass: (item) =>
                      duplicateChallanNumbers.has(item.challanNumber)
                        ? "bg-warning-subtle"
                        : "",
                  },
                  { Header: "Truck Number", accessor: "truckNumber" },
                  { Header: "Challan Rate", accessor: "challanRate" },
                  { Header: "Cash Advance", accessor: "cashAdvance" },
                  { Header: "HSD Advance", accessor: "hsdAdvance" },
                  { Header: "HSD Slip", accessor: "hsdSlip" },
                  {
                    Header: "Petrol Pump",
                    accessor: "petrolPump",
                    cellClass: (item) =>
                      item.petrolPumpId ? "" : "bg-danger-subtle",
                  },
                  { Header: "Driver Commission", accessor: "driverCommission" },
                  {
                    Header: "Agent",
                    accessor: "agent",
                    cellClass: (item) =>
                      item.agentId ? "" : "bg-danger-subtle",
                  },
                  {
                    Header: "Despatch Date",
                    accessor: "despatchDate",
                    Cell: ({ value }) =>
                      value ? format(value, "dd-MMM-yyyy") : "",
                  },
                ]}
                data={
                  formattedData
                    ? formattedData.map((item, idx) => ({
                        ...item,
                        slNo: idx + 1,
                      }))
                    : []
                }
                className="table-sm table-striped table-bordered table-hover align-middle"
              />
            </div>
          </div>
        </div>
        {/* Toast notifications */}
        <ReusableToast position="bottom-center" reverseOrder={true} />
      </ReusableCard>
    </ReusableSection>
  );
}

export default UploadAdvanceDataFromExcel;
