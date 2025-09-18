import React from 'react';
import './sidebar_accordion.css';
import { NavLink, useLocation } from 'react-router-dom';

function BillingSidebarAccordion() {
    const location = useLocation();

    console.log("biling sider..............")

    return (
        <div className="accordion accordion-flush inner-sidebar" id="accordionFlushExample">
            <div className="accordion-item">
                <h3 className="accordion-header">
                    <button
                        className="accordion-button collapsed sidebar-btn custom-bg-color"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseOne"
                        aria-expanded="false"
                        aria-controls="flush-collapseOne"
                    >
                        Setup Application
                    </button>
                </h3>
                <div
                    id="flush-collapseOne"
                    className="accordion-collapse collapse custom-bg-color"
                    data-bs-parent="#accordionFlushExample"
                >
                    <div className="accordion-body sidebar-body">
                        <ul className='sidebar-ul'>
                            <li className={location.pathname === "//billing-start" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/billing-start">billing start</NavLink>
                            </li>

                        </ul>

                    </div>
                </div>
            </div>
            <div className="accordion-item">
                <h3 className="accordion-header">
                    <button
                        className="accordion-button collapsed sidebar-btn custom-bg-color"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#flush-collapseTwo"
                        aria-expanded="false"
                        aria-controls="flush-collapseTwo"
                    >
                        Challan Input
                    </button>
                </h3>
                <div
                    id="flush-collapseTwo"
                    className="accordion-collapse collapse custom-bg-color"
                    data-bs-parent="#accordionFlushExample"
                >
                    <div className="accordion-body">
                        <ul className='sidebar-ul'>
                            <li className={location.pathname === "/permit-master-form-I" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/permit-master-form-I">1. Permit Master {'(Form-I)'}</NavLink>
                            </li>
                            <hr />
                            <li className={location.pathname === "/challan-loading-entry-manual" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/challan-loading-entry-manual">Challan Loading Entry - Manually</NavLink>
                            </li>
                            <li className={location.pathname === "/unloading-challan-entry-manual" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/unloading-challan-entry-manual">Challan Un-Loading Entry - Manually</NavLink>
                            </li>
                            <hr />
                            <li className={location.pathname === "/excel-file-upload-full" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/excel-file-upload-full">2. Excel File Upload - Despatch Data {"(Full)"}</NavLink>
                            </li>
                            <li className={location.pathname === "/excel-file-upload-selection" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/excel-file-upload-selection">Excel File Upload - Despatch Data {"(Selection)"}</NavLink>
                            </li>
                            <li className={location.pathname === "/mark-challan-as-unloaded" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/mark-challan-as-unloaded">Mark Challan As Un-Loaded</NavLink>
                            </li>
                            <li className={location.pathname === "/update-vehicle-rate" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/update-vehicle-rate">Update Vehicle Rate{"(For Payment)"}</NavLink>
                            </li>
                            <hr />
                            <li className={location.pathname === "/freight-vs-advance" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/freight-vs-advance">Freight vs Advance</NavLink>
                            </li>
                            <li className={location.pathname === "/input-advance-data-on-permitwise" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/input-advance-data-on-permitwise">3a. Input Advance Data On Permit Wise</NavLink>
                            </li>
                            <li className={location.pathname === "/input-advance-data-on-single-challan" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/input-advance-data-on-single-challan">3b. Input Advance Data On Single Challan</NavLink>
                            </li>
                            <li className={location.pathname === "/upload-advance-data-from-excel" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/upload-advance-data-from-excel">3c. Upload Advance Data From Excel Without Bank</NavLink>
                            </li>
                            <hr />
                            <li className={location.pathname === "/delete-excel-data" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/delete-excel-data">Delete Excel Data</NavLink>
                            </li>
                            <li className={location.pathname === "/check-cancelled-challan" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/check-cancelled-challan">Check Cancelled Challan</NavLink>
                            </li>
                            <li className={location.pathname === "/remove-cancelled-challan" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/remove-cancelled-challan">Remove Cancelled Challan</NavLink>
                            </li>
                            <hr />
                            <li className={location.pathname === "/challan-status" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/challan-status">Challan Status</NavLink>
                            </li>
                            <li className={location.pathname === "/vehicle-rate-analysis" ? "sidebar-ul-li active" : "sidebar-ul-li"}>
                                <NavLink exact className="collapse-item text-decoration-none custom-text" to="/vehicle-rate-analysis">Vehicle Rate Analysis</NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>

    );
}

export default BillingSidebarAccordion;