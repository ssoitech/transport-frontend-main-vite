// src/components/Invoice.js
import React, { forwardRef } from 'react';

const Invoice = forwardRef((props, ref) => {
    return (
        <div ref={ref}>
            <div className='mx-auto' style={{ fontFamily: 'Arial, sans-serif', margin: '20px', border: '1px solid #000', padding: '10px', width: '750px' }}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: '0' }}>Swastik Enterprises</h2>
                    <div>At./P.O. - Koira, Dist. - Sundargarh (Odisha) - 770048</div>
                    <div>Mobile - 7205774380, E-Mail - swastik.enterprises2021@gmail.com</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>Ref. No.: 236</div>
                    <div>Received Date : 26-Apr-2024</div>
                </div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: '0' }}>Debit Voucher</h3>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                        <strong>On A/c of : </strong>Transporting Expenses
                    </div>
                    <div>
                        <strong>Paid To : </strong>AGIPY3456C
                    </div>
                    <div>
                        <strong>Amount</strong>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <div style={{ border: '1px solid #000', padding: '5px 20px' }}>17165.00</div>
                </div>
                <div style={{ border: '1px solid #000', padding: '10px', marginBottom: '20px' }}>
                    <h4 style={{ textAlign: 'center', margin: '10px 0' }}>Payment Details</h4>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ borderBottom: '1px solid #000' }} colSpan="3">Payment Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Total Challan/s</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>5</td>
                            </tr>
                            <tr>
                                <td>Freight Amount</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>29515.20</td>
                            </tr>
                            <tr>
                                <td>TDS Deducted (-)</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>0.00</td>
                            </tr>
                            <tr>
                                <td>Cash Advance (-)</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>0.00</td>
                            </tr>
                            <tr>
                                <td>HSD Advance (-)</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>11400.00</td>
                            </tr>
                            <tr>
                                <td>Shortage Deduction (-)</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>350.00</td>
                            </tr>
                            <tr>
                                <td>Office Expenses (-)</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>600.00</td>
                            </tr>
                            <tr>
                                <td>Other Deducted (-)</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>0.00</td>
                            </tr>
                            <tr>
                                <td>CTC on Cash Trans. (-)</td>
                                <td colSpan="2" style={{ textAlign: 'right' }}>12350.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <strong>In words: </strong>Rupees Seventeen Thousand One Hundred Sixty Five Only
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <strong>Payment Mode: </strong>Bank<br />
                    <strong>Cq. No.: </strong>000933<br />
                    <strong>Bank Name: </strong>ICICI BANK<br />
                    <strong>Cheque Date: </strong>26-04-2024
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <strong>Prepared by</strong><br />
                        KOIRA
                    </div>
                    <div>
                        <strong>Authorised Signature</strong>
                    </div>
                    <div>
                        <strong>Received by</strong>
                    </div>
                </div>

            </div>
        </div>
    );
});

export default Invoice;
