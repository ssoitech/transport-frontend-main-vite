import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tab, Tabs } from "react-bootstrap";
import Summary1 from "./payableSummarySection/Summary1";
import PayableSummarytab from "./payableSummarySection/PayableSummarytab";
import ChallanInMarket from "./payableSummarySection/ChallanInMarket";
import Summary2 from "./payableSummarySection/Summary2";
import Summary3 from "./payableSummarySection/Summary3";
import axiosInstance from "../../config/AxiosConfig";

function PayableSummary() {
  const [billingOptions, setBillingOptions] = useState([]);
  const [loadingPointOptions, setLoadingPointOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);

  // State variables for form fields
  const [billingParty, setBillingParty] = useState("");
  const [loadingPoint, setLoadingPoint] = useState("");
  const [destination, setDestination] = useState("");
  const [permitFromDate, setPermitFromDate] = useState(null);
  const [permitToDate, setPermitToDate] = useState(null);

  // Load options for select boxes on component mount
  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const billingPartyRes = await axiosInstance.get("/api/v1/get/all/trader-billing-party-names");
        const billingPartyArrayOfObjects = billingPartyRes.data.map(element => ({
          id: element[0],
          name: element[1]
        }));
        setBillingOptions(billingPartyArrayOfObjects);

        const loadingPointRes = await axiosInstance.get("/api/v1/get/all/loading-point-names");
        const loadingPointResArrayOfObjects = loadingPointRes.data.map(element => ({
          id: element[0],
          name: element[1]
        }));
        setLoadingPointOptions(loadingPointResArrayOfObjects);

        const destinationRes = await axiosInstance.get("/api/v1/get/all/unloading-point-names");
        const destinationResArrayOfObjects = destinationRes.data.map(element => ({
          id: element[0],
          name: element[1]
        }));
        setDestinationOptions(destinationResArrayOfObjects);
      } catch (error) {
        console.error("Error loading options:", error);
      }
    };

    fetchSelectOptions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submit action here (e.g., sending the data to an API)
    console.log({ billingParty, loadingPoint, destination, permitFromDate, permitToDate });
  };

  return (
    <div className="work-space-container">
      <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
        <span className="mb-0 h6">Permit-Wise Freight Payable(Despatch Period)</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-2">
            <label htmlFor="billingParty">Billing Party</label>
            <select
              id="billingParty"
              value={billingParty}
              onChange={(e) => setBillingParty(e.target.value)}
              className="form-select form-select-sm border-dark-subtle"
            >
              <option value="">Select All</option>
              {billingOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-2">
            <label htmlFor="loadingPoint">Loading Point</label>
            <select
              id="loadingPoint"
              value={loadingPoint}
              onChange={(e) => setLoadingPoint(e.target.value)}
              className="form-select form-select-sm border-dark-subtle"
            >
              <option value="">Select All Points/Plots</option>
              {loadingPointOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-2">
            <label htmlFor="destination">Destination</label>
            <select
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="form-select form-select-sm border-dark-subtle"
            >
              <option value="">Select All Points/Plots</option>
              {destinationOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="reportDate">Despatch</label>
            <div className="d-flex flex-row justify-content-center">
              <DatePicker
                selected={permitFromDate}
                onChange={setPermitFromDate}
                dateFormat="d-MMM-yyyy"
                className="form-control form-control-sm"
                placeholderText="From"
              />
              <div className="mx-3">To</div>
              <DatePicker
                selected={permitToDate}
                onChange={setPermitToDate}
                dateFormat="d-MMM-yyyy"
                className="form-control form-control-sm"
                placeholderText="To"
              />
            </div>
          </div>
        </div>
      </form>

      <hr />
      <div>
        <Tabs defaultActiveKey="summary1" id="fill-tab-example" className="mb-3" fill>
          <Tab eventKey="summary1" title="Summary1 List">
            <Summary1 billingParty={billingParty} loadingPoint={loadingPoint} destination={destination} permitFromDate={permitFromDate} permitToDate={permitToDate} />
          </Tab>
          <Tab eventKey="payable-summary-tab" title="Payable-Summary-Tab List">
            <PayableSummarytab billingParty={billingParty} loadingPoint={loadingPoint} destination={destination} permitFromDate={permitFromDate} permitToDate={permitToDate} />
          </Tab>
          <Tab eventKey="challan-in-market" title="Challan-In-Market List">
            <ChallanInMarket billingParty={billingParty} loadingPoint={loadingPoint} destination={destination} permitFromDate={permitFromDate} permitToDate={permitToDate} />
          </Tab>
          <Tab eventKey="summary2" title="Summary2 List">
            <Summary2 billingParty={billingParty} loadingPoint={loadingPoint} destination={destination} permitFromDate={permitFromDate} permitToDate={permitToDate} />
          </Tab>
          <Tab eventKey="summary3" title="Summary3 List">
            <Summary3 billingParty={billingParty} loadingPoint={loadingPoint} destination={destination} permitFromDate={permitFromDate} permitToDate={permitToDate} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default PayableSummary;
