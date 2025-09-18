import React, { useState } from 'react';
import axios from 'axios';


function PermitWiseIssued() {
    const [table1Data, setTable1Data] = useState([]);
    const [table2Data, setTable2Data] = useState([]);
    const [table3Data, setTable3Data] = useState([]);

    const fetchTable1Data = async () => {
        try {
            const response = await axios.get('/api/table1'); // Replace with your API endpoint
            setTable1Data(response.data);
        } catch (error) {
            console.error('Error fetching table 1 data:', error);
        }
    };

    const fetchTable2Data = async (rowData) => {
        try {
            const response = await axios.post('/api/table2', rowData); // Replace with your API endpoint
            setTable2Data(response.data);
        } catch (error) {
            console.error('Error fetching table 2 data:', error);
        }
    };

    const fetchTable3Data = async (rowData) => {
        try {
            const response = await axios.post('/api/table3', rowData); // Replace with your API endpoint
            setTable3Data(response.data);
        } catch (error) {
            console.error('Error fetching table 3 data:', error);
        }
    };
    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    {/* Table 1 */}
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3 table-container">
                        <button className="btn btn-sm btn-primary mb-2" onClick={fetchTable1Data}>
                            Proceed
                        </button>
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>SL No</th>
                                        <th>Permit Number</th>
                                        <th>Chalans</th>
                                        <th>Diesel Advance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table1Data.map((row, index) => (
                                        <tr key={index} onClick={() => fetchTable2Data(row)}>
                                            <td>{index + 1}</td>
                                            <td>{row.permitNumber}</td>
                                            <td>{row.chalans}</td>
                                            <td>{row.dieselAdvance}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Table 2 */}
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3 table-container">
                        <p>Date Wise Details</p>
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>SL No</th>
                                        <th>Filling Date</th>
                                        <th>Trip</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table2Data.map((row, index) => (
                                        <tr key={index} onClick={() => fetchTable3Data(row)}>
                                            <td>{index + 1}</td>
                                            <td>{row.fillingDate}</td>
                                            <td>{row.trip}</td>
                                            <td>{row.amount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Table 3 */}
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-3 table-container">
                        <p>Challan Wise Details</p>
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>SL No</th>
                                        <th>HSD Slip No</th>
                                        <th>TP Number</th>
                                        <th>Truck Number</th>
                                        <th>HSD Amount</th>
                                        <th>Filling Station Name</th>
                                        <th>Challan Date</th>
                                        <th>Filling Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table3Data.map((row, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{row.hsdSlipNo}</td>
                                            <td>{row.tpNumber}</td>
                                            <td>{row.truckNumber}</td>
                                            <td>{row.hsdAmount}</td>
                                            <td>{row.fillingStationName}</td>
                                            <td>{row.challanDate}</td>
                                            <td>{row.fillingDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PermitWiseIssued;
