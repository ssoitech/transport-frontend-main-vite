import React from 'react';
import { useForm } from "react-hook-form";

function BankAdvanceEntry() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Bank Advance Entry</span>
            </div>
            <div>
                <form className="container mt-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* Row 1 */}
                    <div className="row g-3">
                        <div className="col-md-4">
                            <label className="form-label small">TP Number</label>
                            <input type="text" className="form-control form-control-sm border-dark-subtle" {...register("tpNumber")} />
                        </div>
                        <div className="col-md-6 d-flex align-items-end">
                            <button type="button" className="btn btn-primary btn-sm">Get TP Details</button>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="row g-3 mt-2">
                        <div className="col-md-3">
                            <label className="form-label small">Vehicle Number</label>
                            <input type="text" className="form-control form-control-sm border-dark-subtle" {...register("vehicleNumber")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Challan Date</label>
                            <input type="date" className="form-control form-control-sm border-dark-subtle" {...register("challanDate")} />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            <button type="button" className="btn btn-secondary btn-sm">Get Vehicle</button>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small">With Owner</label>
                            <input type="text" className="form-control form-control-sm border-dark-subtle" {...register("withOwner")} />
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="row g-3 mt-2">
                        <div className="col-md-3">
                            <label className="form-label small">Driver Welfare</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("driverWelfare")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Office Exp.</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("officeExp")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Challan Number</label>
                            <input type="text" className="form-control form-control-sm border-dark-subtle" {...register("challanNumber")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Vehicle Type</label>
                            <select className="form-select form-select-sm border-dark-subtle" {...register("vehicleType")}>
                                <option value="">Select</option>
                                <option value="Non-Union">Non-Union</option>
                                <option value="Union">Union</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 4 */}
                    <div className="row g-3 mt-2">
                        <div className="col-md-3">
                            <label className="form-label small">Paid Qty.</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("paidQty")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Master Rate</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("masterRate")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Freight Rate</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("freightRate")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Freight Amount</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("freightAmount")} />
                        </div>
                    </div>

                    {/* Row 5 */}
                    <div className="row g-3 mt-2">
                        <div className="col-md-3">
                            <label className="form-label small">Cash Advance</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("cashAdvance")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">HSD Advance</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("hsdAdvance")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Petrol Pump</label>
                            <select className="form-select form-select-sm border-dark-subtle" {...register("petrolPump")}>
                                <option value="">Select</option>
                                <option value="Pump1">Pump 1</option>
                                <option value="Pump2">Pump 2</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">HSD Slip</label>
                            <input type="text" className="form-control form-control-sm border-dark-subtle" {...register("hsdSlip")} />
                        </div>
                    </div>

                    {/* Row 6 */}
                    <div className="row g-3 mt-2">
                        <div className="col-md-4">
                            <label className="form-label small">Cash + HSD</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("cashHsd")} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small">Balance Due</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("balanceDue")} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label small">Balance After Bank Advance</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("balanceAfterBank")} />
                        </div>
                    </div>

                    {/* Row 7 */}
                    <div className="row g-3 mt-2">
                        <div className="col-md-3">
                            <label className="form-label small">Bank Advance</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("bankAdvance")} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Payment Type</label>
                            <select className="form-select form-select-sm border-dark-subtle" {...register("paymentType")}>
                                <option value="">Select</option>
                                <option value="Cash">Cash</option>
                                <option value="Online">Online</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">From Bank</label>
                            <select className="form-select form-select-sm border-dark-subtle" {...register("fromBank")}>
                                <option value="">Select</option>
                                <option value="HDFC">HDFC</option>
                                <option value="SBI">SBI</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small">Paid On</label>
                            <input type="date" className="form-control form-control-sm border-dark-subtle" {...register("paidOn")} />
                        </div>
                    </div>

                    {/* Row 8 */}
                    <div className="row g-3 mt-3">
                        {/* Left Column */}
                        <div className="col-md-4">
                            <label className="form-label small">Bank Remark</label>
                            <textarea className="form-control form-control-sm border-dark-subtle" rows="2" {...register("bankRemark")} />

                            <label className="form-label small mt-2">Agent/Broker</label>
                            <select className="form-select form-select-sm border-dark-subtle" {...register("agentBroker")}>
                                <option value="">Select</option>
                                <option value="Agent1">Agent 1</option>
                                <option value="Broker1">Broker 1</option>
                            </select>

                            <label className="form-label small mt-2">Other Deduction</label>
                            <input type="number" className="form-control form-control-sm border-dark-subtle" {...register("otherDeduction")} />

                            <label className="form-label small mt-2">OD Towards</label>
                            <textarea className="form-control form-control-sm border-dark-subtle" rows="2" {...register("odTowards")} />

                            <div className="mt-3">
                                <button type="submit" className="btn btn-success btn-sm me-2">Save</button>
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => reset()}>Clear</button>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="col-md-8">
                            <div className='table-responsive'>
                                <table className="table table-bordered table-sm">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Bank Account Number</th>
                                            <th>IFS Code</th>
                                            <th>Bank Name</th>
                                            <th>Branch Name</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1234567890</td>
                                            <td>SBIN000123</td>
                                            <td>SBI</td>
                                            <td>Main Branch</td>
                                            <td>Active</td>
                                        </tr>
                                        {/* You can dynamically populate these rows */}
                                    </tbody>
                                </table>
                            </div>
                            <div className='float-right'>
                                <div className="row g-3 mt-2">
                                    <div className="col-md-6">
                                        <label className="form-label small">Entry By</label>
                                        <input type="text" className="form-control form-control-sm border-dark-subtle" {...register("entryBy")} />
                                        <input type="text" className="form-control form-control-sm border-dark-subtle mt-1" {...register("entryDate")} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label small">Updated By</label>
                                        <input type="text" className="form-control form-control-sm border-dark-subtle" {...register("updatedBy")} />
                                        <input type="text" className="form-control form-control-sm border-dark-subtle mt-1" {...register("updatedDate")} />
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BankAdvanceEntry
