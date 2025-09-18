import React, { useState } from "react";
import axiosInstance from "../../../config/AxiosConfig";
import CryptoJS from "crypto-js";

const PermitModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [permitData, setPermitData] = useState([]);
    const [loading, setLoading] = useState(false);

    const SECRET_KEY = "your-secret-key";
    // Function to open modal and fetch data
    const handleShow = async () => {
        setShowModal(true);
        setLoading(true);
        try {
            const response = await axiosInstance.get("/api/vi/all/permit-for-modal"); // Replace with actual API
            setPermitData(response.data);
        } catch (error) {
            console.error("Error fetching permit numbers:", error);
        }
        setLoading(false);
    };

    // Function to close modal
    const handleClose = () => {
        setShowModal(false);
        setPermitData([]);
    };



    const handleViewDetails = (id) => {
        // Encrypt the ID
        const encryptedId = CryptoJS.AES.encrypt(id.toString(), SECRET_KEY).toString();

        // Encode to make it URL-safe
        const encodedId = encodeURIComponent(encryptedId);
        window.open(`/permit-master-view-details/${encodedId}`, "_blank"); // Opens in a new tab
    };

    return (
        <>
            {/* Button to open modal */}
            <button type="button" className="m-4 btn btn-sm btn-secondary" onClick={handleShow}>
                Display Previous Permits
            </button>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{permitData.length > 0 ? `Permit Numbers (${permitData.length}) ` : "Permit Numbers"}</h5>
                                <button type="button" className="btn-close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                {loading ? (
                                    <p>Loading permit data...</p>
                                ) : (
                                    <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                                        <table className="table table-sm table-striped table-bordered">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th>SL No</th>
                                                    <th>Permit Number</th>
                                                    <th>Date</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {permitData.length > 0 ? (
                                                    permitData.map((permit, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{permit.permitNumber}</td>
                                                            <td>{permit.permitDate}</td>
                                                            <td>
                                                                <a href="#"
                                                                    class="text-decoration-none"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleViewDetails(permit.id);
                                                                    }}
                                                                >
                                                                    View Details
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4" className="text-center">
                                                            No permit data available.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PermitModal;
