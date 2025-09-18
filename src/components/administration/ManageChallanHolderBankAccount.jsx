import React, { useState, useEffect } from 'react';
import AutoComplete from '../searchComponent/AutoComplete';
import axiosInstance from '../../config/AxiosConfig';

function ManageChallanHolderBankAccount() {
    // const [bankData, setBankData] = useState();
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Fetch paginated data when the component is rendered or page changes
        const fetchChallanHolderDetails = async () => {
            setLoading(true);
            setError(null); // Reset error state before making a new request

            try {
                const response = await axiosInstance.get(
                    `/api/v1/challan-holder/account-details?page=${currentPage}&size=${pageSize}`
                ); // Dynamic pagination
                console.log(response.data.content)
                setData(response.data.content); // Assuming the backend sends paginated data in a 'content' field
                setTotalPages(response.data.totalPages); // Assuming 'totalPages' is returned in the response
            } catch (err) {
                // Handle error and set the error message
                setError(
                    err.response?.data?.error || "An error occurred while fetching data."
                );
            } finally {
                setLoading(false); // Stop loading state
            }
        };

        fetchChallanHolderDetails();
    }, [currentPage, pageSize]); // Refetch when currentPage or pageSize changes

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to the first page when page size changes
    };



    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Manage Beneficiary (Challan Holder) Bank Details</span>
            </div>
            <div className="container mt-3">
                <div className="row">
                    {/* First Input Field with Search Button */}
                    <div className="col-md-4">
                        <div className="mb-3">
                            <label htmlFor="input1" className="form-label">Enter Account Holder Name/PAN</label>
                            <div className="input-group">
                                <AutoComplete
                                    placeholder={"Search here"}
                                    url={'/api/v1/get/all/owner-names-pans?keyword='}
                                    datakey={"name"}
                                    customLoading={<>Loading..</>}
                                    // onSelect={(res) => setChallanHolderDetails(res)}
                                    onChange={(input) => { }}
                                    onBlur={(e) => { }}
                                    onFocus={(e) => { }}
                                    customStyles={{}}
                                />
                                <button className="btn btn-sm btn-primary ml-2" type="button">Search</button>
                            </div>
                        </div>
                    </div>

                    {/* Second Input Field */}
                    <div className="col-md-4">
                        <div className="mb-3">
                            <label htmlFor="panNumber" className="form-label">PAN Number</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                id="panNumber"
                            />
                        </div>
                    </div>

                    {/* Third Input Field */}
                    <div className="col-md-4">
                        <div className="mb-3">
                            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                id="contactNumber"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-3 p-3" style={{ backgroundColor: '#D6EFD8', border: '1px solid #4CAF50', borderRadius: '10px' }}>
                <div className="row">
                    {/* First Input Field */}
                    <div className="col-md-4 mb-3">
                        <label htmlFor="bankAcNo" className="form-label">Bank A/C No</label>
                        <input
                            type="text"
                            className="form-control form-control-sm border-dark-subtle"
                            id="bankAcNo"
                        />
                    </div>

                    {/* Second Input Field */}
                    <div className="col-md-4 mb-3">
                        <label htmlFor="ifscCode" className="form-label">IFSC Code</label>
                        <input type="text" className="form-control form-control-sm border-dark-subtle" id="ifscCode" />
                    </div>

                    {/* Third Input Field */}
                    <div className="col-md-4 mb-3">
                        <label htmlFor="bankName" className="form-label">Bank Name</label>
                        <input type="text" className="form-control form-control-sm border-dark-subtle" id="bankName" />
                    </div>
                </div>

                <div className="row">
                    {/* Fourth Input Field */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="branch" className="form-label">Branch</label>
                        <input type="text" className="form-control form-control-sm border-dark-subtle" id="branch" />
                    </div>

                    {/* Fifth Input Field (Select Box) */}
                    <div className="col-md-6 mb-3">
                        <label htmlFor="accountStatus" className="form-label">Select Account Status</label>
                        <select className="form-select form-select-sm border-dark-subtle" id="accountStatus">

                            <option defaultValue value="A">Running</option>
                            <option value="N">Not Running</option>

                        </select>
                    </div>
                </div>
            </div>

            <div className="container mt-3">
                <div className="row">
                    {/* First Button */}
                    <div className="col-md-2 col-sm-4 mb-2">
                        <button className="btn btn-sm btn-primary w-100">Add Account</button>
                    </div>

                    {/* Second Button */}
                    <div className="col-md-2 col-sm-4 mb-2">
                        <button className="btn btn-sm btn-warning w-100">Mark As Active</button>
                    </div>

                    {/* Third Button */}
                    <div className="col-md-2 col-sm-4 mb-2">
                        <button className="btn btn-sm btn-success w-100">Update</button>
                    </div>

                    {/* Fourth Button */}
                    <div className="col-md-2 col-sm-4 mb-2">
                        <button className="btn btn-sm btn-danger w-100">Remove</button>
                    </div>

                    {/* Fifth Button */}
                    <div className="col-md-2 col-sm-4 mb-2">
                        <button className="btn btn-sm btn-secondary w-100">Clear</button>
                    </div>
                </div>
            </div>

            {/* table */}

            <div className="container mt-3">

                {loading && <p className="text-info">Loading...</p>}

                {error && <p className="text-danger">Error: {error}</p>}

                {!loading && !error && (
                    <>
                        <div className="d-flex justify-content-between align-items-center my-3">
                            <div>
                                <label htmlFor="pageSize" className="me-2">
                                    Records per page:
                                </label>
                                <select
                                    id="pageSize"
                                    value={pageSize}
                                    onChange={handlePageSizeChange}
                                    className="form-select d-inline-block w-auto"
                                >
                                    {[5, 10, 25, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <p>
                                Page {currentPage} of {totalPages}
                            </p>
                        </div>
                        <div className='table-responsive'>


                            {data.length > 0 ? (
                                <table className="table table-bordered table-striped">
                                    <thead className="thead-dark text-center">
                                        <tr>
                                            <th scope="col">SL. NO</th>
                                            <th scope="col">Challan Holder Name</th>
                                            <th scope="col">PAN Number</th>
                                            <th scope="col">Bank Account Number</th>
                                            <th scope="col">IFSC Code</th>
                                            <th scope="col">Bank Name</th>
                                            <th scope="col">Branch Name</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, idx) => (
                                            <tr key={item.id}>
                                                <td>{idx + 1}</td>
                                                <td>{item.challan_holder_name}</td>
                                                <td>{item.pan_number}</td>
                                                <td>{item.account_number}</td>
                                                <td>{item.ifsc_code}</td>
                                                <td>{item.bank_name}</td>
                                                <td>{item.branch}</td>
                                                <td className="text-center">
                                                    <span className={`badge ${item.status === "A" ? "bg-success" : "bg-danger"}`}>
                                                        {item.status === "A" ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td className='text-center'>
                                                    <input type="checkbox" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-warning">No data available.</p>
                            )}

                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}

            </div>

            {/* table end */}



            <hr />

            <div className="container mt-3">
                <div className="row">
                    {/* First Input Field */}
                    <div className="col-md-3 mb-3">
                        <label htmlFor="createdBy" className="form-label">Created By</label>
                        <input type="text" className="form-control border-dark-subtle" id="createdBy" />
                    </div>

                    {/* Second Input Field */}
                    <div className="col-md-3 mb-3">
                        <label htmlFor="createdAt" className="form-label">Created At</label>
                        <input type="text" className="form-control border-dark-subtle" id="createdAt" />
                    </div>

                    {/* Third Input Field */}
                    <div className="col-md-3 mb-3">
                        <label htmlFor="updatedBy" className="form-label">Updated By</label>
                        <input type="text" className="form-control border-dark-subtle" id="updatedBy" />
                    </div>

                    {/* Fourth Input Field */}
                    <div className="col-md-3 mb-3">
                        <label htmlFor="updatedAt" className="form-label">Updated At</label>
                        <input type="text" className="form-control border-dark-subtle" id="updatedAt" />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ManageChallanHolderBankAccount;
