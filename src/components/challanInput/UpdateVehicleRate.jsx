import React from 'react'

function UpdateVehicleRate() {
    return (
        <div className='work-space-container'>
            <div className="alert alert-info text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0'>Update Vehicle Rate</span>
            </div>
            <div className="grid-section1">
                <div className="item1">
                    <div className="">
                        <label for="permitNumber" className="form-label">Permit Number</label>
                        <div className="row">
                            <div className="col-auto">
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="permitNumber"

                                />
                            </div>
                            <div className="col-auto">
                                <button type="button" class="btn btn-sm btn-primary mb-3">Proceed</button>
                            </div>
                            <div className="col-auto">
                                <button type="button" class="btn btn-sm btn-primary mb-3">New</button>
                            </div>
                            <div className="col-auto">
                                <button type="button" class="btn btn-sm btn-primary mb-3">Clear</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="grid-container card">
                <div className="item">
                    <div className="">
                        <label for="consignerName" className="form-label">Billing Party</label>
                        <div className="">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="consignerName"
                                name="consignerName"
                            />
                        </div>
                    </div>

                </div>
                <div className="item">
                    <div className="">
                        <label for="consignerName" className="form-label">Mines/Consigner Name</label>
                        <div className="">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="consignerName"
                                name="consignerName"

                            />
                        </div>
                    </div>

                </div>
                <div className="item">
                    <div className="">
                        <label for="exporterName" className="form-label">Exporter/Consignee Name</label>
                        <div className="">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="exporterName"
                                name="exporterName"

                            />
                        </div>
                    </div>

                </div>
                <div className="item">
                    <div className="">
                        <label for="loadingPoint" className="form-label">Loading Point</label>
                        <div className="">
                            <input
                                type="email"
                                className="form-control form-control-sm"
                                id="loadingPoint"
                                name="loadingPoint"

                            />
                        </div>
                    </div>

                </div>
                <div className="item">
                    <div className="">
                        <label for="unloadingPoint" className="form-label">Un-Loading Point</label>
                        <div className="">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                id="unloadingPoint"
                                name="unloadingPoint"

                            />
                        </div>
                    </div>

                </div>
                <div className="item1">
                    <div className="">
                        <label for="permitNumber" className="form-label">Loading Period</label>
                        <div className="row">
                            <div className="col-sm-5">
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    id="permitNumber"
                                />
                            </div>To
                            <div className="col-sm-5">
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    id="permitNumber"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UpdateVehicleRate
