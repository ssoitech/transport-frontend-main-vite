import React from 'react'
import NavBar from '../components/NavBar'
import SideBar from '../components/SideBar'
import { Container } from 'react-bootstrap'
import MinesConsignorOwnerMaster from '../components/setupApplication/MinesConsignorOwnerMaster'
import NewSideBar from '../components/NewSideBar';
import NewNavBar from '../components/NewNavBar'
import LogoutPopUp from '../components/LogoutPopUp'
import './layout.css';

function Layout({ children }) {
    return (
        <>
            <NewNavBar />
            <div className='custom-app-container'>

                <NewSideBar />
                <Container fluid>
                    {children}
                </Container>
                <LogoutPopUp />
            </div>

        </>
    )
}

export default Layout;
