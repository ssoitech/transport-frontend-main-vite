import React, { useState } from 'react'
import AutoComplete from '../../searchComponent/AutoComplete';

function DateWiseIssued({ petrolPumpId, fromDate, toDate }) {
    const [loading, setLoading] = useState(false);
    const [permitNumberDetails, setPermitNumberDetails] = useState(null);

    return (
        <div>
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
                    <div className="form-group pt-2">
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-primary mt-4"

                        >
                            Excel
                        </button>
                    </div>
                </div>

                <div className="col-md-2">
                    <div className="form-group">
                        <label htmlFor="selectBox1">Records</label>
                        <input
                            type="text"
                            className="form-control form-control-sm border-dark-subtle"
                            id="totalChallan"
                            name="totalChallan"

                        />
                    </div>
                </div>

            </div>

            <hr />
        </div>
    )
}

export default DateWiseIssued;
