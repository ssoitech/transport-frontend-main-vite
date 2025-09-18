import React, { useEffect, useState } from "react";
import './css/challanUnLoading.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { differenceInDays } from 'date-fns';
import axiosInstance from "../../config/AxiosConfig";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AutoComplete from "../searchComponent/AutoComplete";


function ChallanUnLoadingEntry() {
  const accessDetails = useSelector((state) => state.access.accessDetails);
  const navigate = useNavigate();

  const [data, setData] = useState();
  const [challanNoIsEmpty, setChallanNoIsEmpty] = useState()
  const [isSearching, setIsSearching] = useState(false);
  const [startSpneer, setStartSpneer] = useState(false);
  const [challanStatus, setChallanStatus] = useState();

  const [tpIsSearching, setTpIsSearching] = useState();

  const [tpNumber, setTpNumber] = useState("");
  const [challanNumber, setChallanNumber] = useState("");


  const [unLoadingDate, setUnloadingDate] = useState(null);
  const handleDateChange = (date) => {
    setUnloadingDate(date);
  };

  const [loadingDate, setLoadingDate] = useState(null);
  const handleLoadingDate = (date) => {
    setLoadingDate(date);
  };

  const statusColor = [
    {
      status: "transit",
      color: "bg-danger text-light pl-2 pr-2 py-1 border-5 rounded-2"
    },
    {
      status: "unloaded",
      color: "bg-dark text-light pl-2 pr-2 py-1 border-5 rounded-2"
    },
    {
      status: "received",
      color: "bg-warning pl-2 pr-2 py-1 border-5 rounded-2"
    },
    {
      status: "paid",
      color: "bg-success text-light pl-2 pr-2 py-1 border-5 rounded-2"
    }
  ]

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();


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
    if (!data) return;

    if (data.status !== "transit" && data.status !== "unloaded") {
      Swal.fire({
        text: "Challan " + data.status,
        icon: "info",
      });

      return;
    }

    setChallanStatus(data.status ? data.status : "");
    setValue("challanNumber", data.challanNumber);
    // setValue("tpNumber", data.tpNumber.split("/")[0]);
    // setValue("passNo", data.tpNumber.split("/")[1]);
    setValue("truckNumber", data.truckNumber);
    setValue("stackNo", "");
    setLoadingDate(data.loadDate);
    setValue("enteredBy", " ");
    setValue("loadingSlip", data.invNumber);
    setValue("challanNo", data.challanNumber);
    setValue("tpNo", data.tpNumber);
    setValue("mineralSource", data.material);
    setValue("exporterName", data.exporterName);
    setValue("loadingPoint", data.loadingPoint);
    setValue("unLoadingPoint", data.unLoadingPoint);
    setValue("material", data.material);
    setValue("transRate", data.vehicleRate);
    setValue("hsdIssued", data.hsdIssued);
    setValue("slipNo", " ");
    setValue("petrolPump", data.petrolpumpName);
    setValue("hsdRate", data.hsdAdvance);
    setValue("advance", data.cashAdvance);
    setValue("officeExpenses", data.officeExpenses);
    setValue("driverWelfare", data.driverWelfare);
    setValue("challanAmount", data.challanAmount);
    setValue("hsdAmount", data.hsdAdvance);
    setValue("truckOwner", data.vehicleOwner);
    setValue("contactNo", data.driverMobileNo);
    setValue("loadTruck", data.truckNumber);
    setValue("loadWeight", data.loadWeight);

    setUnloadingDate(data.unloadDate ? data.unloadDate : unLoadingDate);
    setValue("deliveryDays", data.deliveryDays ? data.deliveryDays : "");
    setValue("unloadTruck", data.unloadTruck ? data.unloadTruck : "");
    setValue("wheelNo", data.truckWheelNo ? data.truckWheelNo : "");
    setValue("unloadGross", data.unloadingGross ? data.unloadingGross : "");
    setValue("unloadTare", data.unloadingTare ? data.unloadingTare : "");
    setValue("netUnloaded", data.netUnloaded ? data.netUnloaded : "");
  }, [data])

  useEffect(() => {

    if (loadingDate && unLoadingDate) {
      console.log(format(loadingDate, "yyyy-MM-dd"), format(unLoadingDate, "yyyy-MM-dd"))

      let date1 = format(loadingDate, "yyyy-MM-dd");
      let date2 = format(unLoadingDate, "yyyy-MM-dd");

      // Use differenceInDays to calculate the difference
      const daysDifference = differenceInDays(date2, date1);
      setValue("deliveryDays", daysDifference);
    }

  }, [loadingDate, unLoadingDate])

  const arrayToObject = (data) => {
    const arrayOfObjects = data.map(innerArray => {
      return {
        permitNumber: innerArray[0],
        validFrom: innerArray[1],
        validTo: innerArray[2],
        consignerName: innerArray[3],
        exporterName: innerArray[4],
        loadingPoint: innerArray[5],
        unLoadingPoint: innerArray[6],
        material: innerArray[7],
        vehicleRate: innerArray[8],
        unionVehicleRate: innerArray[9],
        loadDate: innerArray[10],
        truckNumber: innerArray[11],
        truckType: innerArray[12],
        challanNumber: innerArray[13],
        tpNumber: innerArray[14],
        invNumber: innerArray[15],
        loadingGross: innerArray[16],
        loadingTare: innerArray[17],
        loadWeight: innerArray[18],
        hsdIssued: innerArray[19],
        hsdAdvance: innerArray[20],
        cashAdvance: innerArray[21],
        fieldStaffId: innerArray[22],
        fieldStaffName: innerArray[23],
        driverWelfare: innerArray[24],
        challanAmount: innerArray[25],
        totalAdvance: innerArray[26],
        otherDeduction: innerArray[27],
        deductionTowards: innerArray[28],
        truckDriver: innerArray[29],
        dlNumber: innerArray[30],
        driverMobileNo: innerArray[31],
        vehicleOwner: innerArray[32],
        mobAddress: innerArray[33],
        brokerName: innerArray[34],
        brokerId: innerArray[35],
        petrolpumpId: innerArray[36],
        petrolpumpName: innerArray[37],
        unloadDate: innerArray[38],
        deliveryDays: innerArray[39],
        unloadTruck: innerArray[40],
        truckWheelNo: innerArray[41],
        unloadingGross: innerArray[42],
        unloadingTare: innerArray[43],
        netUnloaded: innerArray[44],
        status: innerArray[45],
        paymentMode: innerArray[46],
        officeExpenses: innerArray[47]
      };
    });

    console.log(arrayOfObjects[0]);
    return arrayOfObjects[0];
  }


  async function getData(challanNo) {
    await axiosInstance.get(`/api/v1/get/one/challan-details/for-unloading/${challanNo}`)
      .then(function (response) {
        // handle success
        console.log(response.data[0]);
        setIsSearching(false);
        if (response.data.length === 0) {
          toast.error("Challan does not exist.");
        } else {

          setData(arrayToObject(response.data));

        }

      })
      .catch(function (error) {
        // handle error
        setIsSearching(false);
        toast('Some Error Occured!',
          {
            icon: '😐',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
        console.log(error);
      });
  }


  async function getDataByTp(tpNum) {
    console.log(tpNum);
    await axiosInstance.get(`/api/v1/get/one/challan/unloading/by-tp/${tpNum}`)
      .then(function (response) {
        // handle success
        console.log(response.data);
        setTpIsSearching(false);
        if (response.data.length === 0) {
          toast.error("Challan does not exist.");
        } else {

          setData(arrayToObject(response.data));

        }

      })
      .catch(function (error) {
        // handle error
        setTpIsSearching(false);
        toast('Some Error Occured!',
          {
            icon: '😐',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
        // console.log(error);
      });
  }



  const getDataByChallanNumber = async () => {
    setIsSearching(true);
    if (!challanNumber) {
      setChallanNoIsEmpty(true);
      setIsSearching(false);
      return;
    }
    await getData(challanNumber);
  }

  const getDataByTpNumber = async () => {
    setTpIsSearching(true);

    if (!tpNumber) {
      setTpIsSearching(false);
      return;
    }

    if (!tpNumber.name) {
      setTpIsSearching(false);
      return;
    }

    const formattedTpNum = tpNumber.name.replace(/\//g, "_");
    await getDataByTp(formattedTpNum);
  }

  // Saving the data
  async function postData(fdata) {
    setStartSpneer(true);
    await axiosInstance.post('/api/v1/update/one/challan/unload',
      fdata
    )

      .then(function (response) {
        // handle success
        console.log(response.data);
        if (response.data === "updated" && response.status === 201) {
          setStartSpneer(false);

          Swal.fire({
            text: "Challan Successfully Marked as Unloaded and Saved.",
            icon: "success",
          });

          // setIsSaving(false);
        } else if (response.data === "saved" && response.status === 201) {
          setStartSpneer(false);
          Swal.fire({
            text: "Challan Successfully Marked as Unloaded and Saved.",
            icon: "success",
          });

          // setIsSaving(false);
        }
        // setSubmitSuccess(true);

        // setIsSaved(true);
        // setUpdateData(true);

        else {
          // setPostError(true);
          setStartSpneer(false);
          // setIsSaving(false);
          Swal.fire({
            title: "Some Error Occured!!",
            icon: "error"
          });
        }
      })
      .catch(function (error) {
        // handle error
        setStartSpneer(false);
        // setIsSaving(false);
        Swal.fire({
          title: "Some Error Occured!!",
          icon: "error"
        });

      });
  }


  const onSubmit = async (formData) => {

    const unloadingData = {
      "tpNumber": getValues("tpNo"),
      "status": "unloaded",
      "unloadDate": unLoadingDate,
      "deliveryDays": getValues("deliveryDays"),
      "unloadTruck": getValues("unloadTruck"),
      "truckWheelNo": getValues("wheelNo"),
      "unloadingGross": getValues("unloadGross"),
      "unloadingTare": getValues("unloadTare"),
      "netUnloaded": getValues("netUnloaded"),
      "updatedBy": accessDetails.userId ? accessDetails.userId : null
    }

    await postData(unloadingData);

  }

  return (
    <>
      <div className="work-space-container">
        <form id="challanForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div
              className="alert alert-primary text-center font-weight-bold text-dark position-relative p-2"
              role="alert"
            >
              {/* name of the table */}
              <span className="mb-0 h6">Challan Un-Loading Entry(Manually)</span>
            </div>
            <div className="grid-section1">
              <div className="item1">
                <div className="">
                  <label for="challanNumber" className="form-label">Challan Number</label>
                  <div className="row">
                    <div className="col-auto">
                      {/* <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="challanNumber"
                        name="challanNumber"
                        {...register("challanNumber", { required: true })}
                      /> */}
                      <AutoComplete
                        placeholder={"Search here"}
                        url={'/api/v1/get/challan-number?keyword='}
                        datakey={"name"}
                        customLoading={<>Loading..</>}
                        onSelect={(res) => setChallanNumber(res)}
                        onChange={(input) => { }}
                        onBlur={(e) => { }}
                        onFocus={(e) => { }}
                        customStyles={{}}
                      />
                    </div>
                    <div className="col-auto">
                      <button type="button" class="btn btn-sm btn-primary mb-3" disabled={isSearching} onClick={getDataByChallanNumber}>Get</button>
                    </div>

                  </div>
                </div>
              </div>

              <div className="item1">
                <div className="">
                  <label for="tpNumber" className="form-label">TP Number</label>
                  <div className="row">
                    <div className="col-auto">
                      <AutoComplete
                        placeholder={"Search here"}
                        url={'/api/v1/get/tp-number?keyword='}
                        datakey={"name"}
                        customLoading={<>Loading..</>}
                        onSelect={(res) => setTpNumber(res)}
                        onChange={(input) => { }}
                        onBlur={(e) => { }}
                        onFocus={(e) => { }}
                        customStyles={{}}
                      />
                    </div>
                    <div className="col-auto">
                      <button type="button" class="btn btn-sm btn-primary mb-3" onClick={getDataByTpNumber}>Get</button>
                    </div>

                  </div>
                </div>
              </div>






              {/* <div className="item1">
                <div className="">
                  <label for="tpNumber" className="form-label">TP Number</label>
                  <div className="row">
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="tpNumber"
                        {...register("tpNumber", { required: true })}
                      />
                     
                    </div>
                    <div className="col-sm-4">
                      <button type="button" class="btn btn-sm btn-primary mb-3" onClick={getDataByTpNumber}>Get</button>
                    </div>

                  </div>
                </div>
              </div> */}
              <div className="item1">
                <div className="">
                  <label for="truckNumber" className="form-label">Truck Number</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="truckNumber"
                        name="truckNumber"
                        {...register("truckNumber")}
                      />
                    </div>
                    <div className="col-auto">
                      <button type="button" class="btn btn-sm btn-primary mb-3">Search</button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            {
              isSearching && <div className="mx-auto text-center">
                <div class="spinner-grow spinner-grow-sm m-1" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow spinner-grow-sm m-1" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow spinner-grow-sm m-1" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            }
            {challanStatus && statusColor.map((data, idx) => (

              <div hidden={challanStatus !== data.status ? true : false} className="text-center" key={idx}><span>Challan Status : </span><span className={data.color}>{data.status}</span></div>

            ))}

            <div>
              <h6 className="h6 ml-2">Loading Information</h6>
            </div>
            <div className="grid-container-first card">
              <div className="item">
                <div className="">
                  <label for="stackNo" className="form-label">Stack No</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="stackNo"
                      name="stackNo"
                      {...register("stackNo")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label htmlFor="loadDate" className="form-label">Load Date</label>
                  <div className="">
                    {/* <input
                    type="date"
                    className="form-control form-control-sm"
                    id="loadDate"
                    name="loadDate"

                  /> */}
                    <DatePicker
                      className="date-picker-input pl-2"
                      selected={loadingDate}
                      onChange={handleLoadingDate}
                      dateFormat="d-MMM-yyyy"
                      name="loadDate"
                      id="loadDate"
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="enteredBy" className="form-label">Entered By</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="enteredBy"
                      name="enteredBy"
                      {...register("enteredBy")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="loadingSlip" className="form-label">Loading Slip</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="loadingSlip"
                      name="loadingSlip"
                      {...register("loadingSlip")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="challanNo" className="form-label">Challan No</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="challanNo"
                      name="challanNo"
                      {...register("challanNo")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="tpNo" className="form-label">TP Number</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="tpNo"
                      name="tpNo"
                      {...register("tpNo")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="mineralSource" className="form-label">Mineral Source</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="mineralSource"
                      name="mineralSource"
                      {...register("mineralSource")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="exporterName" className="form-label">Exporter Name</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="exporterName"
                      name="exporterName"
                      {...register("exporterName")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="loadingPoint" className="form-label">Loading Point</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="loadingPoint"
                      name="loadingPoint"
                      {...register("loadingPoint")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="unLoadingPoint" className="form-label">Un-Loading Point</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="unLoadingPoint"
                      name="unLoadingPoint"
                      {...register("unLoadingPoint")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="material" className="form-label">Material</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="material"
                      name="material"
                      {...register("material")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="transRate" className="form-label">Trans. Rate</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="transRate"
                      name="transRate"
                      {...register("transRate")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="hsdIssued" className="form-label">HSD Issued {"(Ltr.)"}</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="hsdIssued"
                      name="hsdIssued"
                      {...register("hsdIssued")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="slipNo" className="form-label">Slip No</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="slipNo"
                      name="slipNo"
                      {...register("slipNo")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="petrolPump" className="form-label">Petrol Pump</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="petrolPump"
                      name="petrolPump"
                      {...register("petrolPump")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="hsdRate" className="form-label">HSD Rate</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="hsdRate"
                      name="hsdRate"
                      {...register("hsdRate")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="advance" className="form-label">Advance</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="advance"
                      name="advance"
                      {...register("advance")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="officeExpenses" className="form-label">Office Expenses</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="officeExpenses"
                      name="officeExpenses"
                      {...register("officeExpenses")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="driverWelfare" className="form-label">Driver Welfare</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="driverWelfare"
                      name="driverWelfare"
                      {...register("driverWelfare")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="challanAmount" className="form-label">Challan Amount</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="challanAmount"
                      name="challanAmount"
                      {...register("challanAmount")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="hsdAmount" className="form-label">HSD Amount</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="hsdAmount"
                      name="hsdAmount"
                      {...register("hsdAmount")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="truckOwner" className="form-label">Truck Owner</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="truckOwner"
                      name="truckOwner"
                      {...register("truckOwner")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="contactNo" className="form-label">Contact No.</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="contactNo"
                      name="contactNo"
                      {...register("contactNo")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="loadTruck" className="form-label">Load Truck</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="loadTruck"
                      name="loadTruck"
                      {...register("loadTruck")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="loadWeight" className="form-label">Load Weight A {"(MT)"}</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="loadWeight"
                      name="loadWeight"
                      {...register("loadWeight")}
                    />
                  </div>
                </div>

              </div>
            </div>
            <div>
              <h6 className="h6 ml-2 mt-5">Unload Information</h6>
            </div>
            <div className="grid-section-second card">
              <div className="item">
                <div className="">
                  <label for="unloadDate" className="form-label">Unload Date</label>
                  <div className="date-picker-container">
                    {/* <input
                    type="date"
                    className="form-control form-control-sm"
                    id="unloadDate"
                    format="dd MMM YYYY"
                    name="unloadDate"

                  /> */}

                    <DatePicker
                      className="date-picker-input pl-2"
                      selected={unLoadingDate}
                      onChange={handleDateChange}
                      dateFormat="d-MMM-yyyy"
                      placeholderText="Select a date"
                      name="unloadDate"
                      id="unloadDate"
                      required={true}
                    />

                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="deliveryDays" className="form-label">Delivery Days</label>
                  <div className="">
                    <input
                      type="number"
                      className="form-control form-control-sm w-75 custom-border"
                      id="deliveryDays"
                      name="deliveryDays"
                      {...register("deliveryDays")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="unloadTruck" className="form-label">Unload Truck</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm w-75 custom-border"
                      id="unloadTruck"
                      name="unloadTruck"
                      {...register("unloadTruck", { required: true })}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="wheelNo" className="form-label">Nos. of Wheel</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm w-75 custom-border"
                      id="wheelNo"
                      name="wheelNo"
                      {...register("wheelNo")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="unloadGross" className="form-label">Unload Gross {"(MT)"}</label>
                  <div className="">
                    <input
                      type="number"
                      className="form-control form-control-sm w-75 custom-border"
                      id="unloadGross"
                      name="unloadGross"
                      {...register("unloadGross")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="unloadTare" className="form-label">Unload Tare {"(MT)"}</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm w-75 custom-border"
                      id="unloadTare"
                      name="unloadTare"
                      {...register("unloadTare")}
                    />
                  </div>
                </div>

              </div>
              <div className="item">
                <div className="">
                  <label for="netUnloaded" className="form-label">Net Unloaded {"(MT)"}</label>
                  <div className="">
                    <input
                      type="text"
                      className="form-control form-control-sm w-75 custom-border"
                      id="netUnloaded"
                      name="netUnloaded"
                      {...register("netUnloaded", { required: true })}
                    />
                  </div>
                </div>

              </div>
            </div>

            <div className="button-container">
              <div className="button-item">

              </div>
              <div className="button-item text-center">
                <button type="submit" form="challanForm" class="btn btn-primary m-1" disabled={startSpneer}>
                  {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                  </div>}
                  Save
                </button>
                <button type="button" class="btn btn-primary m-1">Delete</button>
                <button type="button" class="btn btn-primary m-1">New</button>

              </div>
              <div className="button-item text-center">
                <button type="button" class="btn btn-sm btn-outline-primary m-1">Stop Payment</button>
              </div>
            </div>


          </div>
        </form>
        <Toaster
          position="bottom-center"
          reverseOrder={true}
        />
      </div>
    </>
  );
}

export default ChallanUnLoadingEntry;
