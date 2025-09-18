import React, { useEffect } from 'react';
import './shortage_calculation.css';

import { useForm } from 'react-hook-form';


function ShortageDataReadOnly({ shortageData }) {

    const { setValue, register } = useForm();

    useEffect(() => {
        if (shortageData) {
            setValue("penaltyType", shortageData.shortageCalculationMode)

            setValue("exemptedUpto6Wheel", shortageData.exemptedUpto6wheel);
            setValue("exemptedUpto8Wheel", shortageData.exemptedUpto8wheel);
            setValue("exemptedUpto10Wheel", shortageData.exemptedUpto10wheel);
            setValue("exemptedUpto12Wheel", shortageData.exemptedUpto12wheel);
            setValue("exemptedUpto14Wheel", shortageData.exemptedUpto14wheel);
            setValue("exemptedUpto16Wheel", shortageData.exemptedUpto16wheel);
            setValue("exemptedUpto18Wheel", shortageData.exemptedUpto18wheel);
            setValue("exemptedUpto22Wheel", shortageData.exemptedUpto22wheel);

            setValue("exemptedUptoPercent", shortageData.exemptedUptoPercent);
            setValue("exemptedRangeUpto6Wheel", shortageData.exemptedRangeUpto6wheel);
            setValue("exemptedRangeUpto8Wheel", shortageData.exemptedRangeUpto8wheel);
            setValue("exemptedRangeUpto10Wheel", shortageData.exemptedRangeUpto10wheel);
            setValue("exemptedRangeUpto12Wheel", shortageData.exemptedRangeUpto12wheel);
            setValue("exemptedRangeUpto14Wheel", shortageData.exemptedRangeUpto14wheel);
            setValue("exemptedRangeUpto16Wheel", shortageData.exemptedRangeUpto16wheel);
            setValue("exemptedRangeUpto18Wheel", shortageData.exemptedRangeUpto18wheel);
            setValue("penaltyPerKgInRupees", shortageData.penaltyPerKgInRupees);

            setValue("oer6Wheel", shortageData.oer6wheel);
            setValue("oer8Wheel", shortageData.oer8wheel);
            setValue("oer10Wheel", shortageData.oer10wheel);
            setValue("oer12Wheel", shortageData.oer12wheel);
            setValue("oer14Wheel", shortageData.oer14wheel);
            setValue("oer16Wheel", shortageData.oer16wheel);
            setValue("oer18Wheel", shortageData.oer18wheel);
            setValue("oer22Wheel", shortageData.oer22wheel);
            setValue("oerAmount", shortageData.oerAmount);
        }
    }, [shortageData])

    return (
        <div className='container mb-5 card p-4 custom-class'>
            <div className='mb-4 text-center bg-success text-white p-1 rounded'>
                <span>Permit Number : </span><span>{shortageData ? shortageData.permitNumber : ""}</span>
            </div>
            <form>
                <div className="row">
                    <div className="col-sm">
                        <div className="form-check">
                            <input
                                {...register("penaltyType")}
                                className="form-check-input border-dark-subtle"
                                type="radio"
                                id="check1"
                                value="B"
                                disabled
                            />
                            <label className="form-check-label" htmlFor="check1">
                                Penalty On Balance Qty
                            </label>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="form-check">
                            <input
                                {...register("penaltyType")}
                                className="form-check-input border-dark-subtle"
                                type="radio"
                                id="check2"
                                value="S"
                                disabled
                            />
                            <label className="form-check-label" htmlFor="check2">
                                Penalty On Total Shortage Qty
                            </label>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="form-check">
                            <input
                                {...register("penaltyType")}
                                className="form-check-input border-dark-subtle"
                                type="radio"
                                id="check3"
                                value="R"
                                disabled
                            />
                            <label className="form-check-label" htmlFor="check3">
                                Penalty On a Range
                            </label>
                        </div>
                    </div>
                </div>
                <hr />
                <div className='row mt-4'>
                    <div className='col-sm-9'>
                        <div className='bg-success rounded text-white p-2'>
                            <span>Exempted Upto{'(Kg)'}</span>
                        </div>

                        <div className='row mt-4 p-2'>
                            <div class="col-sm">
                                <label>6 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedUpto6Wheel'
                                    id='exemptedUpto6Wheel'
                                    {...register("exemptedUpto6Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>8 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedUpto8Wheel'
                                    id='exemptedUpto8Wheel'
                                    {...register("exemptedUpto8Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>10 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedUpto10Wheel'
                                    id='exemptedUpto10Wheel'
                                    {...register("exemptedUpto10Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>12 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedUpto12Wheel'
                                    id='exemptedUpto12Wheel'
                                    {...register("exemptedUpto12Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>14 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedUpto14Wheel'
                                    id='exemptedUpto14Wheel'
                                    {...register("exemptedUpto14Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>16 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedUpto16Wheel'
                                    id='exemptedUpto16Wheel'
                                    {...register("exemptedUpto16Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>18 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedUpto18Wheel'
                                    id='exemptedUpto18Wheel'
                                    {...register("exemptedUpto18Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>22 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedUpto22Wheel'
                                    id='exemptedUpto22Wheel'
                                    {...register("exemptedUpto22Wheel")}
                                    readOnly
                                />

                            </div>

                        </div>

                    </div>
                    <div className='col-sm-1'>
                        OR
                    </div>
                    <div className='col-sm-2'>
                        <div className='bg-success text-white p-2 rounded'>
                            <span>Exempt Upto{'(%)'}</span>
                        </div>

                        <div class="col-sm mt-4 p-2">
                            <label>Percent</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                name='exemptedUptoPercent'
                                id='exemptedUptoPercent'
                                {...register("exemptedUptoPercent")}
                                readOnly
                            />

                        </div>
                    </div>

                </div>

                <div className='row mt-4'>
                    <div className='col-sm-9'>
                        <div className='bg-success text-white p-2 rounded'>
                            <span>Exempted Range Upto {'(Kg)'}</span>
                        </div>

                        <div className='row mt-4 p-2'>
                            <div class="col-sm">
                                <label>6 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedRangeUpto6Wheel'
                                    id='exemptedRangeUpto6Wheel'
                                    {...register("exemptedRangeUpto6Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>8 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedRangeUpto8Wheel'
                                    id='exemptedRangeUpto8Wheel'
                                    {...register("exemptedRangeUpto8Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>10 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedRangeUpto10Wheel'
                                    id='exemptedRangeUpto10Wheel'
                                    {...register("exemptedRangeUpto10Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>12 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedRangeUpto12Wheel'
                                    id='exemptedRangeUpto12Wheel'
                                    {...register("exemptedRangeUpto12Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>14 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedRangeUpto14Wheel'
                                    id='exemptedRangeUpto14Wheel'
                                    {...register("exemptedRangeUpto14Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>16 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedRangeUpto16Wheel'
                                    id='exemptedRangeUpto16Wheel'
                                    {...register("exemptedRangeUpto16Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>18 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedRangeUpto18Wheel'
                                    id='exemptedRangeUpto18Wheel'
                                    {...register("exemptedRangeUpto18Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>22 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='exemptedRangeUpto22Wheel'
                                    id='exemptedRangeUpto22Wheel'
                                    {...register("exemptedRangeUpto22Wheel")}
                                    readOnly
                                />

                            </div>

                        </div>

                    </div>
                    <div className='col-sm-3'>
                    </div>

                </div>
                <div className='row mt-4'>
                    <div >
                        <span className='bg-success text-white p-2 rounded'>Penalty Per Kg</span>
                    </div>

                    <div className="row mb-3 mt-4">
                        <label
                            htmlFor="penaltyPerKgInRupees"
                            className="col-sm-2 col-form-label col-form-label"
                        >
                            In Rupees
                        </label>
                        <div className="col-sm-4">
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                name='penaltyPerKgInRupees'
                                id='penaltyPerKgInRupees'
                                {...register("penaltyPerKgInRupees")}
                                readOnly
                            />

                        </div>
                    </div>


                </div>

                {/* last section */}
                <div className='row mt-4'>
                    <div className='col-sm-9'>
                        <div className='bg-success text-white p-2 rounded'>
                            <span>Office Expenses Recovery Per Challan {"(Fixed Amount)"}</span>
                        </div>

                        <div className='row mt-4 p-2'>
                            <div class="col-sm">
                                <label>6 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='oer6Wheel'
                                    id='oer6Wheel'
                                    {...register("oer6Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>8 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='oer8Wheel'
                                    id='oer8Wheel'
                                    {...register("oer8Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>10 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='oer10Wheel'
                                    id='oer10Wheel'
                                    {...register("oer10Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>12 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='oer12Wheel'
                                    id='oer12Wheel'
                                    {...register("oer12Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>14 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='oer14Wheel'
                                    id='oer14Wheel'
                                    {...register("oer14Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>16 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='oer16Wheel'
                                    id='oer16Wheel'
                                    {...register("oer16Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>18 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='oer18Wheel'
                                    id='oer18Wheel'
                                    {...register("oer18Wheel")}
                                    readOnly
                                />

                            </div>
                            <div class="col-sm">
                                <label>22 wheel</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-dark-subtle"
                                    name='oer22Wheel'
                                    id='oer22Wheel'
                                    {...register("oer22Wheel")}
                                    readOnly
                                />

                            </div>

                        </div>

                    </div>
                    <div className='col-sm-1'>
                        OR
                    </div>
                    <div className='col-sm-2'>
                        <div className='bg-success text-white p-2 rounded'>
                            <span>OER {'(Per Tone)'}</span>
                        </div>

                        <div class="col-sm mt-4 p-2">
                            <label>Amount</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                name='oerAmount'
                                id='oerAmount'
                                {...register("oerAmount")}
                                readOnly
                            />

                        </div>
                    </div>

                </div>
                <div className='mt-5 text-center'>

                    <button className="btn btn-primary m-2 pl-3 pr-3" type="submit" disabled>

                        Save
                    </button>
                    <button type="reset" className="btn btn-outline-primary" disabled>
                        Clear
                    </button>
                </div>

            </form>
        </div>
    )
}

export default ShortageDataReadOnly;
