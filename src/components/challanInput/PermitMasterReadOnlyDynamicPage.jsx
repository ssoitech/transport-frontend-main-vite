import React, { useEffect } from 'react';
import './css/PermitMaster.css';
import { Tab, Tabs } from 'react-bootstrap';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Swal from "sweetalert2";
import axiosInstance from '../../config/AxiosConfig';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import VehicleRateReadOnly from './permitMasterSection/VehicleRateReadOnly';
import ShortageDataReadOnly from './permitMasterSection/ShortageDataReadOnly';
import CryptoJS from "crypto-js";


function PermitMasterReadOnlyDynamicPage() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const { encodedId } = useParams(); // Get encrypted ID from URL
    const [data, setData] = useState(null);


    const { register, handleSubmit, setValue } = useForm();
    const { register: registerStack, setValue: setValueStack } = useForm();
    const SECRET_KEY = "your-secret-key"; // Same key used for encryption

    const onSubmit = (data) => {
        console.log(data);
    };

    // ----------------------------------------------
    const [permitDetails, setPermitDetails] = useState(null);
    const [stackTableData, setStackTableData] = useState([]);
    const [vehicleRateData, setVehicleRateData] = useState([]);
    const [shortageData, setShortageData] = useState(null);

    const [permitNumber, setPermitNumber] = useState();

    const [date, setDate] = useState();


    // Function to decrypt the ID
    const decryptId = (encryptedText) => {
        try {
            const decodedText = decodeURIComponent(encryptedText); // Decode the URL-safe string
            const bytes = CryptoJS.AES.decrypt(decodedText, SECRET_KEY);
            return bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Decryption error:", error);
            return null;
        }
    };


    useEffect(() => {
        if (accessDetails) {
            if (accessDetails.role !== 'ADMIN') {
                if (accessDetails.role === 'USER') {
                    if (accessDetails.challanInputAccess !== "Y") {
                        Swal.fire("Error", "You don't have access to this section.", "error");
                        navigate('/work-space');
                    }

                } else {
                    Swal.fire("Error", "You don't have access to this section.", "error");
                    navigate('/work-space');
                }
            }

        } else {
            Swal.fire("Error", "You don't have access to this section.", "error");
            navigate('/work-space');
        }

    }, []);


    useEffect(() => {
        console.log("encripted---id = " + encodedId);
        if (!encodedId) {
            // Redirect if no ID is found
            return;
        }

        const id = decryptId(encodedId);
        console.log("decript---id = " + id)
        if (!id) {
            // navigate("/"); // Redirect if decryption fails
            return;
        }

        axiosInstance.get(`/api/v1/get/permit-details-by-id/${id}`)
            .then((response) => {
                console.log(response.data);
                setPermitDetails(response.data.permitDetails);
                setStackTableData(response.data.stackDetails);
                setVehicleRateData(response.data.vehicleRateDetails);
                setShortageData(response.data.shortageData);

            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [encodedId, navigate]);

    useEffect(() => {
        if (permitDetails) {
            setValue("minesConsignerName", permitDetails.consignorShortName);
            setValue("permitNumber", permitDetails.permitNumber);
            setValue("date", permitDetails.permitDate);
            setValue("permitType", permitDetails.permitType === "R" ? 'By Road Work' : 'Railway Siding');
            setValue("exporter", permitDetails.exporterShortName);
            setValue("trader", permitDetails.traderShortName);
            setValue("loadingPoint", permitDetails.loadingPointName);
            setValue("destination", permitDetails.destination);
            setValue("ddmreturn", permitDetails.ddmReturn === "Y" ? "Yes" : "No");
            setValue("material", permitDetails.materialName);
            setValue("validFrom", permitDetails.validFrom);
            setValue("validUpto", permitDetails.validTo);
            setValue("challanStatus", permitDetails.challanStatus === "O" ? "To Be Billed" : "");
            setValue("advInp", permitDetails.advInput === "Y" ? "Yes" : "No");
            setValue("tollGate", permitDetails.tolGate === "Y" ? "Yes" : 'No');
            setValue("note", permitDetails.note);

            setValue("QtyInTons", permitDetails.totalQty);
        }

    }, [permitDetails, stackTableData])






    return (
        <div className='m-4'>
            <div className="alert alert-warning text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>{`Transit Permit Details (Only View)`}</span>
            </div>
            <div className='iform-custom-css'>

                <div className='p-2'>
                    <form id='permitForm'>
                        <div className="row m-2">
                            <div className="col-sm-6 pr-4">
                                <div className="row mb-3">
                                    <label htmlFor="minesConsignerName" className="col-sm-4 col-form-label col-form-label-sm">* Mines/Consigner</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="minesConsignerName" {...register("minesConsignerName")} readOnly />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="permitNumber" className="col-sm-4 col-form-label col-form-label-sm">* Permit Number</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="permitNumber" {...register("permitNumber")} readOnly />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="date" className="col-sm-4 col-form-label col-form-label-sm">Date</label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control form-control-sm" id="date" {...register("date")} readOnly />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="permitType" className="col-sm-4 col-form-label col-form-label-sm">Permit Type</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="permitType" {...register("permitType")} readOnly />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="exporter" className="col-sm-4 col-form-label col-form-label-sm">Exporter/Consignee</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="exporter" {...register("exporter")} readOnly />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="trader" className="col-sm-4 col-form-label col-form-label-sm">Trader/Billing To</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="trader" {...register("trader")} readOnly />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="loadingPoint" className="col-sm-4 col-form-label col-form-label-sm">Loading Point</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="loadingPoint" {...register("loadingPoint")} readOnly />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="destination" className="col-sm-4 col-form-label col-form-label-sm">Destination</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="destination" {...register("destination")} readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 pl-4">
                                <div className="row mb-3">
                                    <label htmlFor="ddmreturn" className="col-sm-4 col-form-label col-form-label-sm">Required DDM Return</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="ddmreturn" {...register("ddmreturn")} readOnly />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="material" className="col-sm-4 col-form-label col-form-label-sm">Material</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="material" {...register("material")} readOnly />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="validFrom" className="col-sm-4 col-form-label col-form-label-sm">Valid From</label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control form-control-sm" id="validFrom" {...register("validFrom")} readOnly />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="validUpto" className="col-sm-4 col-form-label col-form-label-sm">Valid Upto</label>
                                    <div className="col-sm-8">
                                        <input type="date" className="form-control form-control-sm" id="validUpto" {...register("validUpto")} readOnly />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="challanStatus" className="col-sm-4 col-form-label col-form-label-sm">Challan Status</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="challanStatus" {...register("challanStatus")} readOnly />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="advInp" className="col-sm-4 col-form-label col-form-label-sm">Advanced Input Required</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="advInp" {...register("advInp")} readOnly />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="tollGate" className="col-sm-4 col-form-label col-form-label-sm">Reimburse Toll Gate</label>
                                    <div className="col-sm-8">
                                        <input type="text" className="form-control form-control-sm" id="tollGate" {...register("tollGate")} readOnly />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="note" className="col-sm-4 col-form-label col-form-label-sm">Note</label>
                                    <div className="col-sm-8">
                                        <textarea className="form-control form-control-sm" id="note" {...register("note")} readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className='container p-2'>
                    <form id="stackForm">
                        <div className='row m-2'>
                            <div className='col-sm-4'>
                                <div className="row mb-3">
                                    <label htmlFor="stackNo" className="col-sm-4 col-form-label col-form-label-sm">
                                        Stack Number
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="stackNo"
                                            placeholder="Enter stack number"
                                            {...registerStack("stackNo")}
                                        />

                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-4'>
                                <div className="row mb-3">
                                    <label htmlFor="quantity" className="col-sm-4 col-form-label col-form-label-sm">
                                        Quantity
                                    </label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            id="quantity"
                                            placeholder="Enter quantity"
                                            {...registerStack("quantity")}
                                        />

                                    </div>
                                </div>
                            </div>

                            <div className='col-sm-4'>
                                <button type="submit" className="btn btn-sm btn-primary" disabled>Add</button>
                                <button type="button" className="btn btn-sm btn-outline-primary" disabled>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className='container m-2'>
                        <div className='row'>
                            <div className='col-8'>

                                <div className="overflow-auto">
                                    <table className="table table-sm table-bordered table-hover align-middle">
                                        <thead className="">
                                            <tr className='text-center table-dark'>
                                                <th className='p-1' scope="col">SL No.</th>
                                                <th className='p-1' scope="col">Stack No</th>
                                                <th className='p-1' scope="col">Quantity in Tons</th>
                                            </tr>
                                        </thead>
                                        <tbody className='font-weight-normal textColor'>
                                            {stackTableData.length > 0 ? stackTableData.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className='p-1 text-center'>{idx + 1}</td>
                                                    <td className='p-1 text-center'>{item.stackNumber}</td>
                                                    <td className='p-1 text-center'>{item.stackQuantity}</td>
                                                </tr>
                                            )) : ""
                                            }

                                        </tbody>

                                    </table>

                                </div>


                            </div>
                            <div className='col-4'>

                            </div>

                            <div className="row m-3">
                                <label htmlFor="QtyInTons" className="col-sm-2 col-form-label col-form-label-sm">Quantity in Tons</label>
                                <div className="col-sm-4">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        id="QtyInTons"
                                        min="0"
                                        {...register("QtyInTons")}

                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className='container mb-2 text-center'>
                        <div className='mx-auto'>
                            <button type="button" className="m-2 btn btn-primary" disabled>
                                Save
                            </button>
                            <button type="reset" className="m-2 btn btn-outline-primary ml-2" disabled>Clear</button>
                        </div>

                    </div>

                </div>
            </div>
            <div className='container mt-5'>
                <Tabs
                    defaultActiveKey="vehicle-rate"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="vehicle-rate" title="Vehicle Rate (For Payment)">
                        <VehicleRateReadOnly rateData={vehicleRateData} />
                    </Tab>
                    <Tab eventKey="shortage-calculation" title="Shortage Calculation">
                        <ShortageDataReadOnly shortageData={shortageData} />
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}

export default PermitMasterReadOnlyDynamicPage;
