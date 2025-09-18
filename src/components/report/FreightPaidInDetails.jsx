import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
function FreightPaidInDetails() {
  const [ownerData, setOwnerData] = useState();
  const [permitFromDate, setPermitFromDate] = useState(null);
  const [permitToDate, setPermitToDate] = useState(null);
  const [updateData, setUpdateData] = useState(false); // used in useEffect as a dependency to update the table.

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
          <span className="mb-0 h6">Freight Paid - In Deatails</span>
        </div>
        <form>
          <div className="form-row">
          <div className="form-group col-md-3">
              <label htmlFor="permitNo">Permit No.</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="permitNo"
              />
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="exporter">Exporter</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All</option>
              </select>
            </div>
            
            <div className="form-group col-md-3">
              <label htmlFor="loadingPoint">Loading Point</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All</option>
              </select>
            </div>

            <div className="form-group col-md-2">
              <label htmlFor="unLoadingPoint">Un-Loading Point</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            

            <div className="form-group col-md-4">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Payment Period</label>
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
            <div className="form-group col-md-3">
              <div className="form-check form-check-inline">
                <label htmlFor="displayOrder">Display Order</label>
              </div>
              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">On Despatch</option>
              </select>
            </div>
            
            <div className="form-group col-md-3">
            <button type="button" className="btn btn-sm btn-primary  mt-4 ml-2">
              Search
            </button>

            <button type="button" className="btn btn-sm btn-primary  mt-4 ml-2">
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
                      
                    </tr>
                  </thead>
                  <tbody className="font-weight-normal textColor">
                    {ownerData.map((data, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        {/* <td>{data.computerEntryData}</td>
                        <td>{data.openingBalance}</td>
                        <td>{data.receivedChallanQuantity}</td>
                        <td>{data.receivedPayableAmount}</td>
                        <td>{data.totalOutstanding}</td>
                        <td>{data.paymentRelased}</td>
                        <td>{data.balancePyableAmount}</td> */}
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
  );
}

export default FreightPaidInDetails;
