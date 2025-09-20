import React, { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../../config/AxiosConfig";

const TruckDetailsList = () => {
    const [data, setData] = useState([]); // Holds API data
    const [page, setPage] = useState(0); // Current page
    const [size, setSize] = useState(10); // Page size
    const [totalPages, setTotalPages] = useState(0); // Total pages

    // Fetch data from the API
    const fetchChallanDetails = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/get/all/truck-details-with-owner-name`, {
                params: { page, size }, // Pass page and size as query params
            });
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
                                <h3 className="card-title text-primary fw-bold mb-0">All Truck Details</h3>
                                
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
                                            <th className="text-center">Truck Number</th>
                                            <th className="text-center">Truck Wheel Type</th>
                                            <th className="text-center">RC Status</th>
                                            <th className="text-center">Owner Name</th>
                                            <th className="text-center">Token Number</th>
                                            <th className="text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.length > 0 ? (
                                            data.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="fw-semibold">{item.truckNumber}</td>
                                                    <td className="text-center">{item.truckType} Wheel</td>
                                                    <td className="text-center">
                                                        <span className={`badge ${item.rcStatus === 'Y' ? 'bg-success' : 'bg-warning'}`}>
                                                            {item.rcStatus === 'Y' ? 'Submitted' : 'Not Submitted'}
                                                        </span>
                                                    </td>
                                                    <td>{item.ownerName}</td>
                                                    <td className="text-center">{item.tokenNo || '-'}</td>
                                                    <td className="text-center">
                                                        <span className={`badge ${item.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                            {item.status || 'Active'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    <div className="d-flex flex-column align-items-center">
                                                        <i className="bi bi-truck fs-1 text-muted mb-2"></i>
                                                        <span>No truck records found.</span>
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

export default TruckDetailsList;

