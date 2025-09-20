import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../config/AxiosConfig";

const TruckOwnerTable = () => {
    const [data, setData] = useState([]); // Holds API data
    const [page, setPage] = useState(0); // Current page
    const [size, setSize] = useState(10); // Page size
    const [totalPages, setTotalPages] = useState(0); // Total pages

    // Fetch data from the API
    const fetchChallanDetails = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/truck-owner/get-all?page=${page}&size=${size}`);
            console.log(response.data);
            setData(response.data.content || []); // Update data with fallback
            setTotalPages(response.data.totalPages || 0); // Update total pages with fallback
        } catch (error) {
            console.error("Error fetching challan details:", error);
            setData([]);
            setTotalPages(0);
        }
    }, [page, size]);

    // Call API on component mount and when page/size changes
    useEffect(() => {
        fetchChallanDetails();
    }, [fetchChallanDetails]);

    // Handle page change
    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
    }, []);

    // Handle page size change
    const handleSizeChange = useCallback((e) => {
        setSize(parseInt(e.target.value));
        setPage(0); // Reset to first page
    }, []);

    return (
        <div className='container-fluid'>
            <div className='row justify-content-center'>
                <div className='col-12 col-xl-11'>
                    <div className='card shadow-sm border-0'>
                        <div className='card-body p-4'>
                            {/* Header Section */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="card-title text-primary fw-bold mb-0">Truck Owner Details</h3>
                                
                                {/* Records per page selector */}
                                <div className="d-flex align-items-center gap-2">
                                    <label className="form-label fw-semibold mb-0">Records per page:</label>
                                    <select 
                                        value={size} 
                                        onChange={handleSizeChange} 
                                        className="form-select form-select-sm"
                                        style={{ width: 'auto' }}
                                    >
                                        {[10, 25, 50, 100].map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Table Section */}
                            <div className="table-responsive">
                                <table className="table table-striped table-hover table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th className="text-center">Challan Holder Name</th>
                                            <th className="text-center">PAN Number</th>
                                            <th className="text-center">Account Number</th>
                                            <th className="text-center">Bank Name</th>
                                            <th className="text-center">Branch</th>
                                            <th className="text-center">IFSC Code</th>
                                            <th className="text-center">Contact Number</th>
                                            <th className="text-center">Address</th>
                                            <th className="text-center">TDS Submission Date</th>
                                            <th className="text-center">Bank Account Status</th>
                                            <th className="text-center">TDS Ref Number</th>
                                            <th className="text-center">Total Trucks</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="fw-semibold">{item.truckOwnerName}</td>
                                                    <td className="text-center font-monospace">{item.panNumber}</td>
                                                    <td className="text-center font-monospace">{item.accountNumber}</td>
                                                    <td>{item.bankName}</td>
                                                    <td>{item.branch}</td>
                                                    <td className="text-center font-monospace">{item.ifscCode}</td>
                                                    <td className="text-center">{item.contactNumber}</td>
                                                    <td>{item.address}</td>
                                                    <td className="text-center">{item.tdsSubmissionDate || '-'}</td>
                                                    <td className="text-center">
                                                        <span className={`badge ${item.bankAccountStatus === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                            {item.bankAccountStatus || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">{item.docRefNo || '-'}</td>
                                                    <td className="text-center">
                                                        <span className="badge bg-primary">{item.totalNumberOfTrucks || 0}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="12" className="text-center py-4 text-muted">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <i className="bi bi-person-gear fs-1 text-muted mb-2"></i>
                                                        <span>No truck owner records found.</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Section */}
                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <button
                                    className="btn btn-outline-primary"
                                    disabled={page === 0}
                                    onClick={() => handlePageChange(page - 1)}
                                >
                                    <i className="bi bi-chevron-left me-1"></i>
                                    Previous
                                </button>
                                
                                <div className="d-flex align-items-center gap-3">
                                    <span className="fw-semibold text-muted">
                                        Page {page + 1} of {totalPages}
                                    </span>
                                    {totalPages > 0 && (
                                        <span className="text-muted small">
                                            Showing {Math.min((page * size) + 1, data.length)} to {Math.min((page + 1) * size, data.length)} of {data.length} entries
                                        </span>
                                    )}
                                </div>
                                
                                <button
                                    className="btn btn-outline-primary"
                                    disabled={page === totalPages - 1}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    Next
                                    <i className="bi bi-chevron-right ms-1"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TruckOwnerTable;

