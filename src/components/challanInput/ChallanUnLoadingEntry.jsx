import React, { useEffect, useState } from "react";
import { format, differenceInDays } from "date-fns";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ChallanSearchBar from "./ChallanSearchBar";
import LoadingInfoForm from "./LoadingInfoForm";
import UnloadInfoForm from "./UnloadInfoForm";
import ActionButtons from "./ActionButtons";
import ReusableSection from "../reusable/ReusableSection";
import ReusableCard from "../reusable/ReusableCard";
import ReusableToast from "../reusable/ReusableToast";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";

function ChallanUnLoadingEntry() {
  // React Query subscription for accessDetails (replaces Redux)
  const { data: accessDetails, isLoading: isAccessLoading } = useApiQuery({
    key: "accessDetails",
    url: "/api/v1/access-details", // replace with your endpoint
    enabled: true,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: 5000,
  });
  const navigate = useNavigate();

  // Local state for form and API
  const [data, setData] = useState();
  // Removed unused: const [challanNoIsEmpty, setChallanNoIsEmpty] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [startSpinner, setStartSpinner] = useState(false);
  const [challanStatus, setChallanStatus] = useState();
  const [tpIsSearching, setTpIsSearching] = useState(false);
  const [tpNumber, setTpNumber] = useState("");
  const [challanNumber, setChallanNumber] = useState("");
  const [unLoadingDate, setUnloadingDate] = useState(null);
  const [loadingDate, setLoadingDate] = useState(null);

  // Status color mapping for UI
  const statusColor = [
    {
      status: "transit",
      color: "bg-danger text-light pl-2 pr-2 py-1 border-5 rounded-2",
    },
    {
      status: "unloaded",
      color: "bg-dark text-light pl-2 pr-2 py-1 border-5 rounded-2",
    },
    {
      status: "received",
      color: "bg-warning pl-2 pr-2 py-1 border-5 rounded-2",
    },
    {
      status: "paid",
      color: "bg-success text-light pl-2 pr-2 py-1 border-5 rounded-2",
    },
  ];

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    // Removed unused: formState: { errors },
  } = useForm();

  // --- API hooks using generic useApiQuery ---
  // Fetch challan details by challan number
  const {
    // Removed unused: data: challanData, isLoading: isChallanLoading, error: challanError,
    refetch: refetchChallan,
  } = useApiQuery({
    key: "challan-unloading-details",
    url: challanNumber
      ? `/api/v1/get/one/challan-details/for-unloading/${challanNumber}`
      : null,
    method: "get",
    enabled: !!challanNumber && isSearching,
    select: (response) =>
      response.length > 0 ? arrayToObject(response) : null,
    onSuccess: (result) => {
      setIsSearching(false);
      if (!result) {
        ReusableToast.error("Challan does not exist.");
      } else {
        setData(result);
      }
    },
    onError: () => {
      setIsSearching(false);
      ReusableToast.error("Some Error Occurred!");
    },
  });

  // Fetch challan details by TP number
  const {
    // Removed unused: data: tpData, isLoading: isTpLoading, error: tpError,
    refetch: refetchTp,
  } = useApiQuery({
    key: "challan-unloading-tp-details",
    url: tpNumber
      ? `/api/v1/get/one/challan/unloading/by-tp/${tpNumber.name?.replace(
          /\//g,
          "_"
        )}`
      : null,
    method: "get",
    enabled: !!tpNumber && tpIsSearching,
    select: (response) =>
      response.length > 0 ? arrayToObject(response) : null,
    onSuccess: (result) => {
      setTpIsSearching(false);
      if (!result) {
        ReusableToast.error("Challan does not exist.");
      } else {
        setData(result);
      }
    },
    onError: () => {
      setTpIsSearching(false);
      ReusableToast.error("Some Error Occurred!");
    },
  });

  // Mutation for saving unloading data
  const { mutate: saveUnloading, isLoading: isSaving } = useApiMutation({
    key: "save-challan-unloading",
    url: "/api/v1/update/one/challan/unload",
    method: "post",
    onSuccess: (response) => {
      setStartSpinner(false);
      if (response === "updated" || response === "saved") {
        Swal.fire({
          text: "Challan Successfully Marked as Unloaded and Saved.",
          icon: "success",
        });
      } else {
        Swal.fire({ title: "Some Error Occurred!!", icon: "error" });
      }
    },
    onError: () => {
      setStartSpinner(false);
      Swal.fire({ title: "Some Error Occurred!!", icon: "error" });
    },
  });

  // --- Utility: Convert array to object for form population ---
  const arrayToObject = (data) => {
    const arrayOfObjects = data.map((innerArray) => {
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
        officeExpenses: innerArray[47],
      };
    });
    return arrayOfObjects[0];
  };

  // --- Form population effect ---
  useEffect(() => {
    if (!data) return;
    if (data.status !== "transit" && data.status !== "unloaded") {
      Swal.fire({ text: `Challan ${data.status}`, icon: "info" });
      return;
    }
    setChallanStatus(data.status || "");
    setValue("challanNumber", data.challanNumber);
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
    setUnloadingDate(data.unloadDate || unLoadingDate);
    setValue("deliveryDays", data.deliveryDays || "");
    setValue("unloadTruck", data.unloadTruck || "");
    setValue("wheelNo", data.truckWheelNo || "");
    setValue("unloadGross", data.unloadingGross || "");
    setValue("unloadTare", data.unloadingTare || "");
    setValue("netUnloaded", data.netUnloaded || "");
  }, [data, setValue, unLoadingDate]);

  // --- Delivery days calculation effect ---
  useEffect(() => {
    if (loadingDate && unLoadingDate) {
      const date1 = format(loadingDate, "yyyy-MM-dd");
      const date2 = format(unLoadingDate, "yyyy-MM-dd");
      const daysDifference = differenceInDays(new Date(date2), new Date(date1));
      setValue("deliveryDays", daysDifference);
    }
  }, [loadingDate, unLoadingDate, setValue]);

  // --- Handlers for search and save ---
  const getDataByChallanNumber = () => {
    setIsSearching(true);
    if (!challanNumber) {
      // Removed setChallanNoIsEmpty (no longer used)
      setIsSearching(false);
      return;
    }
    refetchChallan();
  };

  const getDataByTpNumber = () => {
    setTpIsSearching(true);
    if (!tpNumber || !tpNumber.name) {
      setTpIsSearching(false);
      return;
    }
    refetchTp();
  };

  // --- Form submit handler ---
  const onSubmit = () => {
    setStartSpinner(true);
    const unloadingData = {
      tpNumber: getValues("tpNo"),
      status: "unloaded",
      unloadDate: unLoadingDate,
      deliveryDays: getValues("deliveryDays"),
      unloadTruck: getValues("unloadTruck"),
      truckWheelNo: getValues("wheelNo"),
      unloadingGross: getValues("unloadGross"),
      unloadingTare: getValues("unloadTare"),
      netUnloaded: getValues("netUnloaded"),
      updatedBy: accessDetails?.userId || null,
    };
    saveUnloading(unloadingData);
  };

  // --- Access control logic ---
  useEffect(() => {
    if (isAccessLoading) return;
    if (accessDetails) {
      if (accessDetails.role !== "ADMIN") {
        if (accessDetails.role === "USER") {
          if (accessDetails.challanInputAccess !== "Y") {
            Swal.fire(
              "Error",
              "You don't have access to this section.",
              "error"
            );
            navigate("/work-space");
          }
        } else {
          Swal.fire("Error", "You don't have access to this section.", "error");
          navigate("/work-space");
        }
      }
    } else {
      Swal.fire("Error", "You don't have access to this section.", "error");
      navigate("/work-space");
    }
  }, [accessDetails, isAccessLoading, navigate]);

  // --- Main Render ---
  return (
    <ReusableSection>
      <ReusableCard>
        <form id="challanForm" onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
            <div
              className="alert alert-primary text-center font-weight-bold text-dark position-relative p-2"
              role="alert"
            >
              <span className="mb-0 h6">
                Challan Un-Loading Entry (Manually)
              </span>
            </div>
            <ChallanSearchBar
              isSearching={isSearching}
              tpIsSearching={tpIsSearching}
              challanNumber={challanNumber}
              tpNumber={tpNumber}
              setChallanNumber={setChallanNumber}
              setTpNumber={setTpNumber}
              getDataByChallanNumber={getDataByChallanNumber}
              getDataByTpNumber={getDataByTpNumber}
            />
            {challanStatus &&
              statusColor.map((data, idx) => (
                <div
                  hidden={challanStatus !== data.status}
                  className="text-center"
                  key={idx}
                >
                  <span>Challan Status : </span>
                  <span className={data.color}>{data.status}</span>
                </div>
              ))}
            <h6 className="h6 ml-2">Loading Information</h6>
            <LoadingInfoForm
              register={register}
              loadingDate={loadingDate}
              setLoadingDate={setLoadingDate}
            />
            <h6 className="h6 ml-2 mt-5">Unload Information</h6>
            <UnloadInfoForm
              register={register}
              unLoadingDate={unLoadingDate}
              setUnloadingDate={setUnloadingDate}
            />
            <ActionButtons startSpinner={startSpinner} isSaving={isSaving} />
          </div>
        </form>
        <ReusableToast position="bottom-center" reverseOrder={true} />
      </ReusableCard>
    </ReusableSection>
  );
}

export default ChallanUnLoadingEntry;
