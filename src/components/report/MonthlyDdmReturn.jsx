import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
function MonthlyDdmReturn() {
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
          <span className="mb-0 h6">DDM Monthly Return</span>
        </div>
        <form >
          <div className="form-row">
          <div className="form-group col-md-4 align-self-center">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Reporting Period</label>
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
            <div className="form-group col-md-2 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Permit-wise Return Format 0
              </button>
            </div>
            <div className="form-group col-md-2 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Permit-wise Return Format 1
              </button>
            </div>
            <div className="form-group col-md-2 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Permit-wise Return Format 2
              </button>
            </div>
            <div className="form-group col-md-2 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Excel
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
                  <th scope="col">Permit Date</th>
                  <th scope="col">Mineral</th>
                  <th scope="col">Source</th>
                  <th scope="col">Destination</th>
                  <th scope="col">Permit Number</th>
                  <th scope="col">Nos. of Trips</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Freight Charged</th>
                  
                </tr>
              </thead>
              <tbody className="font-weight-normal textColor">
                {ownerData.map((data, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{data.permitDate}</td>
                    <td>{data.mineral}</td>
                    <td>{data.source}</td>
                    <td>{data.destination}</td>
                    <td>{data.permitNumber}</td>
                    <td>{data.noOfTrips}</td>
                    <td>{data.quentity}</td>
                    <td>{data.frightCharged}</td>
                    
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
  )
}

export default MonthlyDdmReturn