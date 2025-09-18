import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import axiosInstance from "../../config/AxiosConfig";

function ReceivedVspaidVsDue() {
  const [ownerData, setOwnerData] = useState();
  const [permitFromDate, setPermitFromDate] = useState(null);
  const [permitToDate, setPermitToDate] = useState(null);
  const [updateData, setUpdateData] = useState(false); // used in useEffect as a dependency to update the table.

  const handleFromDateChange = (date) => {
    setPermitFromDate(format(date, 'yyyy-MM-dd'));
  };
  const handleToDateChange = (date) => {
    setPermitToDate(format(date, 'yyyy-MM-dd'));
  };

  async function getData() {
    await axiosInstance.post("/api/v1/query/summary/", {
      startDate: permitFromDate,
      endDate: permitToDate
    }) //enter the get api for table
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
          <span className="mb-0 h6">Daily Report(Within a Period)</span>
        </div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-6">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Computer Entry Date</label>
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
            <div className="form-group col-md-4 d-flex align-self-center">
              <button type="button" className="btn btn-sm btn-primary  mt-4 ml-4" onClick={getData}>
                Search
              </button>

              <button type="button" className="btn btn-sm btn-primary mt-4 ml-4   ">
                Excel
              </button>
            </div>
          </div>
        </form>
        <div className="mx-auto mt-2">
          <div className="card mb-4">
            {/*  <!-- Card Header - Dropdown --> */}

            {ownerData ? (
              <div className="card-body table-card">
                <table className="table table-striped table-bordered table-hover align-middle">
                  <thead className="thead-dark">
                    <tr className="text-center">
                      <th scope="col">SL No.</th>
                      <th scope="col">Computer Entry Date</th>
                      <th scope="col">Opening Balance</th>
                      <th scope="col">Received Challan Quantity</th>
                      <th scope="col">Received Payable Amount</th>
                      <th scope="col">Total OutStanding </th>
                      <th scope="col">Payment Relased</th>
                      <th scope="col">Balance Payable Amount</th>
                    </tr>
                  </thead>
                  <tbody className="font-weight-normal textColor">
                    {ownerData.map((data, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{data.computerEntryData}</td>
                        <td>{data.openingBalance}</td>
                        <td>{data.receivedChallanQuantity}</td>
                        <td>{data.receivedPayableAmount}</td>
                        <td>{data.totalOutstanding}</td>
                        <td>{data.paymentRelased}</td>
                        <td>{data.balancePyableAmount}</td>
                        {/* <td data-toggle="modal" data-target="#editModal" onClick={() => { handleEdit(data.id, data.name, data.contactNo, data.shortName, data.address1, data.address2, data.address3) }}><i className="bi bi-pencil-square text-primary"></i></td> */}
                        {/* <td><i className="bi bi-trash text-danger" onClick={() => { handleDelete(data.id) }}></i></td> */}
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
      </div>
    </div>
  );
}

export default ReceivedVspaidVsDue;
