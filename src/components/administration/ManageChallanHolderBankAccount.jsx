import React, { useState } from "react";
// Reusable components for robust, maintainable UI
import AutoComplete from "../searchComponent/AutoComplete";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableInput from "../reusable/ReusableInput";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableButton from "../reusable/ReusableButton";
import ReusableTable from "../reusable/ReusableTable";
import ReusableLoader from "../reusable/ReusableLoader";

/**
 * ManageChallanHolderBankAccount Component
 * - Uses reusable components for all UI elements
 * - API data is fetched using generic useApiQuery hook (React Query)
 * - No direct axios or Redux logic
 * - SOLID/DRY principles, robust error handling, maintainable code
 * - Detailed comments for major functionalities
 */
function ManageChallanHolderBankAccount() {
  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch paginated data using generic React Query hook
  const {
    data: apiData,
    error,
    isLoading,
    // refetch, // Removed unused variable to resolve eslint error
  } = useApiQuery({
    key: "challan-holder-account-details",
    url: `/api/v1/challan-holder/account-details?page=${currentPage}&size=${pageSize}`,
    method: "get",
    enabled: true,
    select: (data) => ({
      content: data.content || [],
      totalPages: data.totalPages || 1,
    }),
    retry: 2,
    staleTime: 60000,
    cacheTime: 300000,
  });

  // Table columns definition for ReusableTable
  const columns = [
    { Header: "SL. NO", accessor: (row, idx) => idx + 1 },
    { Header: "Challan Holder Name", accessor: "challan_holder_name" },
    { Header: "PAN Number", accessor: "pan_number" },
    { Header: "Bank Account Number", accessor: "account_number" },
    { Header: "IFSC Code", accessor: "ifsc_code" },
    { Header: "Bank Name", accessor: "bank_name" },
    { Header: "Branch Name", accessor: "branch" },
    {
      Header: "Status",
      accessor: (row) => (
        <span
          className={`badge ${row.status === "A" ? "bg-success" : "bg-danger"}`}
        >
          {row.status === "A" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      Header: "Select",
      accessor: () => <input type="checkbox" />,
    },
  ];

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (apiData?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Main render
  return (
    <div className="work-space-container">
      {/* Header Section */}
      <div
        className="alert alert-primary text-center font-weight-bold text-dark p-1"
        role="alert"
      >
        <span className="mb-0 h6">
          Manage Beneficiary (Challan Holder) Bank Details
        </span>
      </div>

      {/* Search Section */}
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-4">
            <div className="mb-3">
              <label htmlFor="input1" className="form-label">
                Enter Account Holder Name/PAN
              </label>
              <div className="input-group">
                <AutoComplete
                  placeholder={"Search here"}
                  url={"/api/v1/get/all/owner-names-pans?keyword="}
                  datakey={"name"}
                  customLoading={<ReusableLoader />}
                  onChange={() => {}}
                  onBlur={() => {}}
                  onFocus={() => {}}
                  customStyles={{}}
                />
                <ReusableButton
                  label="Search"
                  size="sm"
                  variant="primary"
                  className="ml-2"
                />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <ReusableInput
              label="PAN Number"
              id="panNumber"
              size="sm"
              className="border-dark-subtle"
            />
          </div>
          <div className="col-md-4">
            <ReusableInput
              label="Contact Number"
              id="contactNumber"
              size="sm"
              className="border-dark-subtle"
            />
          </div>
        </div>
      </div>

      {/* Bank Details Section */}
      <div
        className="container mt-3 p-3"
        style={{
          backgroundColor: "#D6EFD8",
          border: "1px solid #4CAF50",
          borderRadius: "10px",
        }}
      >
        <div className="row">
          <div className="col-md-4 mb-3">
            <ReusableInput
              label="Bank A/C No"
              id="bankAcNo"
              size="sm"
              className="border-dark-subtle"
            />
          </div>
          <div className="col-md-4 mb-3">
            <ReusableInput
              label="IFSC Code"
              id="ifscCode"
              size="sm"
              className="border-dark-subtle"
            />
          </div>
          <div className="col-md-4 mb-3">
            <ReusableInput
              label="Bank Name"
              id="bankName"
              size="sm"
              className="border-dark-subtle"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <ReusableInput
              label="Branch"
              id="branch"
              size="sm"
              className="border-dark-subtle"
            />
          </div>
          <div className="col-md-6 mb-3">
            <ReusableSelect
              label="Select Account Status"
              id="accountStatus"
              options={[
                { label: "Running", value: "A" },
                { label: "Not Running", value: "N" },
              ]}
              size="sm"
              className="border-dark-subtle"
              defaultValue="A"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-2 col-sm-4 mb-2">
            <ReusableButton
              label="Add Account"
              size="sm"
              variant="primary"
              className="w-100"
            />
          </div>
          <div className="col-md-2 col-sm-4 mb-2">
            <ReusableButton
              label="Mark As Active"
              size="sm"
              variant="warning"
              className="w-100"
            />
          </div>
          <div className="col-md-2 col-sm-4 mb-2">
            <ReusableButton
              label="Update"
              size="sm"
              variant="success"
              className="w-100"
            />
          </div>
          <div className="col-md-2 col-sm-4 mb-2">
            <ReusableButton
              label="Remove"
              size="sm"
              variant="danger"
              className="w-100"
            />
          </div>
          <div className="col-md-2 col-sm-4 mb-2">
            <ReusableButton
              label="Clear"
              size="sm"
              variant="secondary"
              className="w-100"
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="container mt-3">
        {isLoading && <ReusableLoader />}
        {error && (
          <p className="text-danger">Error: {error.message || error}</p>
        )}
        {!isLoading && !error && (
          <>
            <div className="d-flex justify-content-between align-items-center my-3">
              <div>
                <label htmlFor="pageSize" className="me-2">
                  Records per page:
                </label>
                <ReusableSelect
                  id="pageSize"
                  options={[5, 10, 25, 50].map((size) => ({
                    label: String(size),
                    value: size,
                  }))}
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  size="sm"
                  className="d-inline-block w-auto"
                />
              </div>
              <p>
                Page {currentPage} of {apiData?.totalPages || 1}
              </p>
            </div>
            <div className="table-responsive">
              <ReusableTable
                columns={columns}
                data={apiData?.content || []}
                striped
                bordered
                responsive
                className="table table-bordered table-striped"
              />
              {(!apiData?.content || apiData.content.length === 0) && (
                <p className="text-warning">No data available.</p>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <ReusableButton
                label="Previous"
                size="sm"
                variant="primary"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              />
              <ReusableButton
                label="Next"
                size="sm"
                variant="primary"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === (apiData?.totalPages || 1)}
              />
            </div>
          </>
        )}
      </div>

      <hr />

      {/* Audit Info Section */}
      <div className="container mt-3">
        <div className="row">
          <div className="col-md-3 mb-3">
            <ReusableInput
              label="Created By"
              id="createdBy"
              className="border-dark-subtle"
            />
          </div>
          <div className="col-md-3 mb-3">
            <ReusableInput
              label="Created At"
              id="createdAt"
              className="border-dark-subtle"
            />
          </div>
          <div className="col-md-3 mb-3">
            <ReusableInput
              label="Updated By"
              id="updatedBy"
              className="border-dark-subtle"
            />
          </div>
          <div className="col-md-3 mb-3">
            <ReusableInput
              label="Updated At"
              id="updatedAt"
              className="border-dark-subtle"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageChallanHolderBankAccount;
