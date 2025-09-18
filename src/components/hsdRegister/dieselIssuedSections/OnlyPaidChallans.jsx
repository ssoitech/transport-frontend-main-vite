import React, { useState } from 'react'

function OnlyPaidChallans({ petrolPumpId, fromDate, toDate }) {
    const [loading, setLoading] = useState(false);
    return (
        <div>
            <div className="row mt-3">

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

            </div>

            <hr />
        </div>
    )
}

export default OnlyPaidChallans;
