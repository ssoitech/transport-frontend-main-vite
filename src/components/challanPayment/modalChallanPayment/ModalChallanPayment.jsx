
import '../CSS_Chalanpayment/modalChallanPayment.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import InvoiceGenerator from '../challanPaymentComponents/InvoiceGenerator';


function ModalChallanPayment({ closeModal }) {




    return (
        <div className='invoice-modal-container'>
            <div className="invoice-modal-card">
                <InvoiceGenerator closeModal={closeModal} />


            </div>
        </div>

    )
}

export default ModalChallanPayment;
