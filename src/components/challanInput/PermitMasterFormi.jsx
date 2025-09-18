import React, { useEffect } from 'react';
import './css/PermitMaster.css';
import { Tab, Tabs } from 'react-bootstrap';
import { useState } from 'react';
import Select from 'react-select';
import { toast, Toaster } from 'react-hot-toast';
import ShortageCalculation from './permitMasterSection/ShortageCalculation';
import VehicleRateForPayment from './permitMasterSection/VehicleRateForPayment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Swal from "sweetalert2";
import axiosInstance from '../../config/AxiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PermitModal from './permitMasterSection/PermitModal';


var tempStackData = []
localStorage.setItem("tempStackData", JSON.stringify(tempStackData));

const defaultOptions = [
    { name: '', label: 'loading..' },
];

let count = 0;

const challanStatusOptions = [
    { name: "O", label: 'To Be Billed' },
    // { name: "to_pay", label: 'To Pay' }
]

const advanceInputRequiredoptions = [
    { name: "N", label: 'No' },
    { name: "Y", label: 'Yes' }
]

const ddmReturnOptions = [
    { name: "N", label: 'No' },
    { name: "Y", label: 'Yes' }
]

const tollgateOptions = [
    { name: "N", label: 'No' },
    { name: "Y", label: 'Yes' }
]

