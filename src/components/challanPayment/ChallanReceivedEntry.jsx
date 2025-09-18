import React, { useEffect, useState } from "react";
import "./CSS_Chalanpayment/challanReceivedEntry.css";
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import OpenChallanHolderPageInNewTab from "./challanPaymentComponents/OpenChallanHolderPageInNewTab";
import AutoComplete from "../searchComponent/AutoComplete";
import axiosInstance from "../../config/AxiosConfig";



const defaultOptions = [
  { name: '', label: 'loading..' },
];

function ChallanReceivedEntry() {
  const [challanData, setChallanData] = useState();
  const [allFieldStaffNames, setAllFieldStaffNames] = useState();
  const [allBrokersName, setAllBrokersName] = useState();
  const [allFillingStationsName, setAllFillingStationsName] = useState();
  const [vehicleWeightList, setVehicleWeightList] = useState();
  const [allCollectionCenterNames, setAllCollectionCenterNames] = useState();

  const [truckWheelNo, setTruckWheelNo] = useState();

  const [tpNoIsEmpty, setTpNoIsEmpty] = useState(false);
  const [tpNoFindButtonDesabled, setTpNoFindButtonDesabled] = useState(false);


  const [fieldStaffId, setFieldStaffId] = useState();
  const [brokerId, setBrokerId] = useState();
  const [petrolPumpId, setPetrolPumpId] = useState(152);

  const [exemptedValue, setExepmtedValue] = useState(0);
  const [shortageData, setShortageData] = useState(0);
  const [vehicleRate, setVehicleRate] = useState(0);

  const [challanStatus, setChallanStatus] = useState();

  const [records, setRecords] = useState([]);
  // total values
  // const [totalNos, setTotalNos] = useState(0);
  // const [totalPQty, setTotalPQty] = useState(0);

  const [challanHolderDetails, setChallanHolderDetails] = useState(null);


  const { control: controlFirstSection,
    getValues: getFirstSectionValue,
    setValue: setFirstSectionValue,
    watch: watchFirstSectionValue,
    register: registerFirstSection,
    handleSubmit: handleFirstSection,
    reset: resetFirstSection,
    formState: { errors }
  } = useForm();

  const { control: controlLoadingInformation,
    register: registerLoadingInformation,
    getValues: getLoadingInformationValue,
    watch: watchLoadingInformationValue,
    setValue: setLoadingInformationValue,
    handleSubmit: handleLoadingInformation,
    reset: resetLoadingInformation
  } = useForm();


  const {
    register: registerTotalFormField,
    getValues: getTotalFormFieldValue,
    watch: watchTotalFormFieldValue,
    setValue: setTotalFormFieldValue,
    handleSubmit: handleTotalFormField,
    reset: resetTotalFormField
  } = useForm();

  const {
    control: controlVoucherField,
    register: registerVoucherField,
    getValues: getVoucherFieldValue,
    watch: watchVoucherFieldValue,
    setValue: setVoucherFieldValue,
    handleSubmit: handleVoucherFormField,
    reset: resetVoucherFormField
  } = useForm();



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

  async function getAllVehicleWeightList() {
    await axiosInstance.get('/api/v1/get/all-vehicle-passing-weight')
      .then(function (response) {
        // handle success
        setVehicleWeightList(response.data[0]);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  async function getAllCollectionCenterNames() {

    await axiosInstance.get('/api/v1/get/all/collection-center-names')
      .then(function (response) {
        // handle success
        const arrayOfObjects = response.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });

        setAllCollectionCenterNames(arrayOfObjects);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  async function getBankDetailsById(id) {
    if (!id) return;
    await axiosInstance.get(`/api/v1/challan-holder/get/active-bank-details/${id}`)
      .then(function (response) {
        // handle success

        console.log(response.data);
        if (response.data) {
          setFirstSectionValue("bankDetails", response.data ? `${response.data[0].accountNumber}, ${response.data[0].bankName}, ${response.data[0].ifscCode}, ${response.data[0].branchName}` : "");
        }


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
    getAllVehicleWeightList();
    getAllCollectionCenterNames();
  }, []);

  function kgToTon(kg) {
    return kg / 1000;
  }


  useEffect(() => {

    if (!challanData) {
      return;
    }

    if (challanData.shortageData) {
      setShortageData(challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees : 0);
    }

    if (challanData.jsonResult.challan_status == "paid") {
      Swal.fire({
        icon: "error",
        text: "Challan is already Paid.",
        confirmButtonText: "OK",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          resetFirstSection();
          resetLoadingInformation();
          return;
        }
      });
    }

    if (challanData.jsonResult.challan_status == "received") {
      Swal.fire({
        icon: "error",
        text: "Challan Reeived.",
        confirmButtonText: "OK",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          resetFirstSection();
          resetLoadingInformation();
          return;
        }
      });
    }

    console.log(challanData.jsonResult);

    if (!challanData.jsonResult.challan_number) {
      // toast.error("Challan Number Not assigned to this TP Number");

      Swal.fire({
        icon: "error",
        text: "Challan Not Found!!",
        confirmButtonText: "OK",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          resetFirstSection();
          resetLoadingInformation();
          return;
        }
      });



    } else {
      setFirstSectionValue("challanNumber", challanData.jsonResult.challan_number);
      setLoadingInformationValue("secondChallanNumber", challanData.jsonResult.challan_number);
      setLoadingInformationValue("transitPassNo", challanData.jsonResult.tp_number);
    }

    setLoadingInformationValue("loadDate", challanData.jsonResult.load_date ? challanData.jsonResult.load_date : null);

    if (challanData.jsonResult.truck_owner_name) {
      setLoadingInformationValue("owner", challanData.jsonResult.truck_owner_name);
    }
    if (challanData.jsonResult.pan_number) {
      setLoadingInformationValue("panNumber", challanData.jsonResult.pan_number);
    }

    setLoadingInformationValue("truckNumber", challanData.jsonResult.truck_number ? challanData.jsonResult.truck_number : "");
    setLoadingInformationValue("rcStatus", challanData.jsonResult.rc_status ? "RC - " + challanData.jsonResult.rc_status : "");
    setLoadingInformationValue("loadedAt", challanData.jsonResult.loading_point_name ? challanData.jsonResult.loading_point_name : "");
    setLoadingInformationValue("destination", challanData.jsonResult.un_loading_point_name ? challanData.jsonResult.un_loading_point_name : "");
    setLoadingInformationValue("unloadingDate", challanData.jsonResult.unload_date ? challanData.jsonResult.unload_date : null)
    setLoadingInformationValue("driverWelfare", challanData.jsonResult.driver_welfare ? challanData.jsonResult.driver_welfare : 0);
    setLoadingInformationValue("type", challanData.jsonResult.truck_type ? challanData.jsonResult.truck_type : "");
    setLoadingInformationValue("invNumber", challanData.jsonResult.inv_number ? challanData.jsonResult.inv_number : challanData.jsonResult.inv_number);



    setLoadingInformationValue("ulGross", parseFloat(challanData.jsonResult.unloading_gross ? challanData.jsonResult.unloading_gross : 0.000).toFixed(3));
    setLoadingInformationValue("ulTare", parseFloat(challanData.jsonResult.unloading_tare ? challanData.jsonResult.unloading_tare : 0.000).toFixed(3));
    setLoadingInformationValue("netUl", parseFloat(challanData.jsonResult.net_unloaded ? challanData.jsonResult.net_unloaded : 0.000).toFixed(3));


    if (challanData.jsonResult.truck_type === "union") {
      setVehicleRate(challanData.jsonResult.union_vehicle_rate);
      setLoadingInformationValue("challanRate", challanData.jsonResult.challan_rate ? challanData.jsonResult.challan_rate : challanData.jsonResult.union_vehicle_rate);
      setLoadingInformationValue("vehicleRate", challanData.jsonResult.union_vehicle_rate ? challanData.jsonResult.union_vehicle_rate : 0);

      setLoadingInformationValue("freight", challanData.jsonResult.freight ? challanData.jsonResult.freight : (challanData.jsonResult.load_weight * challanData.jsonResult.union_vehicle_rate));
    } else {
      if (challanData.jsonResult.vehicle_rate) {
        setVehicleRate(challanData.jsonResult.vehicle_rate);
        setLoadingInformationValue("challanRate", challanData.jsonResult.challan_rate ? challanData.jsonResult.challan_rate : challanData.jsonResult.vehicle_rate);
        setLoadingInformationValue("vehicleRate", challanData.jsonResult.vehicle_rate ? challanData.jsonResult.vehicle_rate : 0);

        setLoadingInformationValue("freight", challanData.jsonResult.freight ? challanData.jsonResult.freight : (challanData.jsonResult.load_weight * challanData.jsonResult.vehicle_rate));
      } else {
        setVehicleRate(challanData.jsonResult.permit_vehicle_rate);
        setLoadingInformationValue("challanRate", challanData.jsonResult.challan_rate ? challanData.jsonResult.challan_rate : challanData.jsonResult.permit_vehicle_rate);
        setLoadingInformationValue("vehicleRate", challanData.jsonResult.permit_vehicle_rate ? challanData.jsonResult.permit_vehicle_rate : 0);
        setLoadingInformationValue("freight", challanData.jsonResult.freight ? challanData.jsonResult.freight : (challanData.jsonResult.load_weight * challanData.jsonResult.permit_vehicle_rate));
      }
    }


    setLoadingInformationValue("hsdFilling", challanData.jsonResult.hsd_filling ? challanData.jsonResult.hsd_filling : null);
    setLoadingInformationValue("hsdSlip", challanData.jsonResult.issue_slip ? challanData.jsonResult.issue_slip : "");
    setLoadingInformationValue("hsdInLiter", challanData.jsonResult.hsd_issued ? challanData.jsonResult.hsd_issued : 0);
    setLoadingInformationValue("hsdInCash", parseFloat(challanData.jsonResult.hsd_advance ? challanData.jsonResult.hsd_advance : 0.000).toFixed(2));
    setLoadingInformationValue("loading", parseFloat(challanData.jsonResult.load_weight ? challanData.jsonResult.load_weight : 0.000).toFixed(3));
    setLoadingInformationValue("unLoading", parseFloat(challanData.jsonResult.net_unloaded ? challanData.jsonResult.net_unloaded : 0.000).toFixed(3));

    console.log(vehicleWeightList);

    if (challanData.jsonResult.load_weight && challanData.jsonResult.net_unloaded) {

      let shtQtyInKg = (challanData.jsonResult.load_weight * 1000) - (challanData.jsonResult.net_unloaded * 1000);
      setLoadingInformationValue("shortageQty", kgToTon(shtQtyInKg));

      if (challanData.jsonResult.truck_wheel_type) {
        // setLoadingInformationValue(challanData.jsonResult.truck_wheel_type);
        if (challanData.jsonResult.truck_wheel_type === "6") {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto6wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto6wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer6wheel ? challanData.shortageData.oer6wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.truck_wheel_type === "8") {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto8wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto8wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer8wheel ? challanData.shortageData.oer8wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.truck_wheel_type === "10") {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto10wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto10wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer10wheel ? challanData.shortageData.oer10wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.truck_wheel_type === "12") {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto12wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto12wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer12wheel ? challanData.shortageData.oer12wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.truck_wheel_type === "14") {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto14wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto14wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer14wheel ? challanData.shortageData.oer14wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.truck_wheel_type === "16") {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto16wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto16wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer16wheel ? challanData.shortageData.oer16wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.truck_wheel_type === "18") {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto18wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto18wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer18wheel ? challanData.shortageData.oer18wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.truck_wheel_type === "22") {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto22wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto22wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer22wheel ? challanData.shortageData.oer22wheel : 0).toFixed(2));

          }
        }


      } else {
        if (challanData.jsonResult.load_weight <= vehicleWeightList.sixWheel) {
          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto6wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto6wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer6wheel ? challanData.shortageData.oer6wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.load_weight > vehicleWeightList.sixWheel && challanData.jsonResult.load_weight <= vehicleWeightList.tenWheel) {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto10wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto10wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer10wheel ? challanData.shortageData.oer10wheel : 0).toFixed(2));

          }
        } else if (challanData.jsonResult.load_weight > vehicleWeightList.tenWheel && challanData.jsonResult.load_weight <= vehicleWeightList.twelveWheel) {

          if (challanData.shortageData) {
            if (challanData.shortageData.shortageCalculationMode === "B") {
              setExepmtedValue(challanData.shortageData.exemptedUpto12wheel);
              if (shtQtyInKg > challanData.shortageData.exemptedUpto12wheel) {

                setLoadingInformationValue("shortage", challanData.shortageData.penaltyPerKgInRupees ? challanData.shortageData.penaltyPerKgInRupees * shtQtyInKg : null);
              } else {
                setLoadingInformationValue("shortage", 0);
              }
            }

            setLoadingInformationValue("officeExp", parseFloat(challanData.shortageData.oer12wheel ? challanData.shortageData.oer12wheel : 0).toFixed(2));

          }
        }
      }

      setLoadingInformationValue("bankAdvance", challanData.jsonResult.bank_advance ? challanData.jsonResult.bank_advance : 0);
      setLoadingInformationValue("cashAdvance", challanData.jsonResult.cash_advance ? challanData.jsonResult.cash_advance : 0);
      setLoadingInformationValue("otherDeduction", challanData.jsonResult.other_deduction ? challanData.jsonResult.other_deduction : 0);
      setLoadingInformationValue("otherDeductionTowards", challanData.jsonResult.deduction_towards ? challanData.jsonResult.deduction_towards : "");
      setLoadingInformationValue("ccAmt", challanData.jsonResult.cc_amt ? challanData.jsonResult.cc_amt : 0);


    }


  }, [challanData])


  async function getDataByTpNumber(tpNum) {
    await axiosInstance.get(`/api/v1/get-data-for-receive-entry/tpNo=${tpNum}`)
      .then(function (response) {
        // handle success

        console.log(response.data);

        if (!response.data) {
          // resetFirstSection();
          Swal.fire({
            icon: "error",
            text: "Challan Not Found!!",
            confirmButtonText: "OK",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              resetFirstSection();
              resetLoadingInformation();
              return;
            }
          });
        } else {

          setChallanData(response.data);

        }

        setTpNoFindButtonDesabled(false);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
        setTpNoFindButtonDesabled(false);
      });
  }

  async function findTp() {
    setTpNoFindButtonDesabled(true);
    const tpNum = getFirstSectionValue("tpNumber");

    if (!tpNum) {
      setTpNoFindButtonDesabled(false);
      setTpNoIsEmpty(true);
      return
    }
    setTpNoIsEmpty(false);
    try {
      const formattedTpNum = tpNum.replace(/\//g, "_");
      await getDataByTpNumber(formattedTpNum);
    } catch (error) {
      toast.error("Something went wrong!!");
    }

  }

  const handleNewTp = () => {
    resetFirstSection();
    resetLoadingInformation();
  }

  const onSubmitLoadingInformation = (data) => {
    setRecords([...records, data]);

  };

  console.log(records);


  // for handling freight
  useEffect(() => {
    setLoadingInformationValue("netUl", parseFloat(getLoadingInformationValue("ulGross") ? getLoadingInformationValue("ulGross") : 0.00).toFixed(3));
    setLoadingInformationValue("unLoading", parseFloat(getLoadingInformationValue("ulGross") ? getLoadingInformationValue("ulGross") : 0.00).toFixed(2));
    setLoadingInformationValue("transRate", parseFloat(getLoadingInformationValue("challanRate") ? getLoadingInformationValue("challanRate") : 0.00).toFixed(2));
    var shortageQuantity = (getLoadingInformationValue("loading") * 1000) - (getLoadingInformationValue("unLoading") * 1000);

    setLoadingInformationValue("shortageQty", kgToTon(shortageQuantity));
    shortageQuantity > exemptedValue ? setLoadingInformationValue("shortage", shortageData * shortageQuantity) : setLoadingInformationValue("shortage", 0);
    setLoadingInformationValue("freight", parseFloat((Number(getLoadingInformationValue("challanRate")) * Number(getLoadingInformationValue("unLoading"))).toFixed(2)));

  }, [watchLoadingInformationValue("ulGross"), watchLoadingInformationValue("challanRate")])

  // for handling deduction
  useEffect(() => {
    setLoadingInformationValue("secondDeduction", parseFloat((Number(getLoadingInformationValue("hsdInCash")) + Number(getLoadingInformationValue("bankAdvance")) + Number(getLoadingInformationValue("cashAdvance")) + Number(getLoadingInformationValue("officeExp"))).toFixed(2)));

  }, [watchLoadingInformationValue("hsdInCash"), watchLoadingInformationValue("bankAdvance"), watchLoadingInformationValue("cashAdvance"), watchLoadingInformationValue("officeExp")])


  // for handling netPayble
  useEffect(() => {
    setLoadingInformationValue("netPayable", parseFloat((Number(getLoadingInformationValue("freight")) - Number(getLoadingInformationValue("secondDeduction")) - Number(getLoadingInformationValue("otherDeduction"))).toFixed(2)));
  }, [watchLoadingInformationValue("freight"), watchLoadingInformationValue("secondDeduction"), watchLoadingInformationValue("otherDeduction"), watchLoadingInformationValue("ccAmt")])


  // for calculating sum
  useEffect(() => {

    setTotalFormFieldValue("nos", records.length);

    const totalPQty = records.reduce((acc, obj) => acc + Number(obj.unLoading), 0);
    setTotalFormFieldValue("pQty", parseFloat(totalPQty).toFixed(2));

    const totalFreight = records.reduce((acc, obj) => acc + Number(obj.freight), 0);
    setTotalFormFieldValue("totalFreight", parseFloat(totalFreight).toFixed(2));

    const totalDeduction = records.reduce((acc, obj) => acc + Number(obj.secondDeduction), 0);
    setTotalFormFieldValue("totalDeduction", parseFloat(totalDeduction).toFixed(2));

    const totalPayble = records.reduce((acc, obj) => acc + Number(obj.netPayable), 0);
    setTotalFormFieldValue("payable", parseFloat(totalPayble).toFixed(2));

    const totalCCAmount = records.reduce((acc, obj) => acc + Number(obj.ccAmt), 0);
    setVoucherFieldValue("totalCCAmt", parseFloat(totalCCAmount).toFixed(2));

    const totalCashAdv = records.reduce((acc, obj) => acc + Number(obj.cashAdvance), 0);
    setVoucherFieldValue("secondCashAdvance", parseFloat(totalCashAdv).toFixed(2));

    setVoucherFieldValue("afterCcAmt", parseFloat(Number(getTotalFormFieldValue("payable")) - Number(getVoucherFieldValue("totalCCAmt"))).toFixed(2));

    // setVoucherFieldValue("percent", getVoucherFieldValue("percent") ? getVoucherFieldValue("percent") : 0);
    setVoucherFieldValue("amt", parseFloat((parseFloat(getVoucherFieldValue("secondCashAdvance") ? getVoucherFieldValue("secondCashAdvance") : 0) * parseFloat(getVoucherFieldValue("percent") ? getVoucherFieldValue("percent") : 0)) / 100).toFixed(2));

    setVoucherFieldValue("totalTdsAmt", parseFloat((parseFloat(getVoucherFieldValue("tdsPercent") ? getVoucherFieldValue("tdsPercent") : 0) * parseFloat(getVoucherFieldValue("afterCcAmt") ? getVoucherFieldValue("afterCcAmt") : 0)) / 100).toFixed(2));

    setVoucherFieldValue("totalNetPayble", parseFloat(Number(getVoucherFieldValue("afterCcAmt")) - Number(getVoucherFieldValue("amt")) - Number(getVoucherFieldValue("totalTdsAmt"))).toFixed(2));

  }, [records])

  useEffect(() => {
    setVoucherFieldValue("afterCcAmt", parseFloat(Number(getTotalFormFieldValue("payable")) - Number(getVoucherFieldValue("totalCCAmt"))).toFixed(2));

    // setVoucherFieldValue("percent", getVoucherFieldValue("percent") ? getVoucherFieldValue("percent") : 0);
    setVoucherFieldValue("amt", parseFloat((parseFloat(getVoucherFieldValue("secondCashAdvance") ? getVoucherFieldValue("secondCashAdvance") : 0) * parseFloat(getVoucherFieldValue("percent") ? getVoucherFieldValue("percent") : 0)) / 100).toFixed(2));

    setVoucherFieldValue("totalTdsAmt", parseFloat((parseFloat(getVoucherFieldValue("tdsPercent") ? getVoucherFieldValue("tdsPercent") : 0) * parseFloat(getVoucherFieldValue("afterCcAmt") ? getVoucherFieldValue("afterCcAmt") : 0)) / 100).toFixed(2));

    setVoucherFieldValue("totalNetPayble", parseFloat(Number(getVoucherFieldValue("afterCcAmt")) - Number(getVoucherFieldValue("amt")) - Number(getVoucherFieldValue("totalTdsAmt"))).toFixed(2));
  }, [watchVoucherFieldValue("totalCCAmt"), watchVoucherFieldValue("percent"), watchVoucherFieldValue("tdsPercent"), watchVoucherFieldValue("afterCcAmt")])



  // Saving the field data
  async function postFieldData(obj) {
    await axiosInstance.post('/api/v1/add/one/reference-voucher',
      obj
    )
      .then(function (response) {
        // handle success
        console.log(response.data);
        console.log(response.status);

        if (response.data && response.status === 201) {
          setVoucherFieldValue("referenceNumber", response.data);
        } else {
          Swal.fire({
            icon: "error",
            text: "Internal Server Error!!",
            confirmButtonText: "close",
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              resetFirstSection();
              resetLoadingInformation();
              return;
            }
          });
        }

      })
      .catch(function (error) {
        // handle error
        console.log(error)
        Swal.fire({
          icon: "error",
          text: "Some Error Occured!!",
          confirmButtonText: "close",
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            resetFirstSection();
            resetLoadingInformation();
            return;
          }
        });
      });
  }

  // submit voucher filed data

  const onSubmitVoucherField = (data) => {
    if (!challanHolderDetails) {
      return;
    }
    const voucherData = {
      "receiveDate": data.receiveDate,
      "totalTgAmount": data.totalTgAmount ? data.totalTgAmount : 0,
      "receivedFromId": challanHolderDetails.id,
      "receivedFrom": data.receivedFrom,
      "discounterId": challanHolderDetails.id,
      "panNumber": data.secondPanNumber,
      "contactNumber": data.contactNumber,
      "challanHolderId": challanHolderDetails.id,
      "collectionCenterId": data.collectionCenter,
      "totalCcAmount": data.totalCCAmt ? data.totalCCAmt : 0,
      "afterCcAmount": data.afterCcAmt ? data.afterCcAmt : 0,
      "cashAdvance": data.secondCashAdvance ? data.secondCashAdvance : 0,
      "cashAdvPercent": data.percent >= 0 ? data.percent : 0,
      "cashTransExpAmountOnAdvance": data.amt ? parseFloat(data.amt).toFixed(2) : 0,
      "tdsSubmitted": data.submittedTdsForm ? "Y" : "N",
      "tdsPercentage": data.tdsPercent ? data.tdsPercent : 0,
      "totalTdsAmount": data.totalTdsAmt ? data.totalTdsAmt : 0,
      "totalNetPayble": data.totalNetPayble ? data.totalNetPayble : 0

    }

    // console.log(voucherData);

    const obj = {
      list: records,
      voucherData: voucherData
    }

    postFieldData(obj);
  }

  useEffect(() => {
    console.log("hvshdshdsv shdshdvgsd hsdgvshdsgvyd 7e27237tgwd7uwted7wgdw");
    console.log(challanHolderDetails);
    if (challanHolderDetails) {
      console.log(challanHolderDetails);
      setFirstSectionValue("panNumber", challanHolderDetails.panNum);
      setVoucherFieldValue("secondPanNumber", challanHolderDetails.panNum)
      setVoucherFieldValue("receivedFrom", challanHolderDetails.name)

      getBankDetailsById(challanHolderDetails.id);

    }
  }, [challanHolderDetails])


  return (
    <>
      <div className="work-space-container">
        <div className="container">
          <div
            className="alert alert-primary text-center font-weight-bold text-dark position-relative p-2"
            role="alert"
          >
            {/* name of the table */}
            <span className="mb-0 h6">Challan Received Entry</span>
          </div>

          <div>
            <form>
              <div className="form-row">
                <div className="col-sm-6">
                  <label htmlFor="challanHolder" className="form-label">Challan Holder</label>
                  <div className="row">
                    <div className="col-sm-6">
                      {/* <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="challanHolder"
                        name="challanHolder"
                        {...registerFirstSection("challanHolder")}
                      /> */}

                      <AutoComplete
                        placeholder={"Search here"}
                        url={'/api/v1/challan-holder/get/all/name-and-pan-ids?keyword='}
                        datakey={"name"}
                        customLoading={<>Loading..</>}
                        onSelect={(res) => setChallanHolderDetails(res)}
                        onChange={(input) => { }}
                        onBlur={(e) => { }}
                        onFocus={(e) => { }}
                        customStyles={{}}
                      />

                    </div>
                    <div className="col-sm-2">
                      <OpenChallanHolderPageInNewTab />
                    </div>
                    <div className="col-sm-2">
                      <button type="button" class="btn btn-sm btn-primary mb-3" >Refresh</button>
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <label htmlFor="panNumber" className="form-label">PAN</label>
                  <div className="row">
                    <div className="col-sm">
                      {/* <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="panNumber"
                        name="panNumber"
                        {...registerFirstSection("panNumber")}
                      /> */}

                      <AutoComplete
                        placeholder={"Search here"}
                        url={'/api/v1/challan-holder/get/all/pan-and-name-ids?keyword='}
                        datakey={"pan"}
                        customLoading={<>Loading..</>}
                        onSelect={(res) => setChallanHolderDetails(res)}
                        onChange={(input) => { }}
                        onBlur={(e) => { }}
                        onFocus={(e) => { }}
                        customStyles={{}}
                      />

                    </div>
                    <div className="col-sm">
                      <button type="button" class="btn btn-sm btn-primary mb-3" >Pending</button>
                    </div>

                  </div>
                </div>

                <div className="col-sm-2">
                  <label htmlFor="tpNumber" className="form-label"></label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="tpNumber"
                        name="tpNumber"

                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="challanStatus" className="form-label"></label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="challanStatus"
                        name="challanStatus"
                        value="received"
                        {...registerFirstSection("challanStatus")}
                        hidden={true}
                      />

                    </div>
                  </div>
                </div>

              </div>
              <div className="form-row">
                <div className="col-sm-4">
                  <label htmlFor="challanNumber" className="form-label">Challan No</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="challanNumber"
                        name="challanNumber"
                        {...registerFirstSection("challanNumber")}
                      />

                    </div>
                    <div className="col-auto">
                      <button type="button" class="btn btn-sm btn-primary mb-3" >Get</button>
                    </div>

                  </div>
                </div>
                <div className="col-sm-6">
                  <label htmlFor="bankDetails" className="form-label">Bank Details</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="bankDetails"
                        name="bankDetails"
                        {...registerFirstSection("bankDetails")}
                      />

                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <button type="button" class="btn btn-sm btn-primary mt-4 mr-2" >New List</button>
                  <button type="button" class="btn btn-sm btn-danger mt-4 ml-2" >Voucher</button>
                </div>
              </div>

              <div className="form-row">
                <div className="col-sm">
                  <label htmlFor="belongsToPermit" className="form-label">Belongs To Permit</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="belongsToPermit"
                        name="belongsToPermit"
                        {...registerFirstSection("belongsToPermit")}
                      />

                    </div>

                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="tpNumber" className="form-label">TP Number</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="tpNumber"
                        name="tpNumber"
                        {...registerFirstSection("tpNumber")}
                      />

                    </div>
                    <div className="col-auto">
                      <button type="button" class="btn btn-sm btn-primary mb-3" disabled={tpNoFindButtonDesabled} onClick={() => { findTp() }} >Get</button>
                    </div>

                  </div>
                </div>

                <div className="col-sm">

                  <button type="button" class="btn btn-sm btn-primary mt-4 ml-2" onClick={handleNewTp}>New TP</button>
                  <button type="button" class="btn btn-sm btn-danger mt-4 ml-2" >Get Vehicle</button>
                </div>
              </div>

            </form>
          </div>


          <div>
            <h6 className="h6 ml-2 mt-4">Loading Information</h6>
          </div>
          <div className="card p-2 custom-bg">
            <form onSubmit={handleLoadingInformation(onSubmitLoadingInformation)}>
              <div className="form-row mt-2">
                <div className="col-sm-3">
                  <label htmlFor="loadDate" className="form-label">Load Date</label>
                  <div className="row">
                    <div className="col-auto">
                      <Controller
                        id="loadDate"
                        name="loadDate"
                        control={controlLoadingInformation}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            placeholderText="Select date"
                            className='date-picker-input pl-2'
                            onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                            selected={field.value ? new Date(field.value) : null}
                            dateFormat="d-MMM-yyyy"

                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-2">
                  <label htmlFor="rcNumber" className="form-label">Truck Number</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="rcNumber"
                        name="rcNumber"
                        {...registerLoadingInformation("truckNumber")}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm-1">
                  <label htmlFor="rcNumber" className="form-label">RC Status</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="rcNumber"
                        name="rcNumber"
                        {...registerLoadingInformation("rcNumber")}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm-3">
                  <label htmlFor="owner" className="form-label">Owner</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="owner"
                        name="owner"
                        {...registerLoadingInformation("owner")}
                      />

                    </div>

                  </div>
                </div>
                <div className="col-sm-3">
                  <label htmlFor="owner" className="form-label">PAN</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="panNumber"
                        name="panNumber"
                        {...registerLoadingInformation("panNumber")}
                      />

                    </div>

                  </div>
                </div>
              </div>

              <div className="form-row mt-2">
                <div className="col-sm-3">
                  <label htmlFor="loadedAt" className="form-label">Loaded At</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="loadedAt"
                        name="loadedAt"
                        {...registerLoadingInformation("loadedAt")}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-3">
                  <label htmlFor="destination" className="form-label">Destination</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="destination"
                        name="destination"
                        {...registerLoadingInformation("destination")}
                        readOnly
                        style={{ backgroundColor: '#ffff' }}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm-3">
                  <label htmlFor="unloadingDate" className="form-label">Unloading Date</label>
                  <div className="row">
                    <div className="col-sm-8">

                      <Controller
                        id="unloadingDate"
                        name="unloadingDate"
                        control={controlLoadingInformation}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            placeholderText="Select date"
                            className='date-picker-input pl-2'
                            onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                            selected={field.value ? new Date(field.value) : null}
                            dateFormat="d-MMM-yyyy"

                          />
                        )}
                      />

                    </div>

                  </div>
                </div>
                <div className="col-sm-3">
                  <label htmlFor="secondChallanNumber" className="form-label">Challan Number</label>
                  <div className="row">
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="secondChallanNumber"
                        name="secondChallanNumber"
                        {...registerLoadingInformation("secondChallanNumber")}
                      />

                    </div>

                  </div>
                </div>
              </div>

              <div className="form-row mt-2">
                <div className="col-sm-3">
                  <label htmlFor="driverWelfare" className="form-label">Drv. Welfare</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="driverWelfare"
                        name="driverWelfare"
                        {...registerLoadingInformation("driverWelfare")}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-3">
                  <label htmlFor="broker" className="form-label">Agent/Broker</label>
                  <div className="row">
                    <div className="col-sm-10">

                      {allBrokersName ?
                        <select
                          className="form-select form-select-sm w-75"
                          style={{ backgroundColor: '#D5F0C1' }}
                          aria-label="Default select example"
                          name='agent'
                          id='agent'
                          {...registerLoadingInformation("agent")}
                        >
                          {/* <option selected value="0">On A/C of SE</option> */}
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

                <div className="col-sm-3">
                  <label htmlFor="type" className="form-label">Type</label>
                  <div className="row">
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="type"
                        name="type"
                        {...registerLoadingInformation("type")}
                      />

                    </div>

                  </div>
                </div>
                <div className="col-sm-3">
                  <label htmlFor="invNumber" className="form-label">WS/Inv. Number</label>
                  <div className="row">
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="invNumber"
                        name="invNumber"
                        {...registerLoadingInformation("invNumber")}
                      />

                    </div>

                  </div>
                </div>
              </div>
              {/* section 4 */}
              <div className="form-row mt-2">
                <div className="col-sm">
                  <label htmlFor="ulGross" className="form-label">UL Gross</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="ulGross"
                        name="ulGross"
                        {...registerLoadingInformation("ulGross")}

                      />

                    </div>

                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="ulTare" className="form-label">UL Tare</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="ulTare"
                        name="ulTare"
                        {...registerLoadingInformation("ulTare")}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="netUl" className="form-label">Net UL</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        id="netUl"
                        name="netUl"
                        {...registerLoadingInformation("netUl")}
                        readOnly
                        style={{ backgroundColor: '#ffff' }}
                      />

                    </div>
                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="vehicleRate" className="form-label">Vehicle Rate</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        id="vehicleRate"
                        name="vehicleRate"
                        {...registerLoadingInformation("vehicleRate")}
                        readOnly
                        style={{ backgroundColor: '#ffff' }}
                      />

                    </div>
                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="challanRate" className="form-label">Challan Rate</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="challanRate"
                        name="challanRate"
                        {...registerLoadingInformation("challanRate")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* section 5 */}
              <div className="form-row mt-2">
                <div className="col-sm-4">
                  <label htmlFor="petrolPump" className="form-label">Petrol Pump</label>
                  <div className="row">
                    <div className="col-sm-10">

                      {allFillingStationsName ?
                        <select
                          className="form-select form-select-sm"
                          style={{ backgroundColor: '#D5F0C1' }}
                          aria-label="Default select example"
                          name='petrolPump'
                          id='petrolPump'
                          {...registerLoadingInformation("petrolPump")}
                        >

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
                  </div>
                </div>

                <div className="col-sm-4">
                  <label htmlFor="hsdFilling" className="form-label">HSD Filling</label>
                  <div className="row">
                    <div className="col-sm-10">
                      {/* <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="hsdFilling"
                      name="hsdFilling"
                      {...register("hsdFilling")}
                    /> */}

                      <Controller
                        id="hsdFilling"
                        name="hsdFilling"
                        control={controlLoadingInformation}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            placeholderText="Select date"
                            className='date-picker-input pl-2'
                            onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                            selected={field.value ? new Date(field.value) : null}
                            dateFormat="d-MMM-yyyy"

                          />
                        )}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <label htmlFor="hsdSlip" className="form-label">HSD Slip</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="hsdSlip"
                        name="hsdSlip"
                        {...registerLoadingInformation("hsdSlip")}
                      />

                    </div>

                  </div>
                </div>
              </div>
              {/* section 6 */}
              <div className="form-row mt-2">
                <div className="col-sm-4">
                  <label htmlFor="hsdInLiter" className="form-label">HSD in Liter</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="hsdInLiter"
                        name="hsdInLiter"
                        {...registerLoadingInformation("hsdInLiter")}
                      />

                    </div>

                  </div>
                </div>
                <div className="col-sm-4">
                  <label htmlFor="hsdInCash" className="form-label">HSD in Cash</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="hsdInCash"
                        name="hsdInCash"
                        {...registerLoadingInformation("hsdInCash")}
                      />

                    </div>

                  </div>
                </div>
              </div>
              {/* section 7 */}

              <div className="form-row mt-2">
                <div className="col-sm">
                  <label htmlFor="loading" className="form-label">Loading</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        id="loading"
                        name="loading"
                        {...registerLoadingInformation("loading")}
                        readOnly
                        style={{ backgroundColor: '#ffff' }}
                      />

                    </div>

                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="unLoading" className="form-label">Un-Loading</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        id="unLoading"
                        name="unLoading"
                        {...registerLoadingInformation("unLoading")}
                        readOnly
                        style={{ backgroundColor: '#ffff' }}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="shortageQty" className="form-label">Shortage</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        id="shortageQty"
                        name="shortageQty"
                        {...registerLoadingInformation("shortageQty")}
                        readOnly
                        style={{ backgroundColor: '#ffff' }}
                      />

                    </div>
                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="transRate" className="form-label">Trans. Rate</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        id="transRate"
                        name="transRate"
                        {...registerLoadingInformation("transRate")}
                        readOnly
                        style={{ backgroundColor: '#ffff' }}
                      />

                    </div>
                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="shortage" className="form-label">Shortage</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        id="shortage"
                        name="shortage"
                        {...registerLoadingInformation("shortage")}
                        readOnly
                        style={{ backgroundColor: '#ffff' }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="bankAdvance" className="form-label">Bank Advance</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm w-75 custom-border"
                        id="bankAdvance"
                        name="bankAdvance"
                        {...registerLoadingInformation("bankAdvance")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* section 8 */}
              <div className="form-row mt-2">
                <div className="col-sm-4">
                  <label htmlFor="cashAdvance" className="form-label">Cash Advance</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="cashAdvance"
                        name="cashAdvance"
                        {...registerLoadingInformation("cashAdvance")}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <label htmlFor="officeExp" className="form-label">Office Exp.</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="number"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="officeExp"
                        name="officeExp"
                        {...registerLoadingInformation("officeExp")}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm-4">
                  <label htmlFor="fieldStaff" className="form-label">Field Staff</label>
                  <div className="row">
                    <div className="col-sm-10">

                      {allFieldStaffNames ?
                        <select
                          className="form-select form-select-sm w-75"
                          style={{ backgroundColor: '#D5F0C1' }}
                          aria-label="Default select example"
                          name='fieldStaff'
                          id='fieldStaff'
                          {...registerLoadingInformation("fieldStaff")}
                        >

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
              {/* section 9 */}
              <div className="form-row mt-2">
                <div className="col-sm-3">
                  <label htmlFor="otherDeduction" className="form-label">Other Deduction</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="number"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="otherDeduction"
                        name="otherDeduction"
                        {...registerLoadingInformation("otherDeduction")}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <label htmlFor="otherDeductionTowards" className="form-label">Other Deduction Towards</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <textarea
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="otherDeductionTowards"
                        name="otherDeductionTowards"
                        {...registerLoadingInformation("otherDeductionTowards")}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm-3">
                  <label htmlFor="ccAmt" className="form-label">CC Amt</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="number"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#D5F0C1' }}
                        id="ccAmt"
                        name="ccAmt"
                        {...registerLoadingInformation("ccAmt")}
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* section 10 */}
              <div className="form-row mt-4">
                <div className="col-sm">
                  <label htmlFor="freight" className="form-label">Freight</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#FFEF82' }}
                        id="freight"
                        name="freight"
                        {...registerLoadingInformation("freight")}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="secondDeduction" className="form-label">Deduction</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="number"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#FFEF82' }}
                        id="secondDeduction"
                        name="secondDeduction"
                        {...registerLoadingInformation("secondDeduction")}
                      />

                    </div>
                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="netPayable" className="form-label">Net Payable</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#FFEF82' }}
                        id="netPayable"
                        name="netPayable"
                        {...registerLoadingInformation("netPayable")}
                      />
                    </div>

                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="enteredBy" className="form-label">Entered By</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#FAD9E6' }}
                        id="enteredBy"
                        name="enteredBy"
                        {...registerLoadingInformation("enteredBy")}
                      />
                    </div>

                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="lastUpdatedDate" className="form-label">Last Updated Date</label>
                  <div className="row">
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        style={{ backgroundColor: '#FAD9E6' }}
                        id="lastUpdatedDate"
                        name="lastUpdatedDate"
                        {...registerLoadingInformation("lastUpdatedDate")}
                      />
                    </div>

                  </div>
                </div>
              </div>
              <div>
                <button type="button" class="btn btn-sm btn-primary mt-4 mr-2" >Note</button>
                <button type="submit" class="btn btn-sm btn-primary mt-4 mr-2" >Add 2 List</button>
              </div>



            </form>
          </div>


          <div className="card p-2">
            <div className=" overflow-x-scroll">
              <table className="table table-striped table-bordered table-hover align-middle">
                <thead className="thead-dark">
                  <tr className='text-center'>
                    <th className='p-1' scope="col">SL No.</th>
                    <th className='p-1' scope="col">Challan No</th>
                    <th className='p-1' scope="col">TP No</th>
                    <th className='p-1' scope="col">Challan Date</th>
                    <th className='p-1' scope="col">Truck No</th>
                    <th className='p-1' scope="col">Load Qty</th>
                    <th className='p-1' scope="col">Unload Qty</th>
                    <th className='p-1' scope="col">Shortage</th>
                    <th className='p-1' scope="col">Freight</th>
                    <th className='p-1' scope="col">Deduction</th>
                    <th className='p-1' scope="col">Payble</th>
                    {/* <th className='p-1' scope="col">Broker/Agent</th> */}
                    <th className='p-1' scope="col">Other Deduction Towards</th>

                    {/* <th className='p-1' scope="col" colSpan="2">Actions</th> */}
                  </tr>
                </thead>
                <tbody className='font-weight-normal textColor'>
                  {records && records.map((data, idx) => (
                    <tr key={idx}>
                      <td className='p-1'>{idx + 1}</td>
                      <td className='p-1'>{data.secondChallanNumber}</td>
                      <td className='p-1'>{data.transitPassNo}</td>
                      <td className='p-1'>{data.unloadingDate}</td>
                      <td className='p-1'>{data.truckNumber}</td>
                      <td className='p-1'>{data.loading}</td>
                      <td className='p-1'>{data.unLoading}</td>
                      <td className='p-1'>{data.shortage}</td>
                      <td className='p-1'>{data.freight}</td>
                      <td className='p-1'>{data.secondDeduction}</td>
                      <td className='p-1'>{data.netPayable}</td>
                      <td className='p-1'>{data.otherDeductionTowards}</td>
                      {/* <td className='p-1'>{data.secondDeduction}</td> */}
                      {/* <td className='p-1' data-toggle="modal" data-target="#editModal" onClick={() => { handleEdit(data.id, data.name, data.contactNo, data.shortName, data.address1, data.address2, data.address3) }}><i className="bi bi-pencil-square text-primary"></i></td>
                      <td className='p-1'><i className="bi bi-trash text-danger" onClick={() => { handleDelete(data.id) }}></i></td> */}
                    </tr>
                  ))}

                </tbody>
              </table>

            </div>
          </div>


          <div className="card p-2 m-1">
            <div className="form-row">
              <div className="col-sm">
                <label htmlFor="nos" className="form-label">Nos.</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="number"
                      className="form-control form-control-sm w-75 custom-border"
                      id="nos"
                      name="nos"
                      {...registerTotalFormField("nos")}
                    />

                  </div>

                </div>
              </div>

              <div className="col-sm">
                <label htmlFor="pQty" className="form-label">P Qty.</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="number"
                      className="form-control form-control-sm w-75 custom-border"
                      id="pQty"
                      name="pQty"
                      {...registerTotalFormField("pQty")}
                    />

                  </div>
                </div>
              </div>

              <div className="col-sm">
                <label htmlFor="totalFreight" className="form-label">Freight</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="number"
                      className="form-control form-control-sm w-75 custom-border"
                      id="totalFreight"
                      name="totalFreight"
                      {...registerTotalFormField("totalFreight")}
                    />

                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="totalDeduction" className="form-label">Deduction</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="number"
                      className="form-control form-control-sm w-75 custom-border"
                      id="totalDeduction"
                      name="totalDeduction"
                      {...registerTotalFormField("totalDeduction")}
                    />

                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="payable" className="form-label">Payable</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="number"
                      className="form-control form-control-sm w-75 custom-border"
                      id="payable"
                      name="payable"
                      {...registerTotalFormField("payable")}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>


          <form onSubmit={handleVoucherFormField(onSubmitVoucherField)}>

            <div className="card p-2 custom-bg-green">

              <div className="form-row mt-2">
                <div className="col-sm">
                  <label htmlFor="receiveDate" className="form-label">Receive Date</label>
                  <div className="row">
                    <div className="col-auto">
                      {/* <input
                      type="text"
                      className="form-control form-control-sm custom-border"
                      id="tpNumber"
                      name="tpNumber"
                    /> */}

                      <Controller
                        id="receiveDate"
                        name="receiveDate"
                        control={controlVoucherField}
                        defaultValue={null}
                        render={({ field }) => (
                          <DatePicker
                            placeholderText="Select date"
                            className='date-picker-input pl-2'
                            onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                            selected={field.value ? new Date(field.value) : null}
                            dateFormat="d-MMM-yyyy"

                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="referenceNumber" className="form-label">Reference Number</label>
                  <div className="row">
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="referenceNumber"
                        name="referenceNumber"
                        disabled={records.length ? true : false}
                        {...registerVoucherField("referenceNumber")}

                      />

                    </div>
                    <div className="col-sm-2">
                      <button type="button" class="btn btn-sm btn-primary mb-3" >Find</button>
                    </div>
                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="totalTgAmt" className="form-label">Total TG Amt</label>
                  <div className="row">
                    <div className="col-sm-8">
                      <input
                        type="number"
                        className="form-control form-control-sm custom-border"
                        id="totalTgAmt"
                        name="totalTgAmt"
                        {...registerVoucherField("totalTgAmt")}
                      />

                    </div>

                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="receivedFrom" className="form-label">Received From</label>
                  <div className="row">
                    <div className="col-sm-12">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="receivedFrom"
                        name="receivedFrom"
                        {...registerVoucherField("receivedFrom")}
                      />

                    </div>

                  </div>
                </div>
              </div>
              {/* second section */}
              <div className="form-row mt-2">
                <div className="col-sm">
                  <label htmlFor="secondPanNumber" className="form-label">PAN Number</label>
                  <div className="row">
                    <div className="col-auto">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="secondPanNumber"
                        name="secondPanNumber"
                        {...registerVoucherField("secondPanNumber")}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                  <div className="row">
                    <div className="col-sm">
                      <input
                        type="text"
                        className="form-control form-control-sm custom-border"
                        id="contactNumber"
                        name="contactNumber"
                        {...registerVoucherField("contactNumber")}
                      />

                    </div>

                  </div>
                </div>

                <div className="col-sm">
                  <label htmlFor="collectionCenter" className="form-label">Collection Center</label>
                  <div className="row">
                    <div className="col-sm">

                      {allCollectionCenterNames ?
                        <select
                          className="form-select form-select-sm"
                          aria-label="Default select example"
                          name='collectionCenter'
                          id='collectionCenter'
                          {...registerVoucherField("collectionCenter")}
                        >

                          {
                            allCollectionCenterNames.map((item, idx) => {
                              return <option key={idx} value={item.id}>{item.name}</option>
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
                <div className="col-sm">
                  <label htmlFor="totalCCAmt" className="form-label">Total CC Amt</label>
                  <div className="row">
                    <div className="col-sm">
                      <input
                        type="number"
                        className="form-control form-control-sm custom-border"
                        id="totalCCAmt"
                        name="totalCCAmt"
                        {...registerVoucherField("totalCCAmt")}
                      />

                    </div>

                  </div>
                </div>
                <div className="col-sm">
                  <label htmlFor="afterCcAmt" className="form-label">After CC Amt</label>
                  <div className="row">
                    <div className="col-sm">
                      <input
                        type="number"
                        className="form-control form-control-sm custom-border"
                        id="afterCcAmt"
                        name="afterCcAmt"
                        {...registerVoucherField("afterCcAmt")}
                      />

                    </div>

                  </div>
                </div>
              </div>

              {/* Third section */}
              <div className="form-row mt-2">
                <div className="col-sm-4">
                  <div className="row">
                    <div className="col-sm">
                      <label htmlFor="secondCashAdvance" className="form-label">Cash Adv.</label>
                      <div className="row">
                        <div className="col-sm">
                          <input
                            type="number"
                            className="form-control form-control-sm custom-border"
                            id="secondCashAdvance"
                            name="secondCashAdvance"
                            {...registerVoucherField("secondCashAdvance")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm">
                      <label htmlFor="percent" className="form-label">Percent</label>
                      <div className="row">
                        <div className="col-sm">
                          <input
                            type="number"
                            className="form-control form-control-sm custom-border"
                            id="percent"
                            name="percent"
                            {...registerVoucherField("percent")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm">
                      <label htmlFor="amt" className="form-label">Amt</label>
                      <div className="row">
                        <div className="col-sm">
                          <input
                            type="number"
                            className="form-control form-control-sm custom-border"
                            id="amt"
                            name="amt"
                            {...registerVoucherField("amt")}
                          />
                        </div>
                      </div>
                    </div>


                  </div>
                </div>

                <div className="col-sm-8">
                  <div className="row">
                    <div className="col-sm">
                      <label htmlFor="submittedTdsForm" className="form-label">Submitted TDS Form</label>
                      <div className="row text-center">

                        <div className="col-sm">
                          <input
                            className="form-check-input border-dark-subtle"
                            type="checkbox"
                            name="submittedTdsForm"
                            id="submittedTdsForm"
                            {...registerVoucherField("submittedTdsForm")}
                          />
                          No
                        </div>
                      </div>
                    </div>
                    <div className="col-sm">
                      <label htmlFor="tdsPercent" className="form-label">TDS %</label>
                      <div className="row">
                        <div className="col-sm">
                          <input
                            type="number"
                            className="form-control form-control-sm custom-border"
                            id="tdsPercent"
                            name="tdsPercent"
                            {...registerVoucherField("tdsPercent")}
                            disabled={watchVoucherFieldValue("submittedTdsForm")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm">
                      <label htmlFor="totalTdsAmt" className="form-label">Tot. TDS Amt</label>
                      <div className="row">
                        <div className="col-sm">
                          <input
                            type="text"
                            className="form-control form-control-sm custom-border"
                            id="totalTdsAmt"
                            name="totalTdsAmt"
                            {...registerVoucherField("totalTdsAmt")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm">
                      <label htmlFor="totalNetPayble" className="form-label">Tot. Net Payble</label>
                      <div className="row">
                        <div className="col-sm">
                          <input
                            type="text"
                            className="form-control form-control-sm custom-border"
                            id="totalNetPayble"
                            name="totalNetPayble"
                            {...registerVoucherField("totalNetPayble")}
                          />
                        </div>
                      </div>
                    </div>


                  </div>
                </div>


              </div>


            </div>

            <div className="button-container">
              <div className="button-item"></div>
              <div className="button-item text-center">
                <button
                  type="submit"
                  class="btn btn-primary m-1"
                >
                  Save
                </button>
                <button type="button" class="btn btn-primary m-1">
                  Delete
                </button>
                <button type="button" class="btn btn-primary m-1">
                  New
                </button>
              </div>
            </div>
          </form>
        </div>
        <Toaster
          position="bottom-center"
          reverseOrder={true}
        />
      </div>
    </>
  );
}

export default ChallanReceivedEntry;
