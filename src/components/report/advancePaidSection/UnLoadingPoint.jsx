import React, { useState } from 'react'
import axiosInstance from '../../../config/AxiosConfig';
import { format } from 'date-fns';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast, Toaster } from 'react-hot-toast';
import PaginationComponent from '../../customComponents/PaginationComponent';

// needs to be changed
function UnLoadingPoint({ formData }) {
    const [searchedData, setSearchedData] = useState([]);

    const [totalNumberOfData, setTotalNumberOfData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValues, setInputValues] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isExportComplete, setIsExportComplete] = useState(false);
    const [excelBlob, setExcelBlob] = useState(null); // Store Excel file

    const [pageSize, setPageSize] = useState(10); // Default page size is 10


    async function getDataByPagenumber(fData, page) {
        await axiosInstance.post('/api/v1/report/find-permitwise-details',
            fData
        )
            .then(function (response) {
                // handle success
                console.log(response.data);
                // console.log(response.data.totalPages);
                setSearchedData(response.data.content);
                setTotalNumberOfData(response.data.totalElements);
                setTotalPages(response.data.totalPages); // Set the total pages
                setCurrentPage(page); // Set the current page

            })
            .catch(function (error) {
                // handle error
                console.log(error.response);

            });
    }

    async function postFilteredData(data, page) {

        const searchedData = {
            "loadDateStart": data.permitFromDate ? format(data.permitFromDate, 'yyyy-MM-dd') : null,
            "loadDateEnd": data.permitToDate ? format(data.permitToDate, 'yyyy-MM-dd') : null,
            "loadingPointId": data.loadingPointId ? data.loadingPointId : null,
            "destinationId": data.destinationId ? data.destinationId : null,
            "traderId": data.traderId ? data.traderId : null,
            "permitNumber": data.permitNumber ? data.permitNumber : null,
            "page": page,
            "size": pageSize,
        }

        setInputValues(searchedData);
        getDataByPagenumber(searchedData, page);
    }


    // Function to handle the 'Get' button click
    const handleGetClick = async () => {
        try {
            console.log(formData);
            await postFilteredData(formData, 0);

        } catch (error) {
            console.error('Error fetching data:', error);
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




    // Function to fetch all data in a single API call
    const fetchData = async () => {
        setLoading(true);
        setProgress(0);
        setIsExportComplete(false); // Reset state for new export

        try {
            // Simulate progress (just for user experience)
            const randomProgress = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
            setProgress(randomProgress);

            // Fetch all data in one API call

            await axiosInstance.post('/api/v1/report/find-permitwise-details-for-excel',
                inputValues
            )
                .then(function (response) {
                    // handle success
                    // Simulate more progress
                    const randomProgress = Math.floor(Math.random() * (99 - 60 + 1)) + 60;
                    setProgress(randomProgress);
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
        if (!inputValues) {

            return;
        }
        if (inputValues) {
            if (!inputValues.loadDateStart && !inputValues.loadDateEnd && !inputValues.loadingPointId && !inputValues.destinationId && !inputValues.traderId && !inputValues.permitNumber) {
                toast.error('Condition Not Given!!', {
                    position: "bottom-center",
                    style: {
                        background: "#b30000",
                        color: "#fff",
                    }
                });
                return;
            }
        }
        setShowModal(true); // Open modal
        fetchData(); // Start fetching data and exporting
    };

    // Function to handle the download button click
    const handleDownload = () => {
        if (excelBlob) {
            saveAs(excelBlob, "advance_paid_to_vehicle_permitwise.xlsx");
            setShowModal(false); // Close modal after download
            setExcelBlob(null); // Clear blob to free up memory
            setIsExportComplete(false); // Reset export state if needed
            setProgress(0); // Reset progress if needed
        }
    };

    // Function to handle modal close
    const handleCancel = () => {
        setShowModal(false);
        setProgress(0); // Reset progress when closed
    };

    return (
        <div>
            <div className="d-flex justify-content-start mb-3">
                <button className="btn btn-sm btn-primary me-4" onClick={handleGetClick}>
                    Get Data
                </button>
                <button className="btn btn-sm btn-success me-4" onClick={handleExportClick}>
                    Excel
                </button>
                <button className="btn btn-sm btn-info">
                    Summary
                </button>
            </div>
            <div>
                <h6> <span>Total Records : </span><span>{totalNumberOfData ? totalNumberOfData : 0}</span></h6>
            </div>
            <hr />

            <div className="container mt-4 table-responsive">
                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr className='text-center'>
                            <th className='p-1'>S.L No</th>
                            <th className='p-1'>Permit Number</th>
                            <th className='p-1'>Loading Point</th>
                            <th className='p-1'>Unloading Point</th>
                            <th className='p-1'>TP Count</th>
                            <th className='p-1'>Weight Sum</th>
                            <th className='p-1'>Cash Advance</th>
                            <th className='p-1'>Bank Advance</th>
                            <th className='p-1'>HSD Advance</th>
                            <th className='p-1'>Driver Welfare</th>
                            <th className='p-1'>Total Cash</th>
                        </tr>
                    </thead>
                    <tbody>
                        {searchedData ? (searchedData.length > 0 && searchedData.map((item, index) => (
                            <tr key={index}>
                                <td className='text-center'>{index + 1}</td>
                                <td>{item.permitNumber}</td>
                                <td>{item.loadingPoint}</td>
                                <td>{item.unloadingPoint}</td>
                                <td>{item.tpCount}</td>
                                <td>{item.weightSum ? parseFloat(item.weightSum).toFixed(3) : 0.000}</td>
                                <td>{item.cashAdvance ? parseFloat(item.cashAdvance).toFixed(2) : 0.00}</td>
                                <td>{item.bankAdvance ? parseFloat(item.bankAdvance).toFixed(2) : 0.00}</td>
                                <td>{item.hsdAdvance ? parseFloat(item.hsdAdvance).toFixed(2) : 0.00}</td>
                                <td>{item.driverWelfare ? parseFloat(item.driverWelfare).toFixed(2) : 0.00}</td>
                                <td>{item.totalCash ? parseFloat(item.totalCash).toFixed(2) : 0.00}</td>
                            </tr>
                        ))) : <p>No Records to Display.</p>
                        }
                    </tbody>
                </table>
            </div>



            {/* Page size dropdown */}
            <div className="d-flex justify-content-end mb-3">
                <label htmlFor="pageSize" className="form-label me-2 my-auto">
                    Records per page:
                </label>
                <select
                    id="pageSize"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }} // Adjust width to make it smaller
                >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                </select>
            </div>

            <div className='mt-2'>
                {/* Render the pagination component */}
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />

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
                                    {isExportComplete ? (
                                        <p>Data exported successfully!</p>
                                    ) : (
                                        <p>Preparing to export...</p>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={handleDownload}
                                disabled={!isExportComplete}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* modal end */}
            <Toaster
                position="bottom-center"
                reverseOrder={true}
            />
        </div>
    )
}

export default UnLoadingPoint


