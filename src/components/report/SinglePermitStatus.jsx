import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingDate from "./singlePermitSection/LoadingDate";
import UnLoadingDate from "./singlePermitSection/UnLoadingDate";
import PaymentDate from "./singlePermitSection/PaymentDate";
import ReportDate from "./singlePermitSection/ReportDate";
import Details from "./singlePermitSection/Details";
import VehicleOwner from "./singlePermitSection/VehicleOwner";
import OnQuantity from "./singlePermitSection/OnQuantity";
import Union from "./singlePermitSection/Union";

function SinglePermitStatus() {
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
          <span className="mb-0 h6">Single Permit Status</span>
        </div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Permit No.</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
            <div className="form-group col-md-1 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Get
              </button>
            </div>
            <div className="form-group col-md-1 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Proceed
              </button>
            </div>
            <div className="form-group col-md-1 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                New
              </button>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Total Challan</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Total Qty</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <label htmlFor="consignor">Billing Party</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="consignor">Consignor</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="consinee">Consinee</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Loading Point</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Unloading Point</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Quantity</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
            <div className="form-group col-md-4">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Permit Valide Period</label>
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
        <div>
          <Tabs
            defaultActiveKey="loading-date"
            id="fill-tab-example"
            className="mb-3"
            fill
          >
            <Tab eventKey="loading-date" title="Loading Date">
              <LoadingDate />
            </Tab>
            <Tab eventKey="unloading-date" title="Un-Loading Date">
              <UnLoadingDate />
            </Tab>
            <Tab eventKey="payment-date" title="Payment Date">
              <PaymentDate />
            </Tab>
            <Tab eventKey="report-date" title="Report Date">
              <ReportDate />
            </Tab>
            <Tab eventKey="details" title="Details">
              <Details />
            </Tab>
            <Tab eventKey="vehicle-owner" title="Vehicle owner">
              <VehicleOwner />
            </Tab>
            <Tab eventKey="on-quantity" title="Loading Vehicle">
              <OnQuantity />
            </Tab>
            <Tab eventKey="union" title="Union/Non-Union">
              <Union />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default SinglePermitStatus;
