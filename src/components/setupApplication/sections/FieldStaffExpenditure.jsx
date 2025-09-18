import React from 'react'

function FieldStaffExpenditure() {
    return (
        <div className="mx-auto col-8">
            <div
                className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                role="alert"
            >
                {/* name of the table */}
                <span className="mb-0 h6">Field Staff Expenditure</span>
            </div>

            <div className="card shadow mb-4">
                <div className="container">
                    <div className="card-body font-weight-normal textColor">
                        <form className="justify-content-around" id="form1">
                            <div className="form-group m-1 row">
                                <div className="input-group input-group-sm m-1">
                                    <div className="input-group-prepend">
                                        <span
                                            className="input-group-text"
                                            id="inputGroup-sizing-sm"
                                        >
                                            Expenses Head
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="form-control"
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm m-4"
                                    // onChange={(e) => { setFname(e.target.value) }}
                                    />
                                </div>

                            </div>
                        </form>



                        <div
                            id="buttons"
                            className="btn-div mx-auto justify-content-around"
                        >
                            <button
                                type="submit"
                                form="form1"
                                className="btn btn-sm btn-info m-1 border-info"
                            // onClick={(e) => { handleSave(e) }}
                            >
                                {/* {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                        </div>} */}
                                Save
                            </button>
                            <button
                                type="submit"
                                form="form1"
                                className="btn btn-sm btn-info m-1 border-info"
                            // onClick={(e) => { handleSave(e) }}
                            >
                                New
                            </button>
                            <button
                                type="submit"
                                form="form1"
                                className="btn btn-sm btn-info m-1 border-info"
                            // onClick={(e) => { handleSave(e) }}
                            >
                                {/* {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                        </div>} */}
                                Delete
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FieldStaffExpenditure
