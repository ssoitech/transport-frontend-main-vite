import React from 'react'
import { Container } from 'react-bootstrap'
import NewNavBar from '../components/NewNavBar'
import LogoutPopUp from '../components/LogoutPopUp'
import './layout.css';
import BillingSideBar from '../components/BillingSideBar'

function BillingLayout({ children }) {
    return (
        <>
            <NewNavBar />
            <div className='custom-app-container'>

                <BillingSideBar />
                <Container fluid>
                    {children}
                </Container>
                <LogoutPopUp />
            </div>

        </>
    )
}

export default BillingLayout;
