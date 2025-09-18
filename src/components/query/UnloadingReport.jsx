import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
function UnloadingReport() {
  const [ownerData, setOwnerData] = useState();
  const [unLoadingFromDate, setUnLoadingFromDate] = useState(null);

  const [unLoadingToDate, setUnLoadingToDate] = useState(null);
  const [updateData, setUpdateData] = useState(false); // used in useEffect as a dependency to update the table
  const [loadingFromDate, setLoadingFromDate] = useState(null);

  const [loadingToDate, setLoadingToDate] = useState(null);

  const handleUnloadingFromDateChange = (date) => {
    setUnLoadingFromDate(date);
  };
  const handleUnloadingToDateChange = (date) => {
    setUnLoadingToDate(date);
  };
  const handleLoadingFromDateChange = (date) => {
    setUnLoadingFromDate(date);
  };
  const handleLoadingToDateChange = (date) => {
    setUnLoadingToDate(date);
  };
  async function getData() {
    await axios
      .get(
        "http://ssoi.themdlabs.com:8080/api/v1/get/all-exporter-consignee-master"
      ) //enter the get api for table
      .then(function (response) {
        // handle success
        setOwnerData(response.data);
        setUpdateData(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
  return (
    <>
      <div className="work-space-container">
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">
            Query On Unload Challan(Excluding To-Pay Challan)
          </span>
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
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Consignee</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Loading Point</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Unloading Point</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Paid Status</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select all</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Billing Status</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Both Type</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4 align-self-center">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Unloading Period</label>
              </div>
              <div className="d-flex flex-row justify-content-center">
                <DatePicker
                  className="date-picker-input w-100 pl-2"
                  selected={unLoadingFromDate}
                  onChange={handleUnloadingFromDateChange}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select a date"
                  name="permitFromDate"
                  id="permitFromDate"
                  required={true}
                />
                <div className="mx-3">To</div>
                <DatePicker
                  className="date-picker-input w-100 pl-2"
                  selected={unLoadingToDate}
                  onChange={handleUnloadingToDateChange}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select a date"
                  name="permitToDate"
                  id="permitToDate"
                  required={true}
                />
              </div>
            </div>
            <div className="form-group col-md-4 align-self-center">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Loading Period</label>
              </div>
              <div className="d-flex flex-row justify-content-center">
                <DatePicker
                  className="date-picker-input w-100 pl-2"
                  selected={loadingFromDate}
                  onChange={handleLoadingFromDateChange}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select a date"
                  name="permitFromDate"
                  id="permitFromDate"
                  required={true}
                />
                <div className="mx-3">To</div>
                <DatePicker
                  className="date-picker-input w-100 pl-2"
                  selected={loadingToDate}
                  onChange={handleLoadingToDateChange}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select a date"
                  name="permitToDate"
                  id="permitToDate"
                  required={true}
                />
              </div>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Display Order</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">On TP Number</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-4 ml-2"
              >
                Get
              </button>

              <button
                type="button"
                className="btn btn-sm btn-primary  mt-4 ml-2"
              >
                Excel
              </button>
            </div>
          </div>
        </form>
        <hr />
        
      </div>
    </>
  );
}

export default UnloadingReport;
