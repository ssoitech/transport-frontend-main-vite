import React from 'react'
import {
    BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill,
    BsListCheck, BsMenuButtonWideFill, BsFillGearFill
}
    from 'react-icons/bs'
import SidebarAccordion from './SidebarAccordion'
import { useNavigate } from 'react-router-dom';

function SideBar({ openSidebarToggle, OpenSidebar }) {
    const navigate = useNavigate();
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <BsCart3 className='icon_header' /> SHOP
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>

            <span className='text-white font-weight-bold mx-auto P-2 m-2 custom-cursor-hand' onClick={() => { navigate("/") }}><i class="bi bi-houses-fill p-2"></i>Work Space</span>
            <SidebarAccordion />
        </aside>
    )
}

export default SideBar