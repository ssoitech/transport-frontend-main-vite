import React, { useState } from "react";
import CryptoJS from "crypto-js";
import ReusableModal from "../../reusable/ReusableModal";
import ReusableButton from "../../reusable/ReusableButton";
import ReusableTable from "../../reusable/ReusableTable";
import ReusableLoader from "../../reusable/ReusableLoader";
import { useApiQuery } from "../../../hooks/api/useApiQuery";

/**
 * PermitModal Component
 * - Refactored to use reusable modal, button, table, and loader components
 * - API logic for permit data uses generic useApiQuery hook (SOLID, DRY)
 * - Follows world-class coding standards and maintainability
 */
const SECRET_KEY = "your-secret-key";

const PermitModal = () => {
  const [showModal, setShowModal] = useState(false);

  // Fetch permit data using React Query generic hook
  const {
    data: permitData = [],
    isLoading,
    error,
    refetch,
  } = useApiQuery({
    key: "permit-modal",
    url: "/api/vi/all/permit-for-modal", // Replace with actual API
    method: "get",
    enabled: showModal, // Only fetch when modal is open
    select: (data) => data || [],
  });

  // Function to open modal and fetch data
  const handleShow = () => {
    setShowModal(true);
    refetch();
  };

  // Function to close modal
  const handleClose = () => {
    setShowModal(false);
  };

  // Function to view details (encrypt and open in new tab)
  const handleViewDetails = (id) => {
    const encryptedId = CryptoJS.AES.encrypt(
      id.toString(),
      SECRET_KEY
    ).toString();
    const encodedId = encodeURIComponent(encryptedId);
    window.open(`/permit-master-view-details/${encodedId}`, "_blank");
  };

  // Table columns for ReusableTable
  const columns = [
    { Header: "SL No", accessor: (row, i) => i + 1 },
    { Header: "Permit Number", accessor: "permitNumber" },
    { Header: "Date", accessor: "permitDate" },
    {
      Header: "Action",
      accessor: "id",
      Cell: ({ row }) => (
        <a
          href="#"
          className="text-decoration-none"
          onClick={(e) => {
            e.preventDefault();
            handleViewDetails(row.original.id);
          }}
        >
          View Details
        </a>
      ),
    },
  ];

  return (
    <>
      {/* Button to open modal */}
      <ReusableButton
        type="button"
        className="m-4 btn btn-sm btn-secondary"
        onClick={handleShow}
      >
        Display Previous Permits
      </ReusableButton>

      {/* Modal using reusable component */}
      <ReusableModal
        show={showModal}
        onClose={handleClose}
        title={`Permit Numbers${
          permitData.length > 0 ? ` (${permitData.length})` : ""
        }`}
        size="lg"
      >
        {isLoading ? (
          <ReusableLoader message="Loading permit data..." />
        ) : (
          <ReusableTable columns={columns} data={permitData} />
        )}
        {error && <div className="text-danger">Error loading permit data.</div>}
        <div className="modal-footer">
          <ReusableButton
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            Close
          </ReusableButton>
        </div>
      </ReusableModal>
    </>
  );
};

export default PermitModal;
