import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import axiosInstance from "../../config/AxiosConfig";
import PaginationComponent from "../customComponents/PaginationComponent";
import Swal from "sweetalert2";

function CancelledChallanReport() {
  const { register, handleSubmit, setValue, control } = useForm();
  const [searchedData, setSearchedData] = useState([]);
  const [formData, setFormData] = useState();
  const [totalNumberOfData, setTotalNumberOfData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValues, setInputValues] = useState({});

  const [pageSize, setPageSize] = useState(10); // Default page size is 10

  // -------------------------------------------------------------------------------
  // write setValue function for total challan and quantity
  // --------------------------------------------------------

  async function getDataByPagenumber(fData, page) {
    await axiosInstance
      .post("/api/v1/find-daily-report", fData)
      .then(function (response) {
        // handle success
        console.log(response.data);
        // console.log(response.data.totalPages);
        setSearchedData(response.data.content);
        setTotalNumberOfData(response.data.totalElements);
        setTotalPages(response.data.totalPages); // Set the total pages
        setCurrentPage(page); // Set the current page

        setValue('totalChallan', 'John');
        setValue('totalQuantity', 'Doe');
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);

      });
  }

  async function postFilteredData(data, page) {
    const searchedData = {
      startDate: data.permitFromDate
        ? format(data.permitFromDate, "yyyy-MM-dd")
        : null,
      endDate: data.permitToDate
        ? format(data.permitToDate, "yyyy-MM-dd")
        : null,
      page: page,
      size: pageSize,
    };

    setFormData(searchedData);
    console.log(searchedData);
    getDataByPagenumber(searchedData, page);
  }

  const onSubmit = async (data) => {
    try {
      setInputValues(data); // Store the input values for pagination
      await postFilteredData(data, 0);
    } catch (error) {
      console.error("Error fetching report data:", error);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    postFilteredData(inputValues, page); // Fetch data for the selected page
  };

  // Handler for changing page size
  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    // postFilteredData(inputValues, 0); // Re-fetch data with new page size, starting from page 0
  };

  function handleAccess() {
    Swal.fire("Access Denied");
    return;
  }

  return (
    <>
      <div className="work-space-container">
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">Canceled Challan Report </span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col-md-4 align-self-center">
              <div className="text-center">
                {" "}
                <label htmlFor="inputField3">Loading Period</label>
              </div>
              <div className="d-flex flex-row justify-content-center">
                <Controller
                  control={control}
                  name="permitFromDate"
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="d-MMM-yyyy"
                      placeholderText="Select a date"
                      className="date-picker-input w-100 pl-2"
                    />
                  )}
                />
                <div className="mx-3">To</div>
                <Controller
                  control={control}
                  name="permitToDate"
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="d-MMM-yyyy"
                      placeholderText="Select a date"
                      className="date-picker-input w-100 pl-2"
                    />
                  )}
                />
              </div>
            </div>
            <div className="form-group col-md-1">
              <button
                type="submit"
                className="btn btn-sm btn-primary  mt-4 ml-2"
                onClick={handleAccess}
              >
                GET
              </button>
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Total Challans</label>

              <input
                type="text"
                {...register("totalChallan")}
                className="form-control form-control-sm border-dark-subtle"
                id="totalChallan"
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="consignor">Total Quantity</label>

              <input
                type="text"
                {...register("totalQuantity")}
                className="form-control form-control-sm border-dark-subtle"
                id="totalQuantity"
              />
            </div>
          </div>
        </form>
        <hr />
        <div className="mx-auto mt-2">
          <div className="container mt-5">
            <div>
              <h6>
                {" "}
                <span>Total Records : </span>
                <span>{totalNumberOfData ? totalNumberOfData : 0}</span>
              </h6>
            </div>
            <hr />
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr className="p-1 text-center">
                    <th>S.L No</th>
                    <th>Billing Party Name</th>
                    <th>Permit Number</th>
                    <th>Loading Point Name</th>
                    <th>Unloading Point Name</th>
                    <th>TP Count</th>
                    <th>Weight Sum</th>
                    <th>Freight Amount</th>
                    <th>Cash Advance</th>
                    <th>Bank Advance</th>
                    <th>HSD Advance</th>
                  </tr>
                </thead>
                <tbody>
                  {searchedData.length > 0 &&
                    searchedData.map((item, index) => (
                      <tr key={index} className="p-1">
                        <td className="text-center">{index + 1}</td>
                        <td>{item.billing_party_name}</td>
                        <td>{item.permit_number}</td>
                        <td>{item.loading_point_name}</td>
                        <td>{item.unloading_point_name}</td>
                        <td className="text-center">{item.tp_count}</td>
                        <td>
                          {item.weight_sum
                            ? parseFloat(item.weight_sum).toFixed(3)
                            : 0.0}
                        </td>
                        <td>
                          {item.freight_amount
                            ? parseFloat(item.freight_amount).toFixed(2)
                            : 0.0}
                        </td>
                        <td>
                          {item.cash_advance
                            ? parseFloat(item.cash_advance).toFixed(2)
                            : 0.0}
                        </td>
                        <td>
                          {item.bank_advance
                            ? parseFloat(item.bank_advance).toFixed(2)
                            : 0.0}
                        </td>
                        <td>
                          {item.hsd_advance
                            ? parseFloat(item.hsd_advance).toFixed(2)
                            : 0.0}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Page size dropdown */}
          <div className="d-flex justify-content-end mb-3">
            <label htmlFor="pageSize" className="form-label me-2 my-auto">
              Records per page:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
              className="form-select form-select-sm"
              style={{ width: "auto" }} // Adjust width to make it smaller
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          <div className="mt-2">
            {/* Render the pagination component */}
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default CancelledChallanReport;
