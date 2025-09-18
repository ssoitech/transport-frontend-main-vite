import React, { useEffect, useState, useRef } from "react";
import './css/challanLoading.css';
import { useForm } from "react-hook-form";
import { toast, Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import AutoComplete from "../searchComponent/AutoComplete";
import axiosInstance from "../../config/AxiosConfig";
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


let count = 0;
const defaultOptions = [
  { name: '', label: '' },
];
function ChallanLoadingEntry() {
  const accessDetails = useSelector((state) => state.access.accessDetails);
  const navigate = useNavigate();

  const [allFieldStaffNames, setAllFieldStaffNames] = useState();
  const [allBrokersName, setAllBrokersName] = useState();
  const [allFillingStationsName, setAllFillingStationsName] = useState();
  const [consignerNameId, setConsignerNameId] = useState(null);
  const [exporterNameId, setExporterNameId] = useState(null);
  const [loadingPointId, setLoadingPointId] = useState(null);
  const [unloadingPointId, setUnloadingPointId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [permitNoIsEmpty, setPermitNoIsEmpty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [challanNoIsEmpty, setChallanNoIsEmpty] = useState(false);
  const [challanFindButtonDesabled, setChallanFindButtonDesabled] = useState(false);

  const [tpNoIsEmpty, setTpNoIsEmpty] = useState(false);
  const [tpNoFindButtonDesabled, setTpNoFindButtonDesabled] = useState(false);

  const [data, setData] = useState(null);
  const [permit, setPermit] = useState();
  const [stackData, setStackData] = useState(null);
  const [startSpneer, setStartSpneer] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);


  const [dataFromChallanNumber, setDataFromChallanNumber] = useState();
  const [shortageCalculationData, setShortageCalculationData] = useState({});
  const [truckData, setTruckData] = useState([]);
  const [vehicleRateData, setVehicleRateData] = useState({});

  const [validFromDate, setValidFomDate] = useState();
  const handleValidFromDate = (date) => {
    setValidFomDate(format(date, 'yyyy-MM-dd'));
  }

  const [validToDate, setValidToDate] = useState();
  const handleValidToDate = (date) => {
    setValidToDate(format(date, 'yyyy-MM-dd'));
  }

  const [selectedLoadDate, setSelectedLoadDate] = useState(null);
  const handleLoadDateChange = (date) => {
    setSelectedLoadDate(format(date, 'yyyy-MM-dd'));
    // format(date, 'dd-MMM-yyyy')
  };

  const [fieldStaffId, setFieldStaffId] = useState();
  const [brokerId, setBrokerId] = useState();
  const [petrolPumpId, setPetrolPumpId] = useState(152);

  const [vehicleOwner, setVehicleOwner] = useState(""); // State for input value
  const [vehicleOwnerId, setVehicleOwnerId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const topRef = useRef(null);

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

  const findPermit = (data) => {
    console.log(data);
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


  useEffect(() => {

    if (data) {
      setValidFomDate(data.validFrom ? format(data.validFrom, 'd-MMM-yyyy') : "")
      setValidToDate(data.validTo ? format(data.validTo, 'd-MMM-yyyy') : "")
      setValue("permitNumber", data.permitNo);
      setValue("consignerName", data.consignerName);
      setValue("exporterName", data.exporterName);
      setValue("loadingPoint", data.loadingPointName);
      setValue("unloadingPoint", data.unloadingPointName);
      setValue("material", data.materialName);
      setValue("vehicleRate", Number(data.vehicleRate));
      setIsSearching(false);
    }
  }, [data])

  async function getAllFieldStaffNames() {
    await axiosInstance.get('/api/v1/get/all/field-staff-master')
      .then(function (response) {
        // handle success
        setAllFieldStaffNames(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  async function getAllBrokersName() {
    await axiosInstance.get('/api/v1/get/all/fleet-agent-broker-master')
      .then(function (response) {
        // handle success
        setAllBrokersName(response.data);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  async function getAllFillingStationsName() {
    await axiosInstance.get('/api/v1/get/filling-stations')
      .then(function (response) {
        // handle success
        const arrayOfObjects = response.data.map(element => {
          return {
            nameId: element[0],
            name: element[1]
          };
        });
        setAllFillingStationsName(arrayOfObjects);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  useEffect(() => {
    getAllFieldStaffNames();
    getAllBrokersName();
    getAllFillingStationsName();
  }, []);

  async function getData(permitNum) {
    await axiosInstance.get(`/api/v1/get/iform/get-specific-details/${permitNum}`)
      .then(function (response) {
        setIsSearching(false);
        // handle success
        console.log(JSON.parse(response.data.jsonResult));

        setData(JSON.parse(response.data.jsonResult));
        setStackData(response.data.stackTableList);
        if (!response.data) {
          toast.error("Permit Does not Exists.");
          setIsSearching(false);
        }

      })
      .catch(function (error) {
        // handle error
        setIsSearching(false);
        toast('Permit Number Does Not Exist.',
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

  async function handleProceed() {
    try {
      setIsSearching(true);
      const permitNumber = permit ? permit.name : null;
      console.log(permitNumber);
      if (!permitNumber) {

        toast('Please Enter Permit Number!',
          {
            style: {
              borderRadius: '10px',
              background: '#ec942c',
              color: '#fff',
            },
          }
        );

        reset();
        setPermitNoIsEmpty(true);
        setIsSearching(false);
        return;
      }
      await getData(permitNumber);
    } catch (e) {
      setIsSearching(false);
    }

  }

  // Saving the data
  async function postData(fdata) {
    await axiosInstance.post('/api/v1/add/one/challan',
      fdata
    )

      .then(function (response) {
        // handle success
        console.log(response.data);
        if (response.data === "updated" && response.status === 201) {
          toast.success("Successfully Updated.", {
            position: "bottom-center",
            style: {
              background: "green",
              color: "#fff",
            }
          });
          setStartSpneer(false);
          setIsSaving(false);
        } else if (response.data === "saved" && response.status === 201) {
          toast.success("Successfully Updated.", {
            position: "bottom-center",
            style: {
              background: "green",
              color: "#fff",
            }
          });

          reset();
          setStartSpneer(false);
          setIsSaving(false);
        }
        // setSubmitSuccess(true);

        // setIsSaved(true);
        // setUpdateData(true);

        else {
          toast.error("Some Error Occured!");
          // setPostError(true);
          setStartSpneer(false);
          setIsSaving(false);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);

        toast.error("Some Error Occured!");
        setStartSpneer(false);
        setIsSaving(false);

      });
  }


  const onSubmit = async (formData) => {
    // console.log(formData);
    setStartSpneer(true);
    setIsSaving(true);
    const challanData = {
      "permitNumber": formData.permitNumber,
      "challanNumber": formData.challanNumber,
      "tpNumber": formData.tpNumber,
      "invNumber": formData.invNumber,
      "status": "transit",
      "permitNumberId": data ? data.permitNoId : "",
      "consignerNameId": data ? data.consignerNameId : "",
      "exporterNameId": data ? data.exporterNameId : "",
      "loadingPointId": data ? data.loadingPointId : "",
      "unLoadingPointId": data ? data.unLoadingPointId : "",
      "materialId": data ? data.materialId : "",
      "vehicleRate": formData.vehicleRate,
      "paymentRate": formData.paymentRate,
      "officeExpenses": formData.officeExpenses,
      "loadDate": selectedLoadDate,
      "truckNumber": formData.truckNumber,
      "truckType": formData.truckType,
      "loadingGross": formData.loadingGross,
      "loadingTare": formData.loadingTare,
      "loadWeight": formData.loadingWeight,
      "petrolPump": formData.petrolPump,
      "petrolRate": formData.petrolRate ? formData.petrolRate : 0.00,
      "rate": formData.rate ? formData.rate : 0.00,
      "issueSlip": formData.issueSlip,
      "hsdIssued": formData.hsdIssued ? formData.hsdIssued : 0.00,
      "hsdAdvance": formData.hsdAdvance ? formData.hsdAdvance : 0.00,
      "cashAdvance": formData.cashAdvance ? formData.cashAdvance : 0.00,
      "fieldStaff": formData.fieldStaff,
      "driverWelfare": formData.driverWelfare,
      "challanAmount": formData.challanAmount,
      "totalAdvance": formData.totalAdvance,
      "otherDeduction": formData.otherDeduction,
      "deductionTowards": formData.deductionTowards,
      "truckDriver": formData.truckDriver,
      "dlNumber": formData.dlNumber,
      "driverMobileNo": formData.driverMobileNo,
      "vehicleOwner": vehicleOwner,
      "vehicleOwnerId": vehicleOwnerId,
      "truckOwnerLoadId": vehicleOwnerId,
      "mobAddress": formData.address,
      "agentOrBroker": formData.agent,
      "unloadDate": formData.unloadDate,
      "deliveryDays": formData.deliveryDays,
      "unloadTruck": formData.unloadTruck,
      "truckWheelNo": formData.truckWheelNo,
      "unloadingGross": formData.unloadingGross,
      "unloadingTare": formData.unloadingTare,
      "netUnloaded": formData.netUnloaded,
      "createdBy": accessDetails.userId ? accessDetails.userId : null,
      "updatedBy": accessDetails.userId ? accessDetails.userId : null
    }

    await postData(challanData);

  }


  useEffect(() => {
    if (dataFromChallanNumber) {
      console.log(dataFromChallanNumber.permitNumber);
      setValue("permitNumber", dataFromChallanNumber.permitNumber);
      setValidFomDate(dataFromChallanNumber.validFrom);
      setValidToDate(dataFromChallanNumber.validTo);
      setValue("consignerName", dataFromChallanNumber.consignerName);
      setValue("exporterName", dataFromChallanNumber.exporterName);
      setValue("loadingPoint", dataFromChallanNumber.loadingPoint);
      setValue("unloadingPoint", dataFromChallanNumber.unLoadingPoint);
      setValue("material", dataFromChallanNumber.material);

      setValue("truckNumber", dataFromChallanNumber.truckNumber);
      setValue("truckType", dataFromChallanNumber.truckType)

      setValue("challanNumber", dataFromChallanNumber.challanNumber)
      setValue("tpNumber", dataFromChallanNumber.tpNumber);
      setValue("invNumber", dataFromChallanNumber.invNumber);
      setValue("loadingGross", dataFromChallanNumber.loadingGross);
      setValue("loadingTare", dataFromChallanNumber.loadingTare);
      setValue("loadingWeight", dataFromChallanNumber.loadWeight);
      setValue("hsdAdvance", dataFromChallanNumber.hsdAdvance);
      setValue("cashAdvance", dataFromChallanNumber.cashAdvance);
      setValue("driverWelfare", dataFromChallanNumber.driverWelfare);
      setValue("challanAmount", dataFromChallanNumber.challanAmount);
      setValue("totalAdvance", dataFromChallanNumber.totalAdvance);
      setValue("otherDeduction", dataFromChallanNumber.otherDeduction);
      setValue("deductionTowards", dataFromChallanNumber.deductionTowards);
      setValue("truckDriver", dataFromChallanNumber.truckDriver);
      setValue("dlNumber", dataFromChallanNumber.dlNumber);
      setValue("driverMobileNo", dataFromChallanNumber.driverMobileNo);

      setValue("address", dataFromChallanNumber.mobAddress);
      setSelectedLoadDate(dataFromChallanNumber.loadDate);
      setValue("fieldStaff", dataFromChallanNumber.fieldStaffId);
      setValue("agent", dataFromChallanNumber.brokerId);
      setFieldStaffId(dataFromChallanNumber.fieldStaffId);
      setBrokerId(dataFromChallanNumber.brokerId);
      setPetrolPumpId(dataFromChallanNumber.petrolpumpId);


      if (dataFromChallanNumber.vehicleOwner) {

        setVehicleOwner(dataFromChallanNumber.vehicleOwner ? dataFromChallanNumber.vehicleOwner : null);
        setVehicleOwnerId(truckData[0].ownerId ? truckData[0].ownerId : null);

      } else if (truckData[0].truckOwner) {
        setVehicleOwner(truckData[0].truckOwner ? truckData[0].truckOwner : null);
        setVehicleOwnerId(truckData[0].ownerId ? truckData[0].ownerId : null);
      }

      if (dataFromChallanNumber.challanMasterVehicleRate) {
        setValue("vehicleRate", dataFromChallanNumber.challanMasterVehicleRate);
      } else if (dataFromChallanNumber.challanMasterUnionVehicleRate) {
        setValue("vehicleRate", dataFromChallanNumber.challanMasterVehicleRate);
      } else if (vehicleRateData) {
        if (vehicleRateData.length === 1) {
          setValue("vehicleRate", vehicleRateData[0].vehicleRate);
          setValue("paymentRate", vehicleRateData[0].vehicleRate);
        }
      }


      if (dataFromChallanNumber.challanMasterOfficeExpense) {

        setValue("officeExpenses", dataFromChallanNumber.challanMasterOfficeExpense);

      } else if (shortageCalculationData.oerAmount) {
        try {
          let offliceExp = dataFromChallanNumber.loadWeight ? parseFloat((shortageCalculationData.oerAmount) * (dataFromChallanNumber.loadWeight)).toFixed(2) : 0;
          setValue("officeExpenses", offliceExp);
        } catch (e) {
          setValue("officeExpenses", 0);
        }

      } else if (truckData) {

        if (truckData[0].truckWheelType) {
          const truckWheelNumber = truckData[0].truckWheelType;
          switch (truckWheelNumber) {
            case "6":
              setValue("officeExpenses", shortageCalculationData ? shortageCalculationData.oer6wheel : 0);
              break;
            case "8":
              setValue("officeExpenses", shortageCalculationData ? shortageCalculationData.oer8wheel : 0);
              break;
            case "10":
              setValue("officeExpenses", shortageCalculationData ? shortageCalculationData.oer10wheel : 0);
              break;
            case "12":
              setValue("officeExpenses", shortageCalculationData ? shortageCalculationData.oer12wheel : 0);
              break;
            case "14":
              setValue("officeExpenses", shortageCalculationData ? shortageCalculationData.oer14wheel : 0);
              break;
            case "16":
              setValue("officeExpenses", shortageCalculationData ? shortageCalculationData.oer16wheel : 0);
              break;
            case "18":
              setValue("officeExpenses", shortageCalculationData ? shortageCalculationData.oer18wheel : 0);
              break;
            case "22":
              setValue("officeExpenses", shortageCalculationData ? shortageCalculationData.oer22wheel : 0);
              break;
            default:
              console.log("defaulttttt");
          }
        }
      }
    }
  }, [dataFromChallanNumber])

  const arrayToObject = (data) => {
    try {

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
          challanMasterVehicleRate: innerArray[38],
          challanMasterUnionVehicleRate: innerArray[39],
          challanMasterOfficeExpense: innerArray[40],
          challanMasterPaymentRate: innerArray[41]
        };
      });

      return arrayOfObjects[0];

    } catch (e) {

    }

  }

  useEffect(() => {
    let timer;
    if (challanNoIsEmpty) {
      timer = setTimeout(() => {
        setChallanNoIsEmpty(false);
      }, 4000);
    }

    if (permitNoIsEmpty) {
      timer = setTimeout(() => {
        setPermitNoIsEmpty(false);
      }, 4000);
    }

    if (tpNoIsEmpty) {
      timer = setTimeout(() => {
        setTpNoIsEmpty(false);
      }, 4000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [challanNoIsEmpty, permitNoIsEmpty])


  async function getDataByChallanNo(challanNum, permitNum) {
    await axiosInstance.get(`/api/v1/get/one/challan-details/${challanNum}/${permitNum}`)
      .then(function (response) {
        // handle success

        console.log(response.data);

        if (!response.data) {
          reset();
          toast.error("Challan does not exist.");
        } else {
          if (response.data.challanData) {
            setDataFromChallanNumber(arrayToObject(response.data.challanData));
            setShortageCalculationData(response.data.shortageData);
            setVehicleRateData(response.data.vehicleRate);
            setTruckData(response.data.truckOwnerData);
          } else {
            reset();
            toast.error("Challan does not exist.");
          }

        }

        setChallanFindButtonDesabled(false);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setChallanFindButtonDesabled(false);
      });
  }


  async function getDataByTpNumber(tpNum) {
    await axiosInstance.get(`/api/v1/get/one/challan-details/bytpnumber/${tpNum}`)
      .then(function (response) {
        // handle success
        console.log(response.data);

        if (!response.data) {
          reset();
          toast.error("Challan does not exist.");
        } else {
          if (response.data.challanData) {
            setDataFromChallanNumber(arrayToObject(response.data.challanData));
            setShortageCalculationData(response.data.shortageData);
            setVehicleRateData(response.data.vehicleRate);
            setTruckData(response.data.truckOwnerData);
          } else {
            reset();
            toast.error("Challan does not exist.");
          }

        }

        setTpNoFindButtonDesabled(false);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setTpNoFindButtonDesabled(false);
      });
  }

  async function findChallan() {
    setChallanFindButtonDesabled(true);
    const challanNo = getValues("challanNumber");
    const permitNo = getValues("permitNumber");
    if (!challanNo) {
      setChallanFindButtonDesabled(false);
      setChallanNoIsEmpty(true);
      return
    }
    if (!permitNo) {
      setChallanFindButtonDesabled(false);
      setPermitNoIsEmpty(true);
      topRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const array = [challanNo, permitNo];
    setChallanNoIsEmpty(false);
    await getDataByChallanNo(challanNo, permitNo);
  }


  async function findTp() {
    setTpNoFindButtonDesabled(true);
    const tpNum = getValues("tpNumber");

    if (!tpNum) {
      setTpNoFindButtonDesabled(false);
      setTpNoIsEmpty(true);
      return
    }
    setTpNoIsEmpty(false);
    const permitNo = getValues("permitNumber");
    let permitFromTp = tpNum.split("/")[0];
    if (!(permitNo === permitFromTp)) {
      setTpNoFindButtonDesabled(false);
      setPermitNoIsEmpty(true);
      topRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    try {
      const formattedTpNum = tpNum.replace(/\//g, "_");
      await getDataByTpNumber(formattedTpNum);
    } catch (error) {
      setTpNoFindButtonDesabled(false);
      toast.error("Something went wrong!!");
    }

  }



  // Fetch suggestions from the database
  const fetchSuggestions = async (query) => {
    try {
      await axiosInstance.get(`/api/v1/challan-holder/get/all/names-ids?keyword=${query}`)
        .then(function (response) {
          console.log(response.data);
          setSuggestions(response.data);
        }).catch(function (error) {
          // handle error
          console.log(error);

        });

    } catch (error) {

    }
  };

  // Handle input change
  const handleInputChange = (event) => {
    const input = event.target.value;
    setVehicleOwner(input); // Update input value

    if (input) {
      fetchSuggestions(input); // Fetch suggestions when typing
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  const handleSuggestionClick = (id, name) => {
    setVehicleOwner(name); // Set selected suggestion as input value
    setVehicleOwnerId(id);
    setSuggestions([]); // Clear suggestions
  };


  return (
    <div className='work-space-container'>
      <div className="alert alert-primary text-center font-weight-bold text-dark p-2" role="alert">
        <span className='mb-0 h6'>Challan Loading Entry - Manually</span>
      </div>
      <div>
        <form id="challanForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid-section1">
            <div className="item1">
              <div className="">
                <label for="permitNumber" className="form-label">Permit Number</label>
                <div ref={topRef} className="row">
                  <div className="col-auto">


                    <AutoComplete
                      placeholder={"Search here"}
                      url={'/api/v1/get/permit-number?keyword='}
                      datakey={"name"}
                      customLoading={<>Loading..</>}
                      onSelect={(res) => setPermit(res)}
                      onChange={(input) => { }}
                      onBlur={(e) => { }}
                      onFocus={(e) => { }}
                      customStyles={{}}
                    />


                  </div>
                  <div className="col-auto">
                    <button type="button" class="btn btn-sm btn-primary mb-3" disabled={isSearching} onClick={handleProceed}>Proceed</button>
                  </div>

                </div>
              </div>
            </div>
            <div className="item1">
              <div className="">
                <label for="stackNo" className="form-label">Stack No</label>
                <div className="">

                  {stackData ?
                    <select
                      className="form-select form-select-sm"
                      aria-label="Default select example"
                      name='stackNo'
                      id='stackNo'
                      {...register("stackNo")}
                    >
                      {
                        stackData.map((item, idx) => {
                          console.log(item);
                          return <option key={idx} selected={idx === 0 ? true : false} value={item.stackNumber}>{item.stackNumber}</option>
                        })
                      }

                    </select> :
                    <select className="form-select form-select-sm" aria-label="Default select example">
                      <option value=""></option>
                    </select>
                  }


                </div>
              </div>

            </div>
            <div className="item1">
              <div className="">
                <label for="validFrom" className="form-label">Valid From</label>
                <div className="">
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
            <div className="item1">
              <div className="">
                <label for="validTo" className="form-label">Valid To</label>
                <div className="">
                  <DatePicker
                    className="date-picker-input pl-2"
                    selected={validToDate}
                    onChange={handleValidToDate}
                    name="validTo"
                    dateFormat="d-MMM-yyyy"
                    placeholderText="Select a date"
                    id="validTo"
                  />
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

          <div>
            <h6 className="h6 ml-2">Permit Details</h6>
          </div>
          <div className="grid-container card">
            <div className="item">
              <div className="">
                <label for="consignerName" className="form-label">Mines/Consigner Name</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm w-75 custom-border"
                    id="consignerName"
                    name="consignerName"
                    disabled={watch("consignerName") ? true : false}
                    {...register("consignerName")}
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
                    className="form-control form-control-sm w-75 custom-border"
                    id="exporterName"
                    name="exporterName"
                    disabled={watch("exporterName") ? true : false}
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
                    className="form-control form-control-sm w-75 custom-border"
                    id="loadingPoint"
                    name="loadingPoint"
                    disabled={watch("loadingPoint") ? true : false}
                    {...register("loadingPoint")}
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
                    className="form-control form-control-sm w-75 custom-border"
                    id="unloadingPoint"
                    name="unloadingPoint"
                    disabled={watch("unloadingPoint") ? true : false}
                    {...register("unloadingPoint")}
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
                    className="form-control form-control-sm w-75 custom-border"
                    id="material"
                    name="material"
                    disabled={watch("material") ? true : false}
                    {...register("material")}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="grid-container2">
            <div className="item">
              <div className="">
                <label for="vehicleRate" className="form-label">Vehicle Rate</label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="vehicleRate"
                    name="vehicleRate"
                    {...register("vehicleRate")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="paymentRate" className="form-label">Payment Rate</label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="paymentRate"
                    name="paymentRate"
                    {...register("paymentRate")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="officeExpenses" className="form-label">Office Expenses <span>{"( Deduction on Final Payment)"}</span></label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="officeExpenses"
                    name="officeExpenses"
                    {...register("officeExpenses")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="loadDate" className="form-label">Load Date</label>
                <div className="">

                  <DatePicker
                    className="date-picker-input pl-2"
                    selected={selectedLoadDate}
                    onChange={handleLoadDateChange}
                    dateFormat="d-MMM-yyyy"
                    placeholderText="Select a date"

                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="truckNumber" className="form-label">Truck Number</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="truckNumber"
                    name="truckNumber"
                    {...register("truckNumber")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="truckType" className="form-label">Truck Type<span>{"(Union/Non-Union)"}</span> </label>
                <div className="">
                  <div className="">
                    <select
                      className="form-select form-select-sm w-75 border-dark-subtle"
                      aria-label=".form-select-sm example"
                      id="truckType"
                      name="truckType"
                      {...register("truckType")}
                    >
                      <option value=""></option>
                      <option value="nonunion">Non-Union</option>
                      <option value="union">Union</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="challanNumber" className="form-label">Challan Number</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      disabled={challanFindButtonDesabled}
                      className="form-control form-control-sm custom-border w-75"
                      id="challanNumber"
                      name="challanNumber"
                      {...register("challanNumber")}
                    />
                    {challanNoIsEmpty && (
                      <p role="alert" className="text-danger">Challan Number is required</p>
                    )}
                  </div>
                  <div className="col-auto">

                    <button type="button" className="btn btn-sm btn-primary mb-3 w-100" disabled={challanFindButtonDesabled} onClick={() => { findChallan() }}>
                      {challanFindButtonDesabled ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

                        </>
                      ) : (
                        'Find'
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="tpNumber" className="form-label">TP Number</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border w-75"
                      id="tpNumber"
                      name="tpNumber"
                      {...register("tpNumber")}
                    />
                    {tpNoIsEmpty && (
                      <p role="alert" className="text-danger">TP Number is required!</p>
                    )}
                  </div>
                  <div className="col-auto">
                    {/* <button type="button" class="btn btn-sm btn-primary mb-3" disabled={tpNoFindButtonDesabled} onClick={() => { findTp() }}>Find</button> */}

                    <button type="button" className="btn btn-sm btn-primary mb-3" disabled={tpNoFindButtonDesabled} onClick={() => { findTp() }}>
                      {tpNoFindButtonDesabled ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>

                        </>
                      ) : (
                        'Find'
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="invNumber" className="form-label">WS/Inv. Number</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm custom-border w-75"
                      id="invNumber"
                      name="invNumber"
                      {...register("invNumber")}
                    />
                  </div>
                  <div className="col-auto">
                    <button type="submit" class="btn btn-sm btn-primary mb-3">Find</button>
                  </div>

                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="loadingGross" className="form-label">Loading Gross<span>{"(MT)"}</span></label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="loadingGross"
                    name="loadingGross"
                    {...register("loadingGross")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="loadingTare" className="form-label">Loading Tare <span>{"(MT)"}</span></label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="loadingTare"
                    name="loadingTare"
                    {...register("loadingTare")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="loadingWeight" className="form-label">Load Weight A <span>{"(MT)"}</span></label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="loadingWeight"
                    name="loadingWeight"
                    {...register("loadingWeight")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="petrolPump" className="form-label">Petrol Pump</label>
                <div className="row">
                  <div className="col-auto">

                    {allFillingStationsName ?
                      <select
                        className="form-select form-select-sm border-dark-subtle"
                        aria-label="Default select example"
                        name='petrolPump'
                        id='petrolPump'
                        {...register("petrolPump")}
                      >
                        <option value=""></option>
                        {
                          allFillingStationsName.map((item, idx) => {
                            return <option selected={item.nameId === petrolPumpId ? true : false} key={idx} value={item.nameId}>{item.name}</option>
                          })
                        }

                      </select> :
                      <select className="form-select form-select-sm" aria-label="Default select example">
                        <option value=""></option>
                      </select>
                    }
                  </div>
                  <div className="col-sm-6">
                    <input
                      type="number"
                      className="form-control form-control-sm w-50 custom-border"
                      id="petrolRate"
                      name="petrolRate"
                      placeholder="0.00"
                      {...register("petrolRate")}
                    />
                  </div>

                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="rate" className="form-label">Rate</label>
                <div className="">
                  <input
                    type="number"
                    disabled={Number(watch("petrolPump")) === 152 ? true : false}
                    className="form-control form-control-sm custom-border w-75"
                    id="rate"
                    name="rate"
                    {...register("rate")}
                  />

                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="issueSlip" className="form-label">Issue Slip</label>
                <div className="">
                  <input
                    type="text"
                    disabled={!Number(watch('petrolPump')) ? true : false}
                    className="form-control form-control-sm custom-border w-75"
                    id="issueSlip"
                    name="issueSlip"
                    {...register("issueSlip")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="hsdIssued" className="form-label">HSD Issued<span>{"(Ltr)"}</span></label>
                <div className="">
                  <input
                    type="number"
                    disabled={!Number(watch('petrolPump')) ? true : false}
                    className="form-control form-control-sm custom-border w-75"
                    id="hsdIssued"
                    name="hsdIssued"
                    {...register("hsdIssued")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="hsdAdvance" className="form-label">HSD Advance</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="hsdAdvance"
                    name="hsdAdvance"
                    {...register("hsdAdvance")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="cashAdvance" className="form-label">Cash Advance <span>{"(Paid)"}</span></label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="cashAdvance"
                    name="cashAdvance"
                    {...register("cashAdvance")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="fieldStaff" className="form-label">Field Staff</label>
                <div className="">
                  <div className="">

                    {allFieldStaffNames ?
                      <select
                        className="form-select form-select-sm w-75"
                        aria-label="Default select example"
                        name='fieldStaff'
                        id='fieldStaff'
                        {...register("fieldStaff")}
                      >
                        <option value=""></option>
                        {
                          allFieldStaffNames.map((item, idx) => {
                            return <option selected={item.id === fieldStaffId ? true : false} key={idx} value={item.id}>{item.name}</option>
                          })
                        }

                      </select> :
                      <select className="form-select form-select-sm" aria-label="Default select example">
                        <option value=""></option>
                      </select>
                    }

                  </div>
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="driverWelfare" className="form-label">Driver Welfare <span>{"(Paid)"}</span></label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="driverWelfare"
                    name="driverWelfare"
                    {...register("driverWelfare")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="challanAmount" className="form-label">Challan Amount <span>{"(Collected)"}</span></label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="challanAmount"
                    name="challanAmount"
                    {...register("challanAmount")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="totalAdvance" className="form-label">Total Advance</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="totalAdvance"
                    name="totalAdvance"
                    {...register("totalAdvance")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="otherDeduction" className="form-label">Other Deduction</label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="otherDeduction"
                    name="otherDeduction"
                    {...register("otherDeduction")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="deductionTowards" className="form-label">Deduction Towards</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="deductionTowards"
                    name="deductionTowards"
                    {...register("deductionTowards")}
                  />
                </div>
              </div>
            </div>


            <div className="item">
              <div className="">
                <label for="truckDriver" className="form-label">Truck Driver</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="truckDriver"
                    name="truckDriver"
                    {...register("truckDriver")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="dlNumber" className="form-label">DL Number</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="dlNumber"
                    name="dlNumber"
                    {...register("dlNumber")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="driverMobileNo" className="form-label">Driver Mobile Number</label>
                <div className="">
                  <input
                    type="number"
                    className="form-control form-control-sm custom-border w-75"
                    id="driverMobileNo"
                    name="driverMobileNo"
                    {...register("driverMobileNo")}
                  />
                </div>
              </div>
            </div>
            {/* <div className="item">
              <div className="">
                <label for="vehicleOwner" className="form-label">Vehicle Owner</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="vehicleOwner"
                    name="vehicleOwner"
                    {...register("vehicleOwner")}
                  />
                </div>
              </div>
            </div> */}


            <div className="item" style={{ position: "relative" }}> {/* Relative container */}
              <label htmlFor="vehicleOwner" className="form-label">Vehicle Owner</label>
              <input
                type="text"
                className="form-control form-control-sm custom-border w-75"
                id="vehicleOwner"
                name="vehicleOwner"
                {...register("vehicleOwner")}
                value={vehicleOwner}
                onChange={handleInputChange}
              />
              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <ul className="suggestions-list w-75">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion.id, suggestion.name)}>
                      {suggestion.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>



            <div className="item">
              <div className="">
                <label for="address" className="form-label">Mob/Address</label>
                <div className="">
                  <input
                    type="text"
                    className="form-control form-control-sm custom-border w-75"
                    id="address"
                    name="address"
                    {...register("address")}
                  />
                </div>
              </div>
            </div>
            <div className="item">
              <div className="">
                <label for="agent" className="form-label">Agent / Broker</label>
                <div className="">
                  <div className="">
                    {allBrokersName ?
                      <select
                        className="form-select form-select-sm w-75 border-dark-subtle"
                        aria-label="Default select example"
                        name='agent'
                        id='agent'
                        {...register("agent")}
                      >
                        <option value=""></option>
                        {
                          allBrokersName.map((item, idx) => {
                            return <option selected={item.id === brokerId ? true : false} key={idx} value={item.id}>{item.name}</option>
                          })
                        }

                      </select> :
                      <select className="form-select form-select-sm" aria-label="Default select example">
                        <option value=""></option>
                      </select>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="button-container">
            <div className="button-item">
              <div class="row">
                <label htmlFor="entryBy" className="col-sm-4 col-form-label">Entry By :</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    readonly
                    className="form-control-plaintext"
                    id="entryBy"
                    name="entryBy"
                    {...register("entryBy")}
                  />
                </div>
              </div>
              <div className="mb-1 row">
                <label htmlFor="entryDate" className="col-sm-4 col-form-label">Entry Date :</label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    readonly
                    className="form-control-plaintext"
                    id="entryDate"
                    name="entryDate"
                    value=""
                  />
                </div>
              </div>

            </div>
            <div className="button-item text-center">
              <button type="submit" form="challanForm" className="btn btn-primary m-2" disabled={isSaving}>
                {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                </div>}
                <span>Save</span>
              </button>
              <button type="button" className="btn btn-primary m-2">Delete</button>
              <button type="button" className="btn btn-primary m-2" onClick={() => window.location.reload(false)}>New</button>

            </div>
            <div className="button-item text-center">
              <button type="button" className="btn btn-sm btn-outline-primary m-1" disabled={isSearching}>Stop Payment</button>
            </div>
          </div>
        </form>
      </div>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
      />
    </div>
  );
}

export default ChallanLoadingEntry;
