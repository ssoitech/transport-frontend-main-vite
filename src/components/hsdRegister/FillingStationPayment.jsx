import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import PaymentDetails from './fillingStationPaymentSections/PaymentDetails';
import PaymentProcess from './fillingStationPaymentSections/PaymentProcess';

function FillingStationPayment() {
    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>Filling Station Payment</span>
            </div>


            <div>
                <Tabs
                    defaultActiveKey="payment-process"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="payment-process" title="Payment Process">
                        <PaymentProcess />
                    </Tab>
                    <Tab eventKey="payment-details" title="Payment Details">
                        <PaymentDetails />
                    </Tab>

                </Tabs>

            </div>

        </div>
    )
}

export default FillingStationPayment;
