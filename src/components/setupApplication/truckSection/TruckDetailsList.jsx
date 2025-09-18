import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosConfig";

const TruckDetailsList = () => {
    const [data, setData] = useState([]); // Holds API data
    const [page, setPage] = useState(0); // Current page
    const [size, setSize] = useState(10); // Page size
    const [totalPages, setTotalPages] = useState(0); // Total pages

    // Fetch data from the API
    const fetchChallanDetails = async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/get/all/truck-details-with-owner-name`, {
                params: { page, size }, // Pass page and size as query params
            });
            console.log(response.data);
            setData(response.data.content); // Update data
            setTotalPages(response.data.totalPages); // Update total pages
        } catch (error) {
            console.error("Error fetching challan details:", error);
        }
    };

    // Call API on component mount and when page/size changes
    useEffect(() => {
        fetchChallanDetails();
    }, [page, size]);

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    // Handle page size change
    const handleSizeChange = (e) => {
        setSize(parseInt(e.target.value));
        setPage(0); // Reset to first page
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3">Truck Details</h3>

            {/* Page Size Selector */}
            <div className="mb-3">
                <label>Records per page: </label>
                <select value={size} onChange={handleSizeChange} className="ms-2">
                    {[10, 25, 50, 100].map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table to display data */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Truck Number</th>
                        <th>Truck Wheel Type</th>
                        <th>RC Status</th>
                        <th>Owner Name</th>
                        <th>Token Number</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.truckNumber}</td>
                                <td>{item.truckType}</td>
                                <td>{item.rcStatus}</td>
                                <td>{item.ownerName}</td>
                                <td>{item.tokenNo}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" className="text-center">
                                No records found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-primary"
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>
                <span>
                    Page {page + 1} of {totalPages}
                </span>
                <button
                    className="btn btn-primary"
                    disabled={page === totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default TruckDetailsList;

