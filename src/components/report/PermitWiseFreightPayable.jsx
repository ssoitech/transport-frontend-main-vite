import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";


function PermitWiseFreightPayable() {
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
    <div>
      <div className="work-space-container">
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">Permit-Wise Freight Payable</span>
        </div>
        <form>
          <div className="form-row">
          <div className="form-group col-md-2">
              <label htmlFor="consignor">Billing Party</label>

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
            <div className="form-group col-md-4 align-self-center">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Permit Period</label>
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
            <div className="form-group col-md-1 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Search
              </button>
            </div>
            <div className="form-group col-md-1">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Excel
              </button>
            </div>
          </div>
        </form>
        {ownerData ? (
          <div className="card-body table-card">
            <table className="table table-striped table-bordered table-hover align-middle">
              <thead className="thead-dark">
                <tr className="text-center">
                  <th scope="col">SL No.</th>
                  <th scope="col">BilingParty Name</th>
                  <th scope="col">Permit No.</th>
                  <th scope="col">Permit Date</th>
                  <th scope="col">Total TP</th>
                  <th scope="col">Total Qty</th>
                  <th scope="col">Total Payable</th>
                  
                </tr>
              </thead>
              <tbody className="font-weight-normal textColor">
                {ownerData.map((data, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{data.partyName}</td>
                    <td>{data.stackNo}</td>
                    <td>{data.permitNo}</td>
                    <td>{data.quantity}</td>
                    <td>{data.approximateAmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="spinner-border text-primary m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PermitWiseFreightPayable;
