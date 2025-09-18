import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function TruckWiseFreightPaid() {
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
        "/api/v1/query/summary/"
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
          <span className="mb-0 h6">Truck-wise-Freight Paid</span>
        </div>
        <form>
          <div className="form-row">
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
            <div className="form-group col-md-1">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Proceed
              </button>
            </div>
            <div className="form-group col-md-1 mx-3">
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
          <div className="form-row">
            <div className="form-group col-md-2">

              <label htmlFor="nosOfTruck">Nos of Truck</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="nosOfTruck"
              />
            </div>
            <div className="form-group col-md-2">

              <label htmlFor="nosOfTrips">Nos of Trips</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="nosOfTrips"
              />
            </div>
            <div className="form-group col-md-2">

              <label htmlFor="totalPayment">Total Payment</label>

              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="totalPayment"
              />
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
                  <th scope="col">Truck Number</th>
                  <th scope="col">Load Date</th>
                  <th scope="col">Payment Date</th>
                  <th scope="col">Freight Amt.</th>
                  <th scope="col">Deduction</th>
                  <th scope="col">Balance</th>
                  <th scope="col">TDS %</th>
                  <th scope="col">TDS Amount</th>
                  <th scope="col">Net Paid Amt</th>
                  <th scope="col">PAN</th>
                  <th scope="col">Owner Name</th>
                  <th scope="col">Contact No</th>
                </tr>
              </thead>
              <tbody className="font-weight-normal textColor">
                {ownerData.map((data, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{data.truckNumber}</td>
                    <td>{data.loadDate}</td>
                    <td>{data.paymentDate}</td>
                    <td>{data.freightAmt}</td>
                    <td>{data.deduction}</td>
                    <td>{data.balance}</td>
                    <td>{data.tdsPercent}</td>
                    <td>{data.tdsAmount}</td>
                    <td>{data.netPaidAmt}</td>
                    <td>{data.pan}</td>
                    <td>{data.ownerName}</td>
                    <td>{data.contactNo}</td>
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
