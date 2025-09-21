import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableButton from "../reusable/ReusableButton";
import ReusableInput from "../reusable/ReusableInput";
import ReusableCard from "../reusable/ReusableCard";
import ReusableTable from "../reusable/ReusableTable";
import ReusableToast from "../reusable/ReusableToast";
import ReusableLoader from "../reusable/ReusableLoader";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/**
 * ExcelFileUploadDespatchDataFull
 * - Handles Excel file upload, parsing, validation, and bulk API submission for despatch data.
 * - Uses React Query for all API/data logic (access details, passing weight, bulk upload).
 * - UI is built with reusable components for maintainability and consistency.
 */
function ExcelFileUploadDespatchDataFull() {
  // Access details via React Query (replaces Redux useSelector)
  const navigate = useNavigate();
  const { data: accessDetails } = useApiQuery({
    key: "accessDetails",
    url: "/api/v1/access-details",
    method: "get",
    enabled: true,
    staleTime: 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
  });

  // Passing weight data via React Query (not used, but kept for future use)
  // const { data: passingWeightData } = useApiQuery({
  //     key: 'passingWeight',
  //     url: '/api/v1/get/all-vehicle-passing-weight',
  //     method: 'get',
  //     enabled: true,
  //     select: d => d[0],
  // });

  // Removed duplicate excelData declaration
  const [excelData, setExcelData] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [totalQty, setTotalQty] = useState("");

  const [alreadyExistData] = useState(); // setAlreadyExistData not used
  const [duplicateDataIdxs, setDuplicateDataIdxs] = useState();

  const [unloadedMarked, setUnloadedMarked] = useState(false);
  const [finalData, setFinalData] = useState();

  const [startSpneer, setStartSpneer] = useState(false);
  const [markUnloadButtonDisabled, setMarkUnloadButtonDisabled] =
    useState(false);

  // Removed duplicate passingWeightData declaration

  const bottomRef = useRef(null);

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

    return `${day}-${month}-${year}`;
  }

  const convertToDate = React.useCallback((value) => {
    return formatExcelDate(value);
  }, []);

  // API mutation for bulk challan upload using React Query
  const bulkChallanMutation = useApiMutation({
    key: "bulkChallanUpload",
    url: "/api/v1/add/bulk/challans",
    method: "post",
    onSuccess: () => {
      // Success toast
      ReusableToast.success("Successfully Saved!", {
        position: "bottom-center",
        style: { background: "green", color: "#fff" },
      });
      setStartSpneer(false);
      setUnloadedMarked(false);
    },
    onError: () => {
      // Error toast
      ReusableToast.error("Something Went Wrong!");
      setStartSpneer(false);
      setUnloadedMarked(false);
    },
  });

  // Upload data handler using React Query mutation
  const uploadData = async () => {
    setStartSpneer(true);
    let payload;
    if (unloadedMarked) {
      payload = finalData;
    } else {
      payload = jsonData.slice(1).map((innerArray) => ({
        permitNumber: innerArray[1].split("/")[0],
        tpNumber: innerArray[1],
        loadDate: format(convertToDate(innerArray[2]), "yyyy-MM-dd"),
        truckNumber: innerArray[3],
        loadWeight: innerArray[4],
        status: "transit",
        createdBy: accessDetails?.userId || null,
      }));
      if (duplicateDataIdxs.length >= 1) {
        duplicateDataIdxs.sort((a, b) => b - a);
        duplicateDataIdxs.forEach((index) => {
          if (index >= 0 && index < payload.length) {
            payload.splice(index, 1);
          }
        });
      }
    }
    bulkChallanMutation.mutate(payload);
  };

  // Mark as Unload handler
  const markAsUnLoad = () => {
    setMarkUnloadButtonDisabled(true);
    try {
      const arrayOfObjects = jsonData.slice(1).map((innerArray) => ({
        permitNumber: innerArray[1].split("/")[0],
        tpNumber: innerArray[1],
        loadDate: format(convertToDate(innerArray[2]), "yyyy-MM-dd"),
        truckNumber: innerArray[3],
        loadWeight: innerArray[4],
        status: "unloaded",
        unloadDate: format(convertToDate(innerArray[2]), "yyyy-MM-dd"),
        unloadTruck: innerArray[3],
        netUnloaded: innerArray[4],
        createdBy: accessDetails?.userId || null,
      }));
      if (duplicateDataIdxs.length >= 1) {
        duplicateDataIdxs.sort((a, b) => b - a);
        duplicateDataIdxs.forEach((index) => {
          if (index >= 0 && index < arrayOfObjects.length) {
            arrayOfObjects.splice(index, 1);
          }
        });
      }
      setFinalData(arrayOfObjects);
      setUnloadedMarked(true);
      setMarkUnloadButtonDisabled(false);
      ReusableToast.success("All are Marked as Unloaded.");
    } catch {
      setMarkUnloadButtonDisabled(false);
      setUnloadedMarked(false);
      ReusableToast.error("Some error occurred!");
    }
  };

  useEffect(() => {
    if (jsonData) {
      const arrayOfObjects = jsonData.slice(1).map((innerArray, idx) => {
        return {
          idx: idx,
          slNo: innerArray[0],
          tpNumber: innerArray[1],
          loadDate: format(convertToDate(innerArray[2]), "d-MMM-yyyy"),
          truckNo: innerArray[3],
          qty: innerArray[4],
        };
      });
      setFormattedData(arrayOfObjects);
      setDuplicateValues(findDuplicateTpNumbers(arrayOfObjects));
      setTotalQty(calculateTotalQty(arrayOfObjects));
    }
  }, [jsonData, convertToDate]);

  const findDuplicateTpNumbers = (arr) => {
    const tpNumberCounts = {}; // Object to store counts of each tpNumber
    const duplicates = [];
    const duplicateIdx = [];

    // Iterate over the array of objects
    arr.forEach((obj) => {
      const tpNumber = obj.tpNumber;

      // If tpNumber is already encountered, add it to duplicates
      if (tpNumberCounts[tpNumber]) {
        duplicates.push(tpNumber);
        duplicateIdx.push(obj.idx);
      } else {
        tpNumberCounts[tpNumber] = 1; // First occurrence
      }
    });

    setDuplicateDataIdxs(duplicateIdx);

    return duplicates;
  };

  const calculateTotalQty = (arr) => {
    let totalQty = 0;
    arr.forEach((obj) => {
      totalQty += Number(obj.qty);
    });

    return parseFloat(totalQty.toFixed(2));
  };

  return (
    <div className="work-space-container">
      <div
        className="alert alert-primary text-center font-weight-bold text-dark p-2"
        role="alert"
      >
        <span className="mb-0 h6">Upload Excel Data - Multiple Permit</span>
      </div>
      <div className="row">
        <div className="col-sm">
          <div className="input-group">
            <ReusableInput
              type="file"
              className="form-control form-control-sm custom-border"
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
        <div className="col-sm"></div>
      </div>
      <div className="excelupload-third-container mt-2">
        <div className="item">
          <ReusableButton
            type="button"
            variant="primary"
            size="sm"
            disabled={markUnloadButtonDisabled}
            onClick={markAsUnLoad}
          >
            Mark as Unloaded
          </ReusableButton>
        </div>
        <div className="item">
          <ReusableButton
            type="button"
            variant="primary"
            size="sm"
            onClick={uploadData}
          >
            {startSpneer && <ReusableLoader size="sm" color="light" />}
            <span>Save</span>
          </ReusableButton>
        </div>
        <div className="item">
          <ReusableButton type="button" variant="primary" size="sm">
            New
          </ReusableButton>
        </div>
        <div className="item">
          <div className="row">
            <label htmlFor="totChl" className="col-sm-4 col-form-label">
              Tot Chl
            </label>
            <div className="col-sm-6">
              <ReusableInput
                type="text"
                className="form-control form-control-sm custom-border"
                id="totChl"
                value={formattedData ? formattedData.length : ""}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="item">
          <div className="row">
            <label htmlFor="totalQty" className="col-sm-4 col-form-label">
              Tot Qty
            </label>
            <div className="col-sm-6">
              <ReusableInput
                type="text"
                className="form-control form-control-sm custom-border"
                value={totalQty ? totalQty : ""}
                id="totalQty"
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="item">
          <div className="row">
            <label
              htmlFor="duplicateValues"
              className="col-sm-4 col-form-label"
            >
              Duplicate
            </label>
            <div className="col-sm-6">
              <ReusableInput
                type="text"
                className="form-control form-control-sm custom-border"
                id="duplicateValues"
                value={duplicateValues ? duplicateValues.length : ""}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      <div className="row overflow-auto">
        <div className="col-sm-6 mt-4">
          <ReusableCard>
            <ReusableTable
              columns={[
                { Header: "SL No.", accessor: "slNo" },
                { Header: "Permit No.", accessor: "tpNumber" },
                { Header: "Date", accessor: "loadDate" },
                { Header: "Truck Number", accessor: "truckNo" },
                { Header: "Quantity", accessor: "qty" },
              ]}
              data={formattedData || []}
              rowClassName={(row) =>
                duplicateValues.includes(row.tpNumber)
                  ? "bg-danger text-light"
                  : ""
              }
            />
          </ReusableCard>
          <div ref={bottomRef} className="mt-5">
            {alreadyExistData && (
              <ReusableCard>
                <h3 className="m-4">Below records are already exist.</h3>
                <ReusableTable
                  columns={[
                    { Header: "SL No.", accessor: "slNo" },
                    { Header: "Permit No.", accessor: "tpNumber" },
                    { Header: "Date", accessor: "loadDate" },
                    { Header: "Truck Number", accessor: "truckNumber" },
                    { Header: "Quantity", accessor: "loadWeight" },
                  ]}
                  data={alreadyExistData || []}
                />
              </ReusableCard>
            )}
          </div>
        </div>
        <div className="col-sm-6 mt-4">
          <ReusableCard>
            <ReusableTable
              columns={[
                { Header: "SL No.", accessor: "slNo" },
                { Header: "Date", accessor: "loadDate" },
                { Header: "Truck Number", accessor: "truckNo" },
                { Header: "Quantity", accessor: "qty" },
                { Header: "TP NO", accessor: "tpNumber" },
                { Header: "Rate", accessor: "rate" },
                { Header: "Status", accessor: "status" },
                { Header: "Vehicle Category", accessor: "vehicleCategory" },
                { Header: "Office Expenses", accessor: "officeExpenses" },
                { Header: "Permit Number", accessor: "permitNumber" },
                { Header: "Adv. input required", accessor: "advInputRequired" },
              ]}
              data={[]}
            />
          </ReusableCard>
        </div>
      </div>
      <ReusableToast position="bottom-center" reverseOrder={true} />
    </div>
  );
}

export default ExcelFileUploadDespatchDataFull;
