import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function TdsCollectedStatement() {
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
          <span className="mb-0 h6">TDS Collected Statement</span>
        </div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-2">
              <div className="form-check form-check-inline">
                <label htmlFor="checkTds">All Benificiary</label>
                <input
                  className="form-check-input mt-1 border-dark-subtle"
                  type="checkbox"
                  name="allBenificiary"
                  id="alBenificiary"
                  // onChange={handleChange}
                />
              </div>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
            </div>
            <div className="form-group col-md-2">
              <div className="text-center">
                {" "}
                <div className="form-check form-check-inline ">
                  <label htmlFor="inputField3">
                    Report On
                    <select
                      className="form-select form-select-sm border-dark-subtle"
                      aria-label="Default select example"
                    >
                      <option value="">Payment Period</option>
                    </select>
                  </label>
                </div>
                {/* check for the drop down */}
              </div>
            </div>
            <div className="form-group col-md-4 align-self-center">
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
            <div className="form-group col-md-2">
              <label htmlFor="reportOn">Report On</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">With TDS</option>
              </select>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="checkTds">Display Order</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Referance No.</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-1">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Proceed
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
            <div className="form-group col-md-1">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Summary
              </button>
            </div>
          </div>
        </form>
        <hr />
        {ownerData ? (
          <div className="card-body table-card">
            <table className="table table-striped table-bordered table-hover align-middle">
              <thead className="thead-dark">
                <tr className="text-center">
                  <th scope="col">SL No.</th>
                  <th scope="col">Beneficiary Name</th>
                  <th scope="col">PAN</th>
                  <th scope="col">Received Date</th>
                  <th scope="col">Ref. Number</th>
                  <th scope="col">Payment Date</th>
                  <th scope="col">Freight Amount</th>
                  <th scope="col">TDS Percent</th>
                  <th scope="col">TDS Amount</th>
                  <th scope="col">Deduction</th>
                  <th scope="col">Final Amount</th>
                </tr>
              </thead>
              <tbody className="font-weight-normal textColor">
                {ownerData.map((data, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.pan}</td>
                    <td>{data.receivedDate}</td>
                    <td>{data.refNumber}</td>
                    <td>{data.paymentDate}</td>
                    <td>{data.freightAmount}</td>
                    <td>{data.tdsPercent}</td>
                    <td>{data.tdsAmount}</td>
                    <td>{data.deduction}</td>
                    <td>{data.finalAmount}</td>
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

export default TdsCollectedStatement;
