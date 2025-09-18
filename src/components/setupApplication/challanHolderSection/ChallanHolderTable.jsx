import React, { useEffect, useState } from "react";
import axiosInstance from "../../../config/AxiosConfig";

const ChallanHolderTable = ({ stateValue }) => {
    const [data, setData] = useState([]); // Holds API data
    const [page, setPage] = useState(0); // Current page
    const [size, setSize] = useState(10); // Page size
    const [totalPages, setTotalPages] = useState(0); // Total pages

    // Fetch data from the API
    const fetchChallanDetails = async () => {
        try {
            const response = await axiosInstance.get(`/api/v1/challan-holder/get/all`, {
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
    }, [page, size, stateValue]);

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
            <h3 className="mb-3">Challan Holder Details</h3>

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
            <div className="table-responsive">

                <table className="table table-bordered mb-2">
                    <thead className="table-dark">
                        <tr>
                            <th>Challan Holder Name</th>
                            <th>Contact No</th>
                            <th>PAN Number</th>
                            <th>Account Number</th>
                            <th>Bank Name</th>
                            <th>IFSC Code</th>
                            <th>Bank Branch</th>
                            <th>Challan Holder Address</th>
                            <th>Payment Hold</th>
                            <th>Bank Account Status</th>
                            <th>Remark</th>
                            <th>Adhar Number</th>
                            <th>PAN Adhar Linked</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.challanHolderName}</td>
                                    <td>{item.contactNumber}</td>
                                    <td>{item.panNumber}</td>
                                    <td>{item.accountNumber}</td>
                                    <td>{item.bankName}</td>
                                    <td>{item.ifscCode}</td>
                                    <td>{item.branch}</td>
                                    <td>{item.address}</td>
                                    <td>{item.paymentHold}</td>
                                    <td>{item.bankAccountStatus}</td>
                                    <td>{item.remark}</td>
                                    <td>{item.adharNumber}</td>
                                    <td>{item.panAdharLinkStatus === "yes" ? "Yes" : "No"}</td>
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
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between mt-4">
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

export default ChallanHolderTable;

