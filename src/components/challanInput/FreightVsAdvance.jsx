import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "../../config/AxiosConfig";
import PaginationComponent from "../customComponents/PaginationComponent";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';


function FreightVsAdvance() {
    ModuleRegistry.registerModules([AllCommunityModule]);

    const { register, handleSubmit, setValue, control } = useForm();
    const [searchedData, setSearchedData] = useState([]);

    const [rowData, setRowData] = useState([]);
    const [noDataFound, setNoDataFound] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [progress, setProgress] = useState(0);

    const [consignorOptions, setConsignorOptions] = useState([]);
    const [consigneeOptions, setConsigneeOptions] = useState([]);
    const [billToOptions, setBillToOptions] = useState([]);
    const [loadingPointOptions, setLoadingPointOptions] = useState([]);
    const [destinationOptions, setDestinationOptions] = useState([]);

    const [formData, setFormData] = useState();
    const [totalNumberOfData, setTotalNumberOfData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValues, setInputValues] = useState({});

    // const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [progress, setProgress] = useState(0);
    const [isExportComplete, setIsExportComplete] = useState(false);
    const [excelBlob, setExcelBlob] = useState(null); // Store Excel file

    const [pageSize, setPageSize] = useState(10); // Default page size is 10

    useEffect(() => {
        const fetchSelectOptions = async () => {
            try {
                const consignorRes = await axiosInstance.get(
                    "/api/v1/get/all/trader-billing-party-names"
                );
                const consignorArrayOfObjects = consignorRes.data.map((element) => {
                    return {
                        id: element[0],
                        name: element[1],
                    };
                });
                setConsignorOptions(consignorArrayOfObjects);
                const consigneeRes = await axiosInstance.get(
                    "/api/v1/get/all/trader-billing-party-names"
                );
                const consigneeArrayOfObjects = consigneeRes.data.map((element) => {
                    return {
                        id: element[0],
                        name: element[1],
                    };
                });
                setConsigneeOptions(consigneeArrayOfObjects);
                const billToRes = await axiosInstance.get(
                    "/api/v1/get/all/trader-billing-party-names"
                );
                const billToArrayOfObjects = billToRes.data.map((element) => {
                    return {
                        id: element[0],
                        name: element[1],
                    };
                });
                setBillToOptions(billToArrayOfObjects);

                const loadingPointRes = await axiosInstance.get(
                    "/api/v1/get/all/loading-point-names"
                );
                const loadingPointResArrayOfObjects = loadingPointRes.data.map(
                    (element) => {
                        return {
                            id: element[0],
                            name: element[1],
                        };
                    }
                );
                setLoadingPointOptions(loadingPointResArrayOfObjects);
                const destinationRes = await axiosInstance.get(
                    "/api/v1/get/all/unloading-point-names"
                );

                const destinationResArrayOfObjects = destinationRes.data.map(
                    (element) => {
                        return {
                            id: element[0],
                            name: element[1],
                        };
                    }
                );
                setDestinationOptions(destinationResArrayOfObjects);
            } catch (error) {
                console.error("Error loading options:", error);
            }
        };

        fetchSelectOptions();
    }, []);




    async function postFilteredData(data) {

        const searchedData = {
            "consignor": data.consignor ? data.consignor : null,
            "consignee": data.consignee ? data.consignee : null,
            "billTo": data.billTo ? data.billTo : null,
            "loadingPointId": data.loadingPoint ? data.loadingPoint : null,
            "destinationId": data.destination ? data.destination : null,
            "startDate": data.loadingFromDate ? format(data.loadingFromDate, 'yyyy-MM-dd') : null,
            "endDate": data.loadingToDate ? format(data.loadingToDate, 'yyyy-MM-dd') : null,
            "permitNo": data.permitNo ? data.permitNo : null,
        }

        setFormData(searchedData);

        await axiosInstance.post('/api/v1/search/frieght-vs-advance',
            searchedData
        )
            .then(function (response) {
                // handle success
                console.log(response.data);
                if (!response.data) {
                    setNoDataFound("No Data Found!!");
                } else {
                    setRowData(response.data);
                }

            })
            .catch(function (error) {
                // handle error
                setNoDataFound("Some Error Occured While Searching Data !!");
                console.log(error.response);

            });
    }



    const onSubmit = async (data) => {
        try {

            setInputValues(data); // Store the input values for pagination
            await postFilteredData(data, 0);

        } catch (error) {
            console.error("Error fetching report data:", error);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        postFilteredData(inputValues, page); // Fetch data for the selected page
    };

    // Handler for changing page size
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value);
        setPageSize(newSize);
        // postFilteredData(inputValues, 0); // Re-fetch data with new page size, starting from page 0
    };
    // ---  excel  --------------------------------------------------

    // Function to fetch all data in a single API call
    const fetchData = async () => {
        setLoading(true);
        setProgress(0);
        setIsExportComplete(false); // Reset state for new export

        try {
            // Simulate progress (just for user experience)
            setProgress(30);

            // set the conditions
            if (!formData) {

                return;
            }

            // Fetch all data in one API call

            await axiosInstance.post('/api/v1/find-daily-report-for-excel',
                formData
            )
                .then(function (response) {
                    // handle success
                    // Simulate more progress
                    setProgress(70);
                    // Once data is fetched, export to Excel
                    exportDataToExcel(response.data);

                })
                .catch(function (error) {
                    // handle error
                    console.log(error.response);

                });

            setProgress(100); // Set progress to 100% when done
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };


    // Function to format header keys from camelCase to "Title Case"
    const formatHeader = (header) => {
        return header
            .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
            .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
            .trim(); // Remove any leading or trailing spaces
    };

    // Function to export the data to Excel
    const exportDataToExcel = async (allData) => {
        if (allData.length === 0) return;

        const rawHeaders = Object.keys(allData[0]);
        const headers = rawHeaders.map(formatHeader); // Convert 'truckNumber' to 'Truck Number'

        // Step 1: Create a worksheet with the data
        const worksheet = XLSX.utils.json_to_sheet(allData, { header: rawHeaders });

        // Step 2: Add company name and fetched date at the top of the sheet, ensuring it does not overwrite data
        XLSX.utils.sheet_add_aoa(worksheet, [["Your Company Name"]], { origin: "A1" }); // Company name at A1
        XLSX.utils.sheet_add_aoa(worksheet, [["Fetched Date: " + new Date().toLocaleDateString()]], { origin: "A2" }); // Fetched date at A2

        // Step 3: Add formatted headers starting from row 4 (index 3) to leave space for custom rows
        XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A3" }); // Data headers at row 4

        // Step 4: Insert data starting from row 5 (index 4), after headers
        XLSX.utils.sheet_add_json(worksheet, allData, { origin: "A4", skipHeader: true }); // Data starts from row 5


        // Merge the cells for titles (company name and date)

        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
        ];


        // Step 6: Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        // Step 7: Generate the Excel file and create a blob
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

        // Use Promise.resolve to ensure state updates are batched
        await Promise.resolve();

        // Step 8: Set the blob for download and mark the export as complete
        setExcelBlob(blob);
        setIsExportComplete(true);
        setLoading(false); // Stop loading after Excel generation 

    };

    const handleExportClick = () => {
        if (!formData) {
            return;
        }
        setShowModal(true); // Open modal
        fetchData(); // Start fetching data and exporting
    };
    // --------- excel end --------------------------------------------------
    // Function to handle the download button click






    const columnDefs = [
        { headerName: "Sl No", valueGetter: "node.rowIndex + 1", sortable: true, width: 100 },
        { headerName: "Challan No.", field: "challanNumber", sortable: true, filter: true },
        { headerName: "Challan Date", field: "challanDate", sortable: true, filter: true },
        { headerName: "TP Number", field: "tpNumber", sortable: true, filter: true },
        { headerName: "Truck Number", field: "truckNumber", sortable: true, filter: true },
        { headerName: "Load Qty", field: "loadWeight", sortable: true },
        { headerName: "Rate", field: "vehicleRate", sortable: true },
        { headerName: "Freight", field: "freight", sortable: true },
        { headerName: "Cash Adv.", field: "cashAdvance", sortable: true },
        { headerName: "Bank Adv.", field: "bankAdvance", sortable: true },
        { headerName: "HSD Adv.", field: "hsdAdvance", sortable: true },
        { headerName: "Total Adv.", field: "totalAdvance", sortable: true },
        { headerName: "Balance", field: "balance", sortable: true },
        { headerName: "Status", field: "challanStatus", sortable: true },
        { headerName: "Truck Owner Name", field: "truckOwner", sortable: true },
        { headerName: "PAN", field: "truckOwnerPanNumber", sortable: true },
        { headerName: "Contact No", field: "truckOwnerContactNumber", sortable: true },
        { headerName: "Bank Account Number", field: "accountNumber", sortable: true },
        { headerName: "IFSC", field: "ifscCode", sortable: true },
        { headerName: "Consignor", field: "consignorName", sortable: true, filter: true },
        { headerName: "Consignee", field: "exporterName", sortable: true, filter: true },
        { headerName: "Billing Party", field: "traderName", sortable: true, filter: true },
        { headerName: "Loading Point", field: "loadingPoint", sortable: true, filter: true },
        { headerName: "Unloading Point", field: "unloadingPoint", sortable: true, filter: true },
    ];





    const exportToExcel = async () => {
        setShowModal(true);
        setLoading(true);
        setProgress(10);

        const worksheet = XLSX.utils.json_to_sheet(rowData, { origin: "A4" });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        setProgress(40);

        // Format headers (bold, italic, center align)
        const headerRow = Object.keys(rowData[0]);
        headerRow.forEach((col, index) => {
            const cellRef = XLSX.utils.encode_cell({ r: 3, c: index });
            if (!worksheet[cellRef]) return;
            worksheet[cellRef].s = {
                font: { bold: true, italic: true },
                alignment: { horizontal: "center" },
            };
        });

        setProgress(60);

        // Add Company Name & Extraction Date at the top
        const companyName = "XYZ Pvt Ltd";
        const extractedDate = `Extracted on: ${new Date().toLocaleDateString()}`;
        worksheet["A1"] = { v: companyName, s: { font: { bold: true, sz: 16 }, alignment: { horizontal: "center" } } };
        worksheet["A2"] = { v: extractedDate, s: { font: { italic: true, sz: 12 }, alignment: { horizontal: "center" } } };

        const lastColumn = XLSX.utils.encode_col(headerRow.length - 1);
        worksheet["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: headerRow.length - 1 } },
            { s: { r: 1, c: 0 }, e: { r: 1, c: headerRow.length - 1 } },
        ];

        setProgress(80);

        // Auto-fit columns
        const columnWidths = headerRow.map((col) => ({ wch: col.length + 10 }));
        worksheet["!cols"] = columnWidths;

        setProgress(100);
        setLoading(false);
        setIsExportComplete(true);
    };

    const handleCancel = () => {
        setShowModal(false);
        setLoading(false);
        setIsExportComplete(false);
    };

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(rowData, { origin: "A4" });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "table_data.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setShowModal(false);
        setIsExportComplete(false);
    };



    return (
        <div className="work-space-container">
            <div
                className="alert alert-primary text-center font-weight-bold text-dark p-2"
                role="alert"
            >
                <span className="mb-0 h6">Freight Vs Advance</span>
            </div>


            <form
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <label htmlFor="billingParty">Consignor</label>
                        <select
                            {...register("consignor")}
                            className="form-select form-select-sm border-dark-subtle"
                        >
                            <option value="">Select All</option>
                            {consignorOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="billingParty">Consignee</label>
                        <select
                            {...register("consignee")}
                            className="form-select form-select-sm border-dark-subtle"
                        >
                            <option value="">Select All</option>
                            {consigneeOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="billingParty">Bill To</label>
                        <select
                            {...register("billTo")}
                            className="form-select form-select-sm border-dark-subtle"
                        >
                            <option value="">Select All</option>
                            {billToOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="loadingPoint">Loading</label>
                        <select
                            {...register("loadingPoint")}
                            className="form-select form-select-sm border-dark-subtle"
                        >
                            <option value="">Select All</option>
                            {loadingPointOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="destinationPoint">Unloading</label>
                        <select
                            {...register("destinationPoint")}
                            className="form-select form-select-sm border-dark-subtle"
                        >
                            <option value="">Select All</option>
                            {destinationOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <label htmlFor="permitNo">Permit No.</label>
                        <input
                            type="text"
                            className="form-control form-control-sm border-dark-subtle"
                            id="permitNo"
                            {...register("permitNo")}
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="reportDate">Loading Date</label>
                        <div className="d-flex flex-row justify-content-center">
                            <Controller
                                control={control}
                                name="loadingFromDate"
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        selected={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        dateFormat="d-MMM-yyyy"
                                        placeholderText="Select a date"
                                        className="date-picker-input w-100 pl-2"
                                    />
                                )}
                            />
                            <div className="mx-3">To</div>
                            <Controller
                                control={control}
                                name="loadingToDate"
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        selected={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        dateFormat="d-MMM-yyyy"
                                        placeholderText="Select a date"
                                        className="date-picker-input w-100 pl-2"

                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button type="submit" className="btn btn-sm btn-primary mt-4 ml-4">
                            Proceed
                        </button>
                        <button type="button" className="btn btn-sm btn-primary mt-4 ml-4"
                            onClick={exportToExcel}
                        >
                            Excel
                        </button>
                    </div>
                </div>
            </form>
            <hr />

            <div className="mx-auto mt-2">


                <div className="ag-theme-alpine" style={{ height: "500px", width: "100%" }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        pagination={true}
                        domLayout="autoHeight" // Ensures the grid auto-sizes
                        suppressClipboardApi={true} // Allows text selection
                    />
                </div>

            </div>
            {/* Modal */}
            <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1">
                <div className="modal-dialog modal-dialog-top-center">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Exporting Data</h5>
                            <button type="button" className="btn-close" onClick={handleCancel}></button>
                        </div>
                        <div className="modal-body">
                            {loading ? (
                                <>
                                    <p>Exporting data... Please wait.</p>
                                    <div className="progress">
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{ width: `${progress}%` }}
                                        >
                                            {progress}%
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {isExportComplete ? <p>Data exported successfully!</p> : <p>Preparing to export...</p>}
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="btn btn-success" onClick={handleDownload} disabled={!isExportComplete}>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default FreightVsAdvance;

