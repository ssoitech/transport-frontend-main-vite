import React, { useState } from 'react'
import AutoComplete from '../../searchComponent/AutoComplete';

function ChallanWiseIssued({ petrolPumpId, fromDate, toDate }) {
    const [loading, setLoading] = useState(false);
    const [permitNumberDetails, setPermitNumberDetails] = useState(null);


    return (
        <div>

            {/* Second row of 6 select boxes */}

            <div className="row mt-3">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="selectBox7">Permit Number</label>
                        <AutoComplete
                            placeholder={"Search here"}
                            url={'/api/v1/get/permit-number?keyword='}
                            datakey={"name"}
                            customLoading={<>Loading..</>}
                            onSelect={(res) => setPermitNumberDetails(res)}
                            onChange={(input) => { }}
                            onBlur={(e) => { }}
                            onFocus={(e) => { }}
                            customStyles={{}}
                        />

                    </div>


                </div>

                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="selectBox1">Order By</label>
                        <select
                            className="form-select form-select-sm border-dark-subtle"
                            id="order"
                            name="order"

                        >
                            <option value="truckNumber">Truck Number</option>
                            <option value="tpNumber">TP Number</option>
                            <option value="challanNumber">Challan Number</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="form-group pt-2">

                        <button type="submit" className="btn btn-sm btn-primary mt-4" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </>
                            ) : (
                                'Proceed'
                            )}
                        </button>
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="form-group pt-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary mt-4"

                        >
                            Excel
                        </button>
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary mt-4 ml-2"

                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="selectBox1">Go To</label>
                        <input
                            type="text"
                            className="form-control form-control-sm border-dark-subtle"
                            id="goTo"
                            name="goTo"

                        />
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="selectBox1">Challan/s</label>
                        <input
                            type="text"
                            className="form-control form-control-sm border-dark-subtle"
                            id="totalChallan"
                            name="totalChallan"

                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="selectBox1">Total HSD</label>
                        <input
                            type="text"
                            className="form-control form-control-sm border-dark-subtle"
                            id="totalHsd"
                            name="totalHsd"

                        />
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="selectBox1">Total Amount</label>
                        <input
                            type="text"
                            className="form-control form-control-sm border-dark-subtle"
                            id="totalAmount"
                            name="totalAmount"

                        />
                    </div>
                </div>
            </div>

            <hr />




        </div>
    )
}

export default ChallanWiseIssued;
