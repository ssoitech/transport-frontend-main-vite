import React, { useEffect, useState } from "react";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableCard from "../reusable/ReusableCard";
import ReusableInput from "../reusable/ReusableInput";
import ReusableTable from "../reusable/ReusableTable";
import ReusableSection from "../reusable/ReusableSection";
import ReusableToast from "../reusable/ReusableToast";

import VehicleRateReadOnly from "./permitMasterSection/VehicleRateReadOnly";
import ShortageDataReadOnly from "./permitMasterSection/ShortageDataReadOnly";
import CryptoJS from "crypto-js";
import { useParams, useNavigate } from "react-router-dom";

/**
 * PermitMasterReadOnlyDynamicPage
 * - Refactored to use reusable components for all UI elements.
 * - All API logic migrated to React Query generic hooks.
 * - Redux accessDetails replaced with useApiQuery for live updates.
 * - Business logic, transformation, and validation preserved.
 */
function PermitMasterReadOnlyDynamicPage() {
  // Access details via React Query (replace Redux)
  const { data: accessDetails } = useApiQuery({
    key: "accessDetails",
    url: "/api/v1/get/access-details",
    method: "get",
    select: (data) => data,
  });

  const navigate = useNavigate();
  const { encodedId } = useParams();
  const SECRET_KEY = "your-secret-key";

  // Decrypt ID
  const decryptId = (encryptedText) => {
    try {
      const decodedText = decodeURIComponent(encryptedText);
      const bytes = CryptoJS.AES.decrypt(decodedText, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return null;
    }
  };

  // Permit details state
  const [permitDetails, setPermitDetails] = useState(null);
  const [stackTableData, setStackTableData] = useState([]);
  const [vehicleRateData, setVehicleRateData] = useState([]);
  const [shortageData, setShortageData] = useState(null);

  // Permission check (side effect)
  useEffect(() => {
    if (accessDetails) {
      if (accessDetails.role !== "ADMIN") {
        if (accessDetails.role === "USER") {
          if (accessDetails.challanInputAccess !== "Y") {
            window.alert("You don't have access to this section.");
            navigate("/work-space");
          }
        } else {
          window.alert("You don't have access to this section.");
          navigate("/work-space");
        }
      }
    } else {
      window.alert("You don't have access to this section.");
      navigate("/work-space");
    }
  }, [accessDetails, navigate]);

  // Fetch permit details via React Query
  const { data: permitApiData } = useApiQuery({
    key: "permitDetails",
    url: encodedId
      ? `/api/v1/get/permit-details-by-id/${decryptId(encodedId)}`
      : "",
    method: "get",
    enabled: !!encodedId,
    select: (data) => data,
  });

  useEffect(() => {
    if (permitApiData) {
      setPermitDetails(permitApiData.permitDetails);
      setStackTableData(permitApiData.stackDetails);
      setVehicleRateData(permitApiData.vehicleRateDetails);
      setShortageData(permitApiData.shortageData);
    }
  }, [permitApiData]);

  // Table columns
  const columns = [
    { Header: "SL No.", accessor: (row, idx) => idx + 1 },
    { Header: "Stack No", accessor: "stackNumber" },
    { Header: "Quantity in Tons", accessor: "stackQuantity" },
  ];

  return (
    <div className="m-4">
      <ReusableCard>
        <ReusableSection title="Transit Permit Details (Only View)">
          <div className="iform-custom-css">
            <div className="p-2">
              <form id="permitForm">
                <div className="row m-2">
                  <div className="col-sm-6 pr-4">
                    <ReusableInput
                      label="Mines/Consigner"
                      name="minesConsignerName"
                      value={permitDetails?.consignorShortName || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Permit Number"
                      name="permitNumber"
                      value={permitDetails?.permitNumber || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Date"
                      name="date"
                      type="date"
                      value={permitDetails?.permitDate || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Permit Type"
                      name="permitType"
                      value={
                        permitDetails?.permitType === "R"
                          ? "By Road Work"
                          : "Railway Siding"
                      }
                      readOnly
                    />
                    <ReusableInput
                      label="Exporter/Consignee"
                      name="exporter"
                      value={permitDetails?.exporterShortName || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Trader/Billing To"
                      name="trader"
                      value={permitDetails?.traderShortName || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Loading Point"
                      name="loadingPoint"
                      value={permitDetails?.loadingPointName || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Destination"
                      name="destination"
                      value={permitDetails?.destination || ""}
                      readOnly
                    />
                  </div>
                  <div className="col-sm-6 pl-4">
                    <ReusableInput
                      label="Required DDM Return"
                      name="ddmreturn"
                      value={permitDetails?.ddmReturn === "Y" ? "Yes" : "No"}
                      readOnly
                    />
                    <ReusableInput
                      label="Material"
                      name="material"
                      value={permitDetails?.materialName || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Valid From"
                      name="validFrom"
                      type="date"
                      value={permitDetails?.validFrom || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Valid Upto"
                      name="validUpto"
                      type="date"
                      value={permitDetails?.validTo || ""}
                      readOnly
                    />
                    <ReusableInput
                      label="Challan Status"
                      name="challanStatus"
                      value={
                        permitDetails?.challanStatus === "O"
                          ? "To Be Billed"
                          : ""
                      }
                      readOnly
                    />
                    <ReusableInput
                      label="Advanced Input Required"
                      name="advInp"
                      value={permitDetails?.advInput === "Y" ? "Yes" : "No"}
                      readOnly
                    />
                    <ReusableInput
                      label="Reimburse Toll Gate"
                      name="tollGate"
                      value={permitDetails?.tolGate === "Y" ? "Yes" : "No"}
                      readOnly
                    />
                    <ReusableInput
                      label="Note"
                      name="note"
                      as="textarea"
                      value={permitDetails?.note || ""}
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
            <ReusableSection title="Stack Details">
              <ReusableTable columns={columns} data={stackTableData} />
              <div className="row m-3">
                <ReusableInput
                  label="Quantity in Tons"
                  name="QtyInTons"
                  type="number"
                  value={permitDetails?.totalQty || ""}
                  readOnly
                />
              </div>
            </ReusableSection>
          </div>
        </ReusableSection>
        <ReusableSection>
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
        </ReusableSection>
        <ReusableToast position="bottom-center" reverseOrder={true} />
      </ReusableCard>
    </div>
  );
}

export default PermitMasterReadOnlyDynamicPage;
