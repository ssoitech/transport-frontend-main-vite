import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import { useForm, Controller } from 'react-hook-form';
import AutoComplete from '../../searchComponent/AutoComplete';
import axios from "axios";
import axiosInstance from '../../../config/AxiosConfig';

function AddNewTruck() {
    const [searchedOwnerData, setSearchedOwnerData] = useState();
    const [ownerData, setOwnerData] = useState();
    const [truckList, setTruckList] = useState([]);
    const [isTruckDataSaved, setIsTruckDataSaved] = useState(false);
    const [ownerDataId, setOwnerDataId] = useState();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            type: "", // Ensure default is empty so validation triggers
            rcStatus: "",    // Ensure default is empty so validation triggers
        }
    });

    const {
        register: registerOwnerData,
        getValues: getOwnerDataValue,
        setValue: setOwnerDataValue,
        reset: resetOwnerData
    } = useForm();



    async function getData() {
        try {
            if (!ownerDataId) {
                return;
            }
            await axiosInstance.get(`/api/v1/get/all/truck-details-by-id/${ownerDataId}`)
                .then(function (response) {
                    // handle success
                    setTruckList(response.data);
                    setIsTruckDataSaved(false);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        } catch (e) {

        }

    }

    useEffect(() => {
        if (searchedOwnerData) {
            setOwnerDataId(searchedOwnerData.id);
        }
    }, [searchedOwnerData])

    useEffect(() => {
        if (isTruckDataSaved) {
            getData();
        }
        setIsTruckDataSaved(false);
    }, [isTruckDataSaved])

    useEffect(() => {
        if (!ownerData) return;

        setOwnerDataValue("name", ownerData.challanHolderName);
        setOwnerDataValue("contactNumber", ownerData.contactNumber);
        setOwnerDataValue("panNumber", ownerData.panNumber);
        setOwnerDataValue("tdsPercent", ownerData.tdsPer);
        setOwnerDataValue("address", ownerData.address);
        setOwnerDataValue("remark", ownerData.remark);
        setOwnerDataValue("bankAccountNumber", ownerData.accountNumber);
        setOwnerDataValue("bankName", ownerData.bankName);
        setOwnerDataValue("ifsCode", ownerData.ifscCode)
        setOwnerDataValue("branchName", ownerData.branch);


    }, [ownerData])



    const handleFindByName = async () => {

        try {
            if (!searchedOwnerData) {
                return;
            } else {

                if (!searchedOwnerData.id) {
                    return;
                }

                const data = {
                    "id": searchedOwnerData.id ? searchedOwnerData.id : null,

                }
                const ownerId = searchedOwnerData.id
                await axiosInstance.get(`/api/v1/challan-holder/get/one/details-by-id/${ownerId}`)
                    .then(function (response) {
                        // handle success
                        console.log(response.data);
                        setOwnerData(response.data.ownerData[0]);
                        setTruckList(response.data.truckList);
                        // setUpdateData(false);
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
            }


        } catch (e) {

        }

    }

    const onSubmit = async (data) => {
        // Add hardcoded values to the form data
        if (!searchedOwnerData) {
            Swal.fire({
                title: "Please Select Owner",
                icon: "warning",
            });
            return;
        }
        if (!searchedOwnerData.id) {
            return
        }
        const formData = {
            ...data,
            "ownerId": searchedOwnerData.id,
        };

        try {
            const response = await axiosInstance.post("/api/v1/add/one/truck-details", formData);
            if (response.status === 201 && response.data === "success") {
                setIsTruckDataSaved(true);
                Swal.fire({
                    title: "Truck Details Added Successfully.",
                    icon: "success",
                });

            } else {
                // console.error("Error:", response.statusText);
                // alert("Failed to submit data.");
                Swal.fire({
                    title: "Internal Server Error!!",
                    icon: "error",
                });
            }
        } catch (error) {

            Swal.fire({
                text: "An error occurred while submitting data.",
                icon: "error",
            });
        }
    };

    const handleClear = () => {
        resetOwnerData();
    }



    return (
        <div>
            <div className="container">
                <div className="row">
                    {/* First Label, Input, and Search Button */}
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="ownerName" className="form-label">
                            Owner Name
                        </label>
                        <div className="d-flex">
                            <AutoComplete
                                placeholder={"Search here"}
                                url={'/api/v1/challan-holder/get/all/names-ids?keyword='}
                                datakey={"name"}
                                customLoading={<>Loading..</>}
                                onSelect={(res) => setSearchedOwnerData(res)}
                                onChange={(input) => { }}
                                onBlur={(e) => { }}
                                onFocus={(e) => { }}
                                customStyles={{}}
                            />
                            <button className="btn btn-sm btn-primary ml-2" type="button" onClick={handleFindByName}>
                                Find
                            </button>

                            <button className="btn btn-sm btn-outline-primary ml-2" type="button" onClick={handleClear}>
                                New
                            </button>
                        </div>
                    </div>

                    {/* Second Label, Input, and Search Button */}
                    <div className="col-12 col-md-6 mb-3">
                        <label htmlFor="panNumber" className="form-label">
                            PAN Number
                        </label>
                        <div className="d-flex">
                            <AutoComplete
                                placeholder={"Search here"}
                                url={'/api/v1/challan-holder/get/all/pan-no-ids?keyword='}
                                datakey={"name"}
                                customLoading={<>Loading..</>}
                                onSelect={(res) => setSearchedOwnerData(res)}
                                onChange={(input) => { }}
                                onBlur={(e) => { }}
                                onFocus={(e) => { }}
                                customStyles={{}}
                            />
                            <button className="btn btn-sm btn-primary ml-2" type="button" onClick={handleFindByName}>
                                Find
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <hr />


            <div className="container">
                <form>
                    <div className="row mb-3">
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                name='name'
                                id="name"
                                {...registerOwnerData("name")}
                            />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="contactNumber"
                                name='contactNumber'
                                {...registerOwnerData("contactNumber")}
                            />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="panNumber" className="form-label">PAN Number</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="panNumber"
                                name='panNumber'
                                {...registerOwnerData("panNumber")}
                            />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="tdsPercent" className="form-label">TDS Percent</label>
                            <input
                                type="number"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="tdsPercent"
                                name='tdsPercent'
                                {...registerOwnerData("tdsPercent")}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="address" className="form-label">Address</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="address"
                                name='address'
                                {...registerOwnerData("address")}
                            />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="remark" className="form-label">Remark</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="remark"
                                name='remark'
                                {...registerOwnerData("remark")}
                            />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="bankAccountNumber" className="form-label">Bank Account Number</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="bankAccountNumber"
                                name='bankAccountNumber'
                                {...registerOwnerData("bankAccountNumber")}
                            />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="bankName" className="form-label">Bank Name</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="bankName"
                                name='bankName'
                                {...registerOwnerData("bankName")}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="ifsCode" className="form-label">IFS Code</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="ifsCode"
                                name='ifsCode'
                                {...registerOwnerData("ifsCode")}
                            />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="branchName" className="form-label">Branch Name</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="branchName"
                                {...registerOwnerData("branchName")}
                            />

                        </div>
                    </div>
                </form>
            </div>

            <div className='text-center'>
                <h5 className='h5 text-primary-emphasis'>Add Truck Details</h5>
            </div>

            <hr />
            <div className="container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row mb-3">
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="truckNumber" className="form-label">Truck Number</label>
                            <input
                                type="text"
                                className={`form-control form-control-sm ${errors.truckNumber ? 'is-invalid' : 'border-dark-subtle'}`}
                                style={{ fontWeight: 500 }}
                                id="truckNumber"
                                {...register("truckNumber", { required: "Truck Number is required" })}
                            />
                            {errors.truckNumber && <div className="invalid-feedback">{errors.truckNumber.message}</div>}
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="type" className="form-label">Type of Vehicle</label>
                            <select
                                className={`form-select form-select-sm ${errors.type ? 'is-invalid' : 'border-dark-subtle'}`}
                                style={{ fontWeight: 500 }}
                                id="type"
                                name='type'
                                {...register("type", { required: "Please select a type of vehicle" })}
                            >
                                <option value="">Select Vehicle Type</option> {/* Empty option for validation */}
                                <option value="6">6 Wheel</option>
                                <option value="8">8 Wheel</option>
                                <option value="10">10 Wheel</option>
                                <option value="12">12 Wheel</option>
                                <option value="14">14 Wheel</option>
                                <option value="16">16 Wheel</option>
                                <option value="18">18 Wheel</option>
                                <option value="22">22 Wheel</option>
                            </select>
                            {errors.vehicleType && <div className="invalid-feedback">{errors.vehicleType.message}</div>}
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="tokenNo" className="form-label">Token Number</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                style={{ fontWeight: 500 }}
                                id="tokenNo"
                                name='tokenNo'
                                {...register("tokenNo")}
                            />
                        </div>
                        <div className="col-12 col-md-3 mb-3">
                            <label htmlFor="rcStatus" className="form-label">RC Status</label>
                            <select
                                className={`form-select form-select-sm ${errors.rcStatus ? 'is-invalid' : 'border-dark-subtle'}`}
                                style={{ fontWeight: 500 }}
                                id="rcStatus"
                                name='rcStatus'
                                {...register("rcStatus", { required: "Please select RC status" })}
                            >
                                <option value="">Select RC Status</option> {/* Empty option for validation */}
                                <option value="N">Not Submitted</option>
                                <option value="Y">Submitted</option>
                            </select>
                            {errors.rcStatus && <div className="invalid-feedback">{errors.rcStatus.message}</div>}
                        </div>
                    </div>

                    <div className="mb-3 text-center">
                        <button type="submit" className="btn btn-sm btn-primary m-2">Add</button>
                        <button type="button" className="btn btn-sm btn-secondary m-2">Clear</button>

                    </div>
                </form>
            </div>
            <div className="overflow-auto mt-4">
                <table className="table table-striped table-responsive table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr className='text-center'>
                            <th className='p-1' scope="col">SL. Number</th>
                            <th className='p-1' scope="col">Truck Number</th>
                            <th className='p-1' scope="col">Type of Vehicle</th>
                            <th className='p-1' scope="col">Token Number</th>
                            <th className='p-1' scope="col">RC Status</th>
                            <th className='p-1' scope="col" colSpan="2">Actions</th>
                        </tr>
                    </thead>
                    {
                        truckList ?
                            <tbody>
                                {truckList.map((record, index) => (
                                    <tr key={index}>
                                        <td className='p-1 text-center' scope="col">{index + 1}</td>
                                        <td className='p-1' scope="col">{record.truckNumber}</td>
                                        <td className='p-1 text-center' scope="col">{`${record.type} Wheel`}</td>
                                        <td className='p-1 text-center' scope="col">{record.tokenNo}</td>
                                        <td className='p-1 text-center' scope="col">{record.rcStatus === 'Y' ? "Submitted" : "Not Submitted"}</td>
                                        <td className='p-1 text-center' scope="col" data-toggle="modal" data-target="#editModal"><i className="bi bi-pencil-square text-primary"></i></td>
                                        <td className='p-1 text-center' scope="col"><i className="bi bi-trash text-danger"></i></td>
                                    </tr>
                                ))}
                            </tbody> : "No Truck To Display.."
                    }

                </table>
            </div>
        </div>
    )
}

export default AddNewTruck;
