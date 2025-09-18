import React, { useEffect, useRef, useState } from 'react';

const SelectedDataModal = ({
    show,
    handleClose,
    selectedData,
    onConfirm,
    onPrevious
}) => {
    const modalRef = useRef();
    const modalInstance = useRef();
    const [bankNames, setBankNames] = useState([]);
    const [form, setForm] = useState({
        through: '',
        bankName: '',
        chequeNo: '',
        chequeDate: '',
        paymentRefNo: '',
        beneficiary: '',
        challans: '',
        beneficiaryTotal: ''
    });

    // Fetch bank names when modal opens
    useEffect(() => {
        if (show) {
            // Replace with your actual API call
            fetch('/api/banks')
                .then(res => res.json())
                .then(data => setBankNames(data))
                .catch(() => setBankNames([]));
        }
    }, [show]);

    // Bootstrap modal show/hide
    useEffect(() => {
        if (show) {
            // Create and show modal
            modalInstance.current = new window.bootstrap.Modal(modalRef.current, { backdrop: 'static' });
            modalInstance.current.show();

            // Listen for modal close (from ESC or backdrop)
            modalRef.current.addEventListener('hidden.bs.modal', handleClose);

            return () => {
                modalRef.current.removeEventListener('hidden.bs.modal', handleClose);
            };
        } else if (modalInstance.current) {
            // Hide modal if show is false
            modalInstance.current.hide();
        }
    }, [show, handleClose]);

    // Handle input changes
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle Excel export
    const handleExcel = () => {
        // Simple CSV export for demonstration
        if (!selectedData.length) return;
        const header = Object.keys(selectedData[0]).join(',');
        const rows = selectedData.map(row =>
            Object.values(row)
                .map(val => `"${val}"`)
                .join(',')
        );
        const csvContent = [header, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'selected_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Handle close button click
    const handleCloseClick = () => {
        if (modalInstance.current) {
            modalInstance.current.hide();
        }
    };

    // Handle confirm
    const handleConfirm = () => {
        // Send form + table data to backend
        const payload = { ...form, tableData: selectedData };
        // Replace with your actual API endpoint
        fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(() => {
                handleClose();
            });
    };

    return (
        <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Selected Data</h5>
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={handleCloseClick}
                        ></button>
                    </div>
                    <div className="modal-body">
                        {/* Input Form */}
                        <form className="row g-3 mb-3">
                            <div className="col-md-2">
                                <label className="form-label">Through</label>
                                <select
                                    className="form-select"
                                    name="through"
                                    value={form.through}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Bank Name</label>
                                <select
                                    className="form-select"
                                    name="bankName"
                                    value={form.bankName}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    {bankNames.map((b, idx) => (
                                        <option key={idx} value={b.name || b}>
                                            {b.name || b}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Check No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="chequeNo"
                                    value={form.chequeNo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Check Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="chequeDate"
                                    value={form.chequeDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Payment Ref. No.</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="paymentRefNo"
                                    value={form.paymentRefNo}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-2 d-flex gap-2">
                                <button type="button" className="btn btn-primary w-50 mt-4" onClick={handleConfirm}>
                                    Confirm
                                </button>
                                <button type="button" className="btn btn-success w-50 mt-4" onClick={handleExcel}>
                                    Excel
                                </button>
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Beneficiary</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="beneficiary"
                                    value={form.beneficiary}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Challans</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="challans"
                                    value={form.challans}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label">Beneficiary Total</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="beneficiaryTotal"
                                    value={form.beneficiaryTotal}
                                    onChange={handleChange}
                                />
                            </div>
                        </form>
                        {/* Table */}
                        {selectedData && selectedData.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            {Object.keys(selectedData[0]).map((key, idx) => (
                                                <th key={idx}>{key}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedData.map((row, idx) => (
                                            <tr key={idx}>
                                                {Object.values(row).map((val, i) => (
                                                    <td key={i}>{val}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div>No data selected.</div>
                        )}
                    </div>
                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            onClick={handleCloseClick}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectedDataModal;