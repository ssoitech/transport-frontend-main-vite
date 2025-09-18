import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tab, Tabs } from "react-bootstrap";
import ChallanWise from "./advancePaidSection/ChallanWise";
import PermitWise from "./advancePaidSection/PermitWise";
import LoadingPoint from "./advancePaidSection/LoadingPoint";
import UnLoadingPoint from "./advancePaidSection/UnLoadingPoint";
import OtherDeduction from "./advancePaidSection/OtherDeduction";
import CashAndBank from "./advancePaidSection/CashAndBank";
import axiosInstance from "../../config/AxiosConfig";
import DateWise from "./advancePaidSection/DateWise";

function AdvancePaid() {
  const [formData, setFormData] = useState({
    traderId: "",
    loadingPointId: "",
    destinationId: "",
    permitFromDate: null,
    permitToDate: null,
    permitNumber: "",
    billingType: "",
    suppressZero: false,
  });

  const [traders, setTraders] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState([]);
  const [destinations, setDestinations] = useState([]);


  // Load options for select boxes on component mount
  useEffect(() => {

    const fetchSelectOptions = async () => {
      try {
        const billingPartyRes = await axiosInstance.get("/api/v1/get/all/trader-billing-party-names");
        const billingPartyArrayOfObjects = billingPartyRes.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setTraders(billingPartyArrayOfObjects);

        const loadingPointRes = await axiosInstance.get("/api/v1/get/all/loading-point-names");
        const loadingPointResArrayOfObjects = loadingPointRes.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setLoadingPoints(loadingPointResArrayOfObjects);
        const destinationRes = await axiosInstance.get("/api/v1/get/all/unloading-point-names");

        const destinationResArrayOfObjects = destinationRes.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setDestinations(destinationResArrayOfObjects);

      } catch (error) {
        console.error("Error loading options:", error);
      }
    };

    fetchSelectOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
  };

  return (
    <div>
      <div className="work-space-container">
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">Advance Paid to Vehicle</span>
        </div>
        <form>
          <div className="form-row">
            {/* Billing/Trader Party */}
            <div className="form-group col-md-2">
              <label>Billing/Trader Party</label>
              <select
                name="traderId"
                className="form-select form-select-sm border-dark-subtle"
                onChange={handleInputChange}
                value={formData.traderId}
              >
                <option value="">Select All</option>
                {traders.map(trader => (
                  <option key={trader.id} value={trader.id}>{trader.name}</option>
                ))}
              </select>
            </div>

            {/* Source */}
            <div className="form-group col-md-2">
              <label>Source</label>
              <select
                name="loadingPointId"
                className="form-select form-select-sm border-dark-subtle"
                onChange={handleInputChange}
                value={formData.loadingPointId}
              >
                <option value="">Select All</option>
                {loadingPoints.map(point => (
                  <option key={point.id} value={point.id}>{point.name}</option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div className="form-group col-md-2">
              <label>Destination</label>
              <select
                name="destinationId"
                className="form-select form-select-sm border-dark-subtle"
                onChange={handleInputChange}
                value={formData.destinationId}
              >
                <option value="">Select All</option>
                {destinations.map(destination => (
                  <option key={destination.id} value={destination.id}>{destination.name}</option>
                ))}
              </select>
            </div>

            {/* Loading Date */}
            <div className="form-group col-md-6">
              <div className="d-flex justify-content-center mb-2">
                <select
                  className="form-select form-select-sm border-dark-subtle w-50 mx-auto text-center"
                  id="loading-date"
                  aria-label="Loading date"
                >
                  <option value="">Loading Date</option>
                </select>
              </div>
              <div className="d-flex flex-row justify-content-center">
                <DatePicker
                  className="date-picker-input w-100 pl-2"
                  selected={formData.permitFromDate}
                  onChange={(date) => handleDateChange("permitFromDate", date)}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select a date"
                  required={true}
                />
                <div className="mx-3">To</div>
                <DatePicker
                  className="date-picker-input w-100 pl-2"
                  selected={formData.permitToDate}
                  onChange={(date) => handleDateChange("permitToDate", date)}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select a date"
                  required={true}
                />
              </div>
            </div>
          </div>

          {/* Permit No, Billing Type, Suppress ZERO */}
          <div className="form-row">
            <div className="form-group col-md-3">
              <label>Permit No.</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                name="permitNumber"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group col-md-3 align-self-center">
              <div className="form-check form-check-inline">
                <label>Suppress ZERO Amount</label>
                <input
                  type="checkbox"
                  className="form-check-input mt-1 border-dark-subtle"
                  name="suppressZero"
                  checked={formData.suppressZero}
                  onChange={(e) =>
                    setFormData({ ...formData, suppressZero: e.target.checked })
                  }
                />
              </div>
            </div>
            <div className="form-group col-md-3">
              <label>Billing Type</label>
              <select
                name="billingType"
                className="form-select form-select-sm border-dark-subtle"
                onChange={handleInputChange}
              >
                <option value="">Select Both</option>
              </select>
            </div>
          </div>
        </form>
        <hr />
        {/* Tabs Section */}
        <Tabs defaultActiveKey="challan-wise" id="fill-tab-example" className="mb-3" fill>
          <Tab eventKey="challan-wise" title="Challan Wise">
            <ChallanWise formData={formData} />
          </Tab>
          <Tab eventKey="permit-wise" title="Permit Wise">
            <PermitWise formData={formData} />
          </Tab>
          <Tab eventKey="date-wise" title="Date Wise">
            <DateWise formData={formData} />
          </Tab>
          <Tab eventKey="loading-point" title="Loading Point">
            <LoadingPoint formData={formData} />
          </Tab>
          <Tab eventKey="unloading-point" title="Un Loading Point">
            <UnLoadingPoint formData={formData} />
          </Tab>
          <Tab eventKey="other-deduction" title="Other Deduction">
            <OtherDeduction formData={formData} />
          </Tab>
          <Tab eventKey="cash-and-bank" title="Cash & Bank">
            <CashAndBank formData={formData} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default AdvancePaid;
