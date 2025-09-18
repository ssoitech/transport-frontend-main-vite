import React from 'react'
import './newSideBar.css';
import { Container } from 'react-bootstrap';
import SidebarAccordion from './SidebarAccordion';
import { useNavigate } from 'react-router-dom';
import BillingSidebarAccordion from './BillingSideBarAccordion';


function BillingSideBar() {
    const navigate = useNavigate();
    return (
        <nav className="new-sidebar sidebar-style">
            <span className='text-white font-weight-bold mx-auto P-2 m-2 custom-cursor-hand' onClick={() => { navigate("/billing-work-space") }}><i class="bi bi-houses-fill p-2"></i>Billing Work Space</span>
            <BillingSidebarAccordion />
        </nav>

    )
}

export default BillingSideBar

