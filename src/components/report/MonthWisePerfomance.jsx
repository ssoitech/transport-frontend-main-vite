import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

function MonthWisePerfomance() {
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
          <span className="mb-0 h6">Month-Wise performance</span>
        </div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="consignor">DDM Return</label>

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
                <label htmlFor="inputField3">Loading Period</label>
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
                Search1
              </button>
            </div>
            <div className="form-group col-md-1 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                Search2
              </button>
            </div>
            <div className="form-group col-md-1 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                SearchA
              </button>
            </div>
            <div className="form-group col-md-1 ">
              <button
                type="button"
                className="btn btn-sm btn-primary  mt-2 ml-2"
              >
                SearchB
              </button>
            </div>
            <div className="form-group col-md-1 ">
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
                  <th scope="col">BilingParty Name</th>
                  <th scope="col">Despatch Challan</th>
                  <th scope="col">Despatch Quantity</th>
                  <th scope="col">Un-Load Challan</th>
                  <th scope="col">Un-Load Quantity</th>
                  <th scope="col">Challan On Transit</th>
                  <th scope="col">Received Challan</th>
                  <th scope="col">Paid Challan</th>
                  <th scope="col">Paid Quantity</th>
                  <th scope="col">Ballance Challan</th>
                  <th scope="col">Challan With Owner</th>
                  <th scope="col">Billed Challan</th>
                  <th scope="col">Billed Quantity</th>
                  <th scope="col">Un-Billed Challan</th>
                </tr>
              </thead>
              <tbody className="font-weight-normal textColor">
                {ownerData.map((data, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{data.partyName}</td>
                    <td>{data.despatchChallan}</td>
                    <td>{data.despatchedQuantity}</td>
                    <td>{data.unLoadChallan}</td>
                    <td>{data.unLoadQuantity}</td>
                    <td>{data.challanOnTransit}</td>
                    <td>{data.receivedChallan}</td>
                    <td>{data.paidChallan}</td>
                    <td>{data.paidQuantity}</td>
                    <td>{data.balanceChallan}</td>
                    <td>{data.challanWithOwner}</td>
                    <td>{data.billedChallan}</td>
                    <td>{data.billedQuantity}</td>
                    <td>{data.unBilledChallan}</td>
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

export default MonthWisePerfomance;
