import React, { useState } from "react";
import './report_css/job_performance.css';
import { Tab, Tabs } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingPerfomance from "./jobPerfomanceSection/LoadingPerfomance";
import UnLoadingPerfomance from "./jobPerfomanceSection/UnLoadingPerfomance";
import BillingInformation from "./jobPerfomanceSection/BillingInformation";
import ChallanReceived from "./jobPerfomanceSection/ChallanReceived";
import Challanpayment from "./jobPerfomanceSection/Challanpayment";
import BankAndCash from "./jobPerfomanceSection/BankAndCash";
import LoadingVehicle from "./jobPerfomanceSection/LoadingVehicle";

function JobPerfomance() {
  const [ownerData, setOwnerData] = useState();
  const [permitFromDate, setPermitFromDate] = useState(null);

  const [permitToDate, setPermitToDate] = useState(null);
  const [updateData, setUpdateData] = useState(false); // used in useEffect as a dependency to update the table

  const handleFromDateChange = (date) => {
    setPermitFromDate(date);
  };
  const handleToDateChange = (date) => {
    setPermitToDate(date);
  };
  return (
    <div>
      <div className="work-space-container">
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">Job Performance</span>
        </div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-4">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Reporting Date</label>
              </div>
              <div className="d-flex flex-row justify-content-center">
                <DatePicker
                  className="date-picker-input w-100 pl-2"
                  selected={permitFromDate}
                  onChange={handleFromDateChange}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select a date"
                  name="permitFromDate"
                  id="permitFromDate"
                  required={true}
                />
                <div className="mx-3">To</div>
                <DatePicker
                  className="date-picker-input w-100 pl-2"
                  selected={permitToDate}
                  onChange={handleToDateChange}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select a date"
                  name="permitToDate"
                  id="permitToDate"
                  required={true}
                />
              </div>
            </div>
          </div>
        </form>
        <hr />
        <div className="tab-container">
          <Tabs
            defaultActiveKey="loading-performance"
            id="fill-tab-example"
            className="mb-3 d-flex justify-content-around"
            fill
          >
            <Tab eventKey="loading-performance" title="Loading Performance">
              <LoadingPerfomance />
            </Tab>
            <Tab eventKey="unloading-performance" title="Unloading Performance">
              <UnLoadingPerfomance />
            </Tab>
            <Tab eventKey="billing-information" title="Billing Information">
              <BillingInformation />
            </Tab>
            <Tab eventKey="challan-received" title="Challan Received">
              <ChallanReceived />
            </Tab>
            <Tab eventKey="challan-payment" title="Challan Payment">
              <Challanpayment />
            </Tab>
            <Tab eventKey="bank-and-cash" title="Bank & Cash">
              <BankAndCash />
            </Tab>
            <Tab eventKey="loading-vehicle" title="Loading Vehicle">
              <LoadingVehicle />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default JobPerfomance;
