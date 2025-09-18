import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
function LoadingMaterial() {
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
          <span className="mb-0 h6">Consolidated On Loading Quantity</span>
        </div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Consignor</label>

              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All</option>
              </select>
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
              <div className="form-check form-check-inline">
                <label htmlFor="loadingPoint">Loading Point</label>
                <input
                  className="form-check-input mt-1 border-dark-subtle"
                  type="checkbox"
                  name="loadingPoint"
                  id="loadingPoint"
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
              <div className="form-check form-check-inline">
                <label htmlFor="unLoadingPoint">Unloading Point</label>
                <input
                  className="form-check-input mt-1 border-dark-subtle"
                  type="checkbox"
                  name="loadingPoint"
                  id="loadingPoint"
                  // onChange={handleChange}
                />
              </div>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="inputField1"
              />
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
          </div>
        </form>
        <hr />
        <div className="row overflow-auto">
          <div className="col-sm-7 ">
           
            <div className="card p-1">
            <div className="row justify-content-around">
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
              <table className="table table-sm table-striped table-bordered table-hover align-middle">
                <thead className="thead-dark">
                  <th className="p-1" scope="col">
                    SL No.
                  </th>
                  <th className="p-1" scope="col">
                    Permit No.
                  </th>
                  <th className="p-1" scope="col">
                    Date
                  </th>
                  <th className="p-1" scope="col">
                    Truck Number
                  </th>
                  <th className="p-1" scope="col">
                    Quantity
                  </th>
                </thead>
              </table>
            </div>
          </div>
          <div className="col-sm-5 ">
           
            <div className="card p-1">
            <div className="row justify-content-around">
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
              <table className="table table-sm table-striped table-bordered table-hover align-middle">
                <thead className="thead-dark">
                  <th className="p-1" scope="col">
                    SL No.
                  </th>
                  <th className="p-1" scope="col">
                    Permit No.
                  </th>
                  <th className="p-1" scope="col">
                    Date
                  </th>
                  <th className="p-1" scope="col">
                    Truck Number
                  </th>
                  <th className="p-1" scope="col">
                    Quantity
                  </th>
                </thead>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingMaterial;