const permitTypeOptions = [
    { name: "L", label: 'Railway Siding' },
    { name: "R", label: 'By Road Work' }
]
function PermitMasterFormi() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [stackTableData, setStackTableData] = useState([]);
    const [stackNo, setStackNo] = useState("NA");
    const [stackQuantity, setStackQuantity] = useState("");

    const [allConsignerNames, setAllConsignerNames] = useState(null);
    const [allExporterNames, setAllExporterNames] = useState(null);
    const [allTraderNames, setAllTraderNames] = useState(null);
    const [allMaterials, setAllMaterials] = useState(null);
    const [allLoadingPoints, setAllLoadingPoints] = useState(null);
    const [allUnloadingPoints, setAllUnloadingPoints] = useState(null);

    const [startSpneer, setStartSpneer] = useState(false);


    const [minesOrConsignerNameId, setMinesOrConsignerNameId] = useState(null);
    const [exporterNameId, setExporterNameId] = useState(null);
    const [traderNameId, setTraderNameId] = useState(null);
    const [materialId, setMaterialId] = useState("");
    const [loadingPointId, setLoadingPointId] = useState("");
    const [destinationId, setDestinationId] = useState("");

    const [date, setDate] = useState();

    const [permitNumber, setPermitNumber] = useState("");
    const [updatedTempStackData, setUpdatedTempStackData] = useState(false);
    const [permitType, setPermitType] = useState("");
    const [ddmReturn, setDdmReturn] = useState("");
    const [validFromDate, setValidFromDate] = useState("");
    const [validUptoDate, setValidUptoDate] = useState("");
    const [challanStatus, setChallanStatus] = useState("");
    const [advancedInputRequired, setAdvancedInputRequired] = useState("");
    const [reimburseTollGate, setReimburseTollGate] = useState("");
    const [note, setNote] = useState("");


    const [vehicleRateSection, setVehicleRateSection] = useState(false);


    const [totalQuantity, setTotalQuantity] = useState(0);


    const [permitNumberIsEmpty, SetPermitNumberIsEmpty] = useState(false);

    const [minesOrConsignerNameIsEmpty, setMinesOrConsignerNameIsEmpty] = useState(false);
    const [permitDataIsSaved, setPermitDataIsSaved] = useState(false);

    // const [exporterNameIsEmpty, setExporterNameIsEmpty] = useState(false);
    // const [dateIsEmpty, setDateIsEmpty] = useState(false);
    // const [permitTypeIsEmpty, setPermitTypeIsEmpty] = useState(false);
    // const [traderNameIsEmpty, setTraderNameIsEmpty] = useState(false);
    // const [loadingPointIsEmpty, setLoadingPointIsEmpty] = useState(false);
    // const [destinationIsEmpty, setDestinationIsEmpty] = useState(false);
    // const [ddmReturnIsEmpty, setDdmReturnIsEmpty] = useState(false);
    // const [materialIsEmpty, setMaterialIsEmpty] = useState(false);
    // const [validFromDateIsEmpty, setValidFromDateIsEmpty] = useState(false);
    // const [validUptoDateIsEmpty, setValidUptoDateIsEmpty] = useState(false);
    // const [challanStatusIsEmpty, setChallanStatusIsEmpty] = useState(false);
    // const [advancedInputIsEmpty, setAdvancedInputIsEmpty] = useState(false);
    // const [tollgateIsEmpty, setTollgateIsEmpty] = useState(false);
    // const [totalQuantityIsEmpty, setTotalQuantityIsEmpty] = useState(false);
    // const [iformDtataIsSaved, setIformDataIsSaved] = useState(false);

    const [permitNumberIsDuplicate, setPermitNumberIsDuplicate] = useState(false);
    const [isPermitNumberFieldDesabled, setIsPermitNumberFieldDesabled] = useState(false);


    const handleDate = (date) => {
        setDate(format(date, 'yyyy-MM-dd'));
    }

    const handleValidFromDate = (date) => {
        setValidFromDate(format(date, 'yyyy-MM-dd'));
    }

    const handleValidToDate = (date) => {
        setValidUptoDate(format(date, 'yyyy-MM-dd'));
    }


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



    async function getAllConsignerNames() {

        await axiosInstance.get('/api/v1/get/all/consigner-owner-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        name: element[0],
                        label: element[1]
                    };
                });
                setAllConsignerNames(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllExporterNames() {

        await axiosInstance.get('/api/v1/get/all/exporter-consignee-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        name: element[0],
                        label: element[1]
                    };
                });

                setAllExporterNames(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllTraderNames() {

        await axiosInstance.get('/api/v1/get/all/trader-billing-party-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        name: element[0],
                        label: element[1]
                    };
                });

                setAllTraderNames(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }
    async function getAllMaterialNames() {

        await axiosInstance.get('/api/v1/get/all/transporting-material-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        name: element[0],
                        label: element[1]
                    };
                });

                setAllMaterials(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }
    async function getAllLoadingPointNames() {

        await axiosInstance.get('/api/v1/get/all/loading-point-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        name: element[0],
                        label: element[1]
                    };
                });

                setAllLoadingPoints(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    async function getAllUnloadingPointNames() {

        await axiosInstance.get('/api/v1/get/all/unloading-point-names')
            .then(function (response) {
                // handle success
                const arrayOfObjects = response.data.map(element => {
                    return {
                        name: element[0],
                        label: element[1]
                    };
                });

                setAllUnloadingPoints(arrayOfObjects);

            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
    }

    useEffect(() => {
        getAllConsignerNames();
        getAllExporterNames();
        getAllTraderNames();
        getAllMaterialNames();
        getAllLoadingPointNames();
        getAllUnloadingPointNames();
    }, [])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("tempStackData"));
        setStackTableData(data);
        if (data) {
            var countQuantity = 0;
            data.forEach(element => {
                console.log(element.stackQuantity);
                countQuantity += Number(element.stackQuantity);
            });

            setTotalQuantity(countQuantity);
        }
        setStackNo("");
        setStackQuantity("");
        document.getElementById("stackForm").reset();
        setUpdatedTempStackData(false);
    }, [updatedTempStackData])

    function handleStack(e) {
        const data = [];
        e.preventDefault()
        data.push({
            "stackNo": stackNo,
            "quantity": stackQuantity
        });
        setStackTableData(data);

    }



    function handleAddStack(e) {
        e.preventDefault();
        if (!permitNumber) {
            SetPermitNumberIsEmpty(true);
            Swal.fire({
                title: "Permit Number Should Not Be Empty!!",
                confirmButtonText: "OK",
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    return;
                }
            });
            return
        }
        if (!stackQuantity || stackQuantity < 0) {
            Swal.fire({
                title: "Please Enter Stack Quantity",
                confirmButtonText: "OK",
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    return;
                }
            });
            return;
        }

        var tempStackData = JSON.parse(localStorage.getItem("tempStackData"));
        if (!tempStackData) {
            var tempStackData = [];
            const sData = {
                "permitNumber": permitNumber,
                "stackNumber": stackNo ? stackNo : "NA",
                "stackQuantity": stackQuantity
            }
            console.log(typeof (tempStackData));
            console.log(tempStackData);
            // tempStackData.push(sData);
            localStorage.setItem("tempStackData", JSON.stringify(tempStackData));
        }
        else {
            const data = {
                "permitNumber": permitNumber,
                "stackNumber": stackNo ? stackNo : "NA",
                "stackQuantity": stackQuantity,
                "createdBy": "",
                "updatedBy": ""
            }
            tempStackData.push(data);
            localStorage.setItem("tempStackData", JSON.stringify(tempStackData));
            setUpdatedTempStackData(true);
        }

    }

    function handleDeleteStack(id) {
        var tempStackData = JSON.parse(localStorage.getItem("tempStackData"));
        if (!tempStackData) {
            return;
        } else {
            tempStackData.splice(id, 1);
            localStorage.setItem("tempStackData", JSON.stringify(tempStackData));
            setUpdatedTempStackData(true);
        }
    }


    async function postData(fdata) {
        toast.success("Saving...");
        const stData = JSON.parse(localStorage.getItem("tempStackData"));
        if (!stData) {
            setStartSpneer(false);
            toast.dismiss();
            Swal.fire({
                icon: "error",
                text: "Some Error Occured While Updating Stack Data!!",
                confirmButtonText: "OK",
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    return;
                }
            });
            return;
        }

        const finalData = {
            "permitData": fdata,
            "stackData": stData
        }

        await axiosInstance.post('/api/v1/add/iform',
            finalData
        )
            .then(function (response) {
                // handle success

                if (response.data === "success" && response.status === 201) {
                    setStartSpneer(false);
                    toast.dismiss();
                    setPermitDataIsSaved(true);
                    setIsPermitNumberFieldDesabled(true);
                    Swal.fire({
                        icon: "success",
                        title: "Permit Data Saved!",
                        confirmButtonText: "Next",
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            return;
                        }
                    });

                } else if (response.data === "duplicate" && response.status === 409) {
                    setStartSpneer(false);
                    toast.dismiss();
                    setStartSpneer(false);
                    setPermitNumberIsDuplicate(true);
                    setPermitDataIsSaved(false);
                    Swal.fire({
                        icon: "error",
                        title: "This Permit Number Already Exists.",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            return;
                        }
                    });

                } else {
                    toast.dismiss();
                    setStartSpneer(false);
                    setPermitDataIsSaved(false);
                    Swal.fire({
                        icon: "error",
                        title: "Something Went Wrong!!",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            return;
                        }
                    });
                    // setPostError(true);
                }
            })
            .catch(function (error) {
                // handle error
                setStartSpneer(false);
                Swal.fire({
                    icon: "error",
                    title: "Some Error Occures!!",
                    confirmButtonText: "Ok",
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        return;
                    }
                });
                console.log(error)
                if (error.response.data === "duplicate" && error.response.status === 302) {
                    toast.dismiss();
                    setStartSpneer(false);
                    setPermitNumberIsDuplicate(true);
                    setPermitDataIsSaved(false);
                    Swal.fire({
                        icon: "error",
                        title: "This Permit Number Already Exists.",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                            return;
                        }
                    });
                }

            });
    }

    async function handleSaveAndNext(e) {
        e.preventDefault();
        if (e.key === "Enter") {
            e.preventDefault();
            return;
        }
        setStartSpneer(true);

        if (!minesOrConsignerNameId) {
            setMinesOrConsignerNameIsEmpty(true);
            return;
        }
        if (!permitNumber) {
            SetPermitNumberIsEmpty(true);
            return;
        }

        const allData = {
            "permitNumber": permitNumber,
            "consignorId": minesOrConsignerNameId,
            "permitType": permitType,
            "date": date,
            "exporterId": exporterNameId,
            "traderId": traderNameId,
            "loadingPointId": loadingPointId,
            "destinationId": destinationId,
            "ddmReturn": ddmReturn,
            "materialId": materialId,
            "challanStatus": challanStatus,
            "advInput": advancedInputRequired,
            "reimburseTollGate": reimburseTollGate,
            "note": note,
            "totalQantity": totalQuantity,
            "validFrom": validFromDate,
            "validTo": validUptoDate
        }

        await postData(allData);


    }

    function iformClear() {
        setPermitNumber("");
        setMinesOrConsignerNameId(null);
        setPermitType("");
        setDate("");
        setExporterNameId(null);
        setTraderNameId("");
        setLoadingPointId("");
        setDestinationId("");
        setDdmReturn("");
        setMaterialId("");
        setChallanStatus("");
        setAdvancedInputRequired("");
        setReimburseTollGate("");
        setNote("");
        setTotalQuantity("");
    }

    function handleClear(e) {
        e.preventDefault();
        iformClear();
        setVehicleRateSection(false);
        window.location.reload();
    }


    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
                <span className='mb-0 h6'>Transit Permit Entry</span>
            </div>
            <div className='iform-custom-css'>
                <div className='p-2'>
                    <form action="" id='permitForm'>
                        <div className="row m-2">
                            <div className="col-sm-6 pr-4">
                                <div className="row mb-3">
                                    <label htmlFor="minesConsignerName" className="col-sm-4 col-form-label col-form-label-sm"><span className='text-danger'>*</span> Mines/Consigner</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={allConsignerNames ? allConsignerNames : defaultOptions}
                                            placeholder="Select ..."
                                            name='exporterName'
                                            id='minesConsignerName'
                                            defaultValue={"hello"}
                                            onChange={(e) => { setMinesOrConsignerNameId(e.name) }}
                                            required={true}
                                        />
                                    </div>


                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="permitNumber" className="col-sm-4 col-form-label col-form-label-sm"><span className='text-danger'>*</span> Permit Number</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="permitNumber"
                                            disabled={isPermitNumberFieldDesabled}
                                            onChange={(e) => { setPermitNumber(e.target.value) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="date" className="col-sm-4 col-form-label col-form-label-sm">Date</label>
                                    <div className="col-sm-8">
                                        <div className="date-picker-container">
                                            <DatePicker
                                                className="date-picker-input pl-2"
                                                selected={date}
                                                onChange={handleDate}
                                                name="date"
                                                dateFormat="d-MMM-yyyy"
                                                placeholderText="Select a date"
                                                id="date"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="permitType" className="col-sm-4 col-form-label col-form-label-sm">Permit Type</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={permitTypeOptions ? permitTypeOptions : defaultOptions}
                                            placeholder="Select..."
                                            id='permitType'
                                            isSearchable="true"
                                            onChange={(e) => { setPermitType(e.name) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="exporterName" className="col-sm-4 col-form-label col-form-label-sm">Exporter/Consignee</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={allExporterNames ? allExporterNames : defaultOptions}
                                            placeholder="Select..."
                                            id='exporterName'
                                            onChange={(e) => { setExporterNameId(e.name) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="traderName" className="col-sm-4 col-form-label col-form-label-sm">Trader/Billing To</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={allTraderNames ? allTraderNames : defaultOptions}
                                            placeholder="Select..."
                                            id='traderName'
                                            onChange={(e) => { setTraderNameId(e.name) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="loadingPoint" className="col-sm-4 col-form-label col-form-label-sm">Loading Point</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={allLoadingPoints ? allLoadingPoints : defaultOptions}
                                            placeholder="Select..."
                                            id='loadingPoint'
                                            onChange={(e) => { setLoadingPointId(e.name) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="destination" className="col-sm-4 col-form-label col-form-label-sm">Destination</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={allUnloadingPoints ? allUnloadingPoints : defaultOptions}
                                            placeholder="Select..."
                                            id='destination'
                                            onChange={(e) => { setDestinationId(e.name) }}
                                        />
                                    </div>
                                </div>


                            </div>
                            <div className="col-sm-6 pl-4">
                                <div className="row mb-3">
                                    <label htmlFor="ddm" className="col-sm-4 col-form-label col-form-label-sm">Required DDM Return</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={ddmReturnOptions ? ddmReturnOptions : defaultOptions}
                                            placeholder="Select..."
                                            id='ddm'
                                            isSearchable="true"
                                            onChange={(e) => { setDdmReturn(e.name) }}
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <label htmlFor="material" className="col-sm-4 col-form-label col-form-label-sm">Material</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={allMaterials ? allMaterials : defaultOptions}
                                            placeholder="Select Material..."
                                            id='material'
                                            onChange={(e) => { setMaterialId(e.name) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="validFrom" className="col-sm-4 col-form-label col-form-label-sm">Valid From</label>
                                    <div className="col-sm-8">
                                        <div className="date-picker-container">
                                            <DatePicker
                                                className="date-picker-input pl-2"
                                                selected={validFromDate}
                                                onChange={handleValidFromDate}
                                                name="validFrom"
                                                dateFormat="d-MMM-yyyy"
                                                placeholderText="Select a date"
                                                id="validFrom"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="validUpto" className="col-sm-4 col-form-label col-form-label-sm">Valid Upto</label>
                                    <div className="col-sm-8">
                                        <div className="date-picker-container">
                                            <DatePicker
                                                className="date-picker-input pl-2"
                                                selected={validUptoDate}
                                                onChange={handleValidToDate}
                                                name="validTo"
                                                dateFormat="d-MMM-yyyy"
                                                placeholderText="Select a date"
                                                id="validTo"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="challanStatus" className="col-sm-4 col-form-label col-form-label-sm">Challan Status</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={challanStatusOptions ? challanStatusOptions : defaultOptions}
                                            placeholder="Select Challan Status..."
                                            id='challanStatus'
                                            isSearchable="true"
                                            onChange={(e) => { setChallanStatus(e.name) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="advInput" className="col-sm-5 col-form-label col-form-label-sm">Advanced Input Required</label>
                                    <div className="col-sm-7">
                                        <Select
                                            options={advanceInputRequiredoptions ? advanceInputRequiredoptions : defaultOptions}
                                            placeholder="Select..."
                                            id='advInput'
                                            isSearchable="true"
                                            onChange={(e) => { setAdvancedInputRequired(e.name) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="reimburseToll" className="col-sm-4 col-form-label col-form-label-sm">Reimburse Toll Gate</label>
                                    <div className="col-sm-8">
                                        <Select
                                            options={tollgateOptions ? tollgateOptions : defaultOptions}
                                            placeholder="Select..."
                                            id='reimburseToll'
                                            isSearchable="true"
                                            onChange={(e) => { setReimburseTollGate(e.name) }}
                                        />
                                    </div>
                                </div>
                                <div className="row mb-3">
                                    <label htmlFor="note" className="col-sm-2 col-form-label col-form-label-sm">Note</label>
                                    <div className="col-sm-8">
                                        <textarea
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="note"
                                            placeholder=""
                                            onChange={(e) => { setNote(e.target.value) }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <Toaster
                        position="bottom-center"
                        reverseOrder={true}
                    />
                </div>

                <div className='container p-2'>
                    <form action="" id='stackForm'>
                        <div className='row m-2'>

                            <div className='col-sm-4'>
                                <div className="row mb-3">
                                    <label htmlFor="stackNo" className="col-sm-4 col-form-label col-form-label-sm">Stack Number</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            id="stackNo"
                                            placeholder="Enter stack number"
                                            onChange={(e) => { setStackNo(e.target.value) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <div className="row mb-3">
                                    <label htmlFor="quantity" className="col-sm-4 col-form-label col-form-label-sm">Quantity</label>
                                    <div className="col-sm-8">
                                        <input
                                            type="number"
                                            className="form-control form-control-sm"
                                            id="quantity"
                                            placeholder="Enter quantity"
                                            onChange={(e) => { setStackQuantity(e.target.value) }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-4'>
                                <button type="submit" form='permitForm' className="btn btn-sm btn-primary" onClick={(e) => { handleAddStack(e) }}>Add</button>
                                <button type="reset" form='permitForm' className="btn btn-sm btn-outline-primary ml-2" >Clear</button>
                            </div>

                        </div>
                    </form>
                    <div className='container m-2'>
                        <div className='row'>
                            <div className='col-8'>

                                <div className="overflow-auto">
                                    <table className="table table-sm table-bordered table-hover align-middle">
                                        <thead className="thead-dark">
                                            <tr className='text-center'>
                                                <th className='p-1' scope="col">SL No.</th>
                                                <th className='p-1' scope="col">Stack No</th>
                                                <th className='p-1' scope="col">Quantity in Tons</th>

                                                <th className='p-1' scope="col">Actions</th>
                                            </tr>
                                        </thead>

                                        {stackTableData &&
                                            <tbody className='font-weight-normal textColor'>
                                                {stackTableData?.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className='p-1 text-center'>{idx + 1}</td>
                                                        <td className='p-1 text-center'>{item.stackNumber}</td>
                                                        <td className='p-1 text-center'>{item.stackQuantity}</td>
                                                        <td className='p-1 text-center custom-hover-delete-td'><i className="bi bi-trash p-1 rounded custom-hover-delete-icon" onClick={() => { handleDeleteStack(idx) }}></i></td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        }
                                    </table>

                                </div>


                            </div>
                            <div className='col-4'>

                            </div>

                            <div className="row m-3">
                                <label htmlFor="colFormLabelSm" className="col-sm-2 col-form-label col-form-label-sm">Quantity in Tons</label>
                                <div className="col-sm-4">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        id="colFormLabelSm"
                                        min="0"
                                        value={totalQuantity}
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className='container mb-2 text-center'>
                        <div className='mx-auto'>
                            <button type="button" className="m-2 btn btn-primary" onClick={(e) => { handleSaveAndNext(e) }}>
                                {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                                </div>}
                                <span>Save</span>
                            </button>
                            <button type="reset" className="m-2 btn btn-outline-primary ml-2" onClick={(e) => { handleClear(e) }}>Clear</button>
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
                        <VehicleRateForPayment permitNo={permitNumber} />
                    </Tab>
                    <Tab eventKey="shortage-calculation" title="Shortage Calculation">
                        <ShortageCalculation permitNo={permitNumber} />
                    </Tab>
                </Tabs>
            </div>
            <div className='container mb-2'>
                <div className='text-center'>
                    <PermitModal />
                    <button type="button" className="m-4 btn btn-sm btn-primary" onClick={(e) => { handleClear(e) }}>New Permit</button>

                </div>

            </div>

        </div>
    )
}

export default PermitMasterFormi
