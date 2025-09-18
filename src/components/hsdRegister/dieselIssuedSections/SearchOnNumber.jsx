import React from 'react'

function SearchOnNumber() {
    return (
        <div>
            <div className="container mt-4">
                <div className="row align-items-center">
                    {/* Input Field 1 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                        <label htmlFor="input1" className="form-label">
                            During Period From
                        </label>
                        <input
                            type="text"
                            id="input1"
                            className="form-control form-control-sm border-dark-subtle"
                            placeholder="Enter value"
                        />
                    </div>

                    {/* Input Field 2 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                        <label htmlFor="input2" className="form-label">
                            During Period To
                        </label>
                        <input
                            type="text"
                            id="input2"
                            className="form-control form-control-sm border-dark-subtle"
                            placeholder="Enter value"
                        />
                    </div>

                    {/* Input Field 3 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                        <label htmlFor="input3" className="form-label">
                            Slip Number
                        </label>
                        <input
                            type="text"
                            id="input3"
                            className="form-control form-control-sm border-dark-subtle"
                            placeholder="Enter value"
                        />
                    </div>

                    {/* Button 1 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3 mt-2">
                        <div className='pt-4'>
                            <button className="btn btn-sm btn-primary">Search</button>
                        </div>

                    </div>

                    {/* Button 2 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3 mt-2">
                        <div className='pt-4'>
                            <button className="btn btn-sm btn-secondary">Clear</button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="container mt-4">
                <div className="row align-items-center">
                    {/* Input Field 1 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                        <label htmlFor="input1" className="form-label">
                            Challan Number
                        </label>
                        <input
                            type="text"
                            id="input1"
                            className="form-control form-control-sm border-dark-subtle"
                            placeholder="Enter value"
                        />
                    </div>
                    {/* Button 1 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3 mt-2">
                        <div className='pt-4'>
                            <button className="btn btn-sm btn-primary">Search</button>
                        </div>

                    </div>

                    {/* Input Field 2 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                        <label htmlFor="input2" className="form-label">
                            TP Number
                        </label>
                        <input
                            type="text"
                            id="input2"
                            className="form-control form-control-sm border-dark-subtle"
                            placeholder="Enter value"
                        />
                    </div>
                    {/* Button 1 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3 mt-2">
                        <div className='pt-4'>
                            <button className="btn btn-sm btn-primary">Search</button>
                        </div>

                    </div>
                </div>
            </div>


            <div className="container mt-4">
                <div className="row align-items-center">
                    {/* Input Field 1 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                        <label htmlFor="input1" className="form-label">
                            Vehicle Number
                        </label>
                        <input
                            type="text"
                            id="input1"
                            className="form-control form-control-sm border-dark-subtle"
                            placeholder="Enter value"
                        />
                    </div>

                    {/* Input Field 2 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                        <label htmlFor="input2" className="form-label">
                            During From
                        </label>
                        <input
                            type="text"
                            id="input2"
                            className="form-control form-control-sm border-dark-subtle"
                            placeholder="Enter value"
                        />
                    </div>

                    {/* Input Field 3 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3">
                        <label htmlFor="input3" className="form-label">
                            During To
                        </label>
                        <input
                            type="text"
                            id="input3"
                            className="form-control form-control-sm border-dark-subtle"
                            placeholder="Enter value"
                        />
                    </div>

                    {/* Button 1 */}
                    <div className="col-lg-2 col-md-3 col-sm-6 mb-3 mt-2">
                        <div className='pt-4'>
                            <button className="btn btn-sm btn-primary">Search</button>
                        </div>

                    </div>
                </div>
            </div>


            <div className="container mt-4">
                <form>
                    <div className="row">
                        {/* Row 1 */}
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field1" className="form-label">Despatched</label>
                            <input type="text" id="field1" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field2" className="form-label">Challan Number</label>
                            <input type="text" id="field2" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field3" className="form-label">TP Number</label>
                            <input type="text" id="field3" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field4" className="form-label">Vehicle Number</label>
                            <input type="text" id="field4" className="form-control form-control-sm border-dark-subtle" />
                        </div>

                        {/* Row 2 */}
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field5" className="form-label">Loading Source</label>
                            <input type="text" id="field5" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field6" className="form-label">Despatched Quantity</label>
                            <input type="text" id="field6" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field7" className="form-label">Destination</label>
                            <input type="text" id="field7" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field8" className="form-label">HSD in Ltr</label>
                            <input type="text" id="field8" className="form-control form-control-sm border-dark-subtle" />
                        </div>

                        {/* Row 3 */}
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field9" className="form-label">HSD in Cash</label>
                            <input type="text" id="field9" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field10" className="form-label">Issued Filling Station</label>
                            <input type="text" id="field10" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field11" className="form-label">Bill Number</label>
                            <input type="text" id="field11" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field12" className="form-label">Used In Filling Station</label>
                            <input type="text" id="field12" className="form-control form-control-sm border-dark-subtle" />
                        </div>

                        {/* Row 4 */}
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field13" className="form-label">Date</label>
                            <input type="text" id="field13" className="form-control form-control-sm border-dark-subtle" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field14" className="form-label">Filling Date</label>
                            <input type="text" id="field14" className="form-control form-control-sm border-dark-subtle" placeholder="Enter Field 14" />
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                            <label htmlFor="field15" className="form-label">Bill From</label>
                            <input type="text" id="field15" className="form-control form-control-sm border-dark-subtle" placeholder="Enter Field 15" />
                        </div>
                    </div>
                </form>
                <div className='text-center pt-2'>
                    <button className="btn btn-sm btn-primary">Update</button>
                </div>
            </div>
        </div>
    )
}

export default SearchOnNumber;
