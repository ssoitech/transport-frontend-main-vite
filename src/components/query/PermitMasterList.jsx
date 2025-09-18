import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axiosInstance from "../../config/AxiosConfig";
import { useForm, Controller } from 'react-hook-form';
import { AgGridReact } from "ag-grid-react";

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';


function PermitMasterList() {
  // Register all Community features
  ModuleRegistry.registerModules([AllCommunityModule]);

  // const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  const [searchedData, setSearchedData] = useState();
  const [consigner, setConsigner] = useState();
  const [consignee, setConsignee] = useState();
  const [loadingPoint, setLoadingPoint] = useState();
  const [unloadingPoint, setUnloadingPoint] = useState();
  const [allTraderNames, setAllTraderNames] = useState(null);

  const [permitFromDate, setPermitFromDate] = useState(null);
  const handleFromDateChange = (date) => {
    setPermitFromDate(date);
  };
  const [permitToDate, setPermitToDate] = useState(null);
  const handleToDateChange = (date) => {
    setPermitToDate(date);
  };

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      // Set default value here
      consigner: null,
      unLoading: null,
      billingType: null,
      trader: null,
      consignee: null,
      status: null,
      loading: null,
      fromEntryDate: null,
      toEntryDate: null,
      fromLoadingDate: null,
      toLoadingDate: null
    },
  });


  const [rowData] = useState([
    { id: 1, name: "John Doe", age: 25, department: "Engineering" },
    { id: 2, name: "Jane Smith", age: 30, department: "Finance" },
    { id: 3, name: "Mike Johnson", age: 28, department: "HR" },
    
  ]);

  const [columnDefs] = useState([
    { field: "id", sortable: true, filter: true },
    { field: "name", sortable: true, filter: true },
    {
      field: "age",
      sortable: true,
      filter: true,
      cellStyle: (params) => ({
        backgroundColor: params.value === 30 && "green"  // Green if age > 30
      }),
    },
  ]);


  async function getAllConsigner() {
    await axiosInstance.get('/api/v1/get/all/consigner-owner-names')
      .then(function (response) {

        const arrayOfObjects = response.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        // handle success
        setConsigner(arrayOfObjects);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  async function getAllConsignee() {
    await axiosInstance.get('/api/v1/get/all/exporter-consignee-names')
      .then(function (response) {
        // handle success
        const arrayOfObjects = response.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setConsignee(arrayOfObjects);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  async function getAllLoadingPoints() {
    await axiosInstance.get('/api/v1/get/all/loading-point-names')
      .then(function (response) {
        // handle success
        const arrayOfObjects = response.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setLoadingPoint(arrayOfObjects);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  async function getAllUnloadingPoints() {
    await axiosInstance.get('/api/v1/get/all/unloading-point-names')
      .then(function (response) {
        // handle success
        const arrayOfObjects = response.data.map(element => {
          return {
            id: element[0],
            name: element[1]
          };
        });
        setUnloadingPoint(arrayOfObjects);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  async function getAllTraderNames() {

    await axiosInstance.get('/api/v1/get/all/trader-billing-party-names')
      .then(function (response) {
        // handle success
        const arrayOfObjects = response.data.map(element => {
          return {
            name: element[0],
            label: element[1]
          };
        });

        setAllTraderNames(arrayOfObjects);

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }


  useEffect(() => {
    getAllConsigner();
    getAllConsignee();
    getAllLoadingPoints();
    getAllUnloadingPoints();
    getAllTraderNames();
  }, [])


  return (
    <div className="work-space-container">
      <div
        className="alert alert-primary text-center font-weight-bold text-dark p-1"
        role="alert"
      >
        <span className="mb-0 h6">Permit Master List</span>
      </div>

      <form>
        <div className="form-row">
          <div className="form-group col-md-2">
            <label htmlFor="inputField1">Consignor</label>
            {consigner ?
              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
                name='consigner'
                id='consigner'
                {...register("consigner")}
                defaultValue={''}
              >
                <option value=''>Select All</option>

                {
                  consigner.map((item, idx) => {
                    return <option key={idx} value={item.id}>{item.name}</option>
                  })
                }

              </select> :
              <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                <option value=""></option>
              </select>
            }
          </div>

          <div className="form-group col-md-2">
            <label htmlFor="">Consignee</label>
            {consignee ?
              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
                name='consignee'
                id='consignee'
                {...register("consignee")}
                defaultValue={''}
              >
                <option value=''>Select All</option>

                {
                  consignee.map((item, idx) => {
                    return <option key={idx} value={item.id}>{item.name}</option>
                  })
                }

              </select> :
              <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                <option value=""></option>
              </select>
            }
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="">Billing Party</label>
            {allTraderNames ?
              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
                name='trader'
                id='trader'
                {...register("trader")}
                defaultValue={''}
              >
                <option value=''>Select All</option>

                {
                  allTraderNames.map((item, idx) => {
                    return <option key={idx} value={item.id}>{item.name}</option>
                  })
                }

              </select> :
              <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                <option value=""></option>
              </select>
            }
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="">Billing Type</label>
            <select
              className="form-select form-select-sm border-dark-subtle"
              aria-label="Default select example"
              id="billingType"
              name="billingType"
              {...register("billingType")}
              defaultValue={''}
            >
              <option value=''>Select Both</option>
              <option value="L">Railway Siding</option>
              <option value="R">By Road Work</option>

            </select>
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="">Loading Point</label>
            {loadingPoint ?
              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
                name='loading'
                id='loading'
                {...register("loading")}
                defaultValue={''}
              >
                <option value=''>Select All</option>

                {
                  loadingPoint.map((item, idx) => {
                    return <option key={idx} value={item.id}>{item.name}</option>
                  })
                }

              </select> :
              <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                <option value=""></option>
              </select>
            }
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="">Unloading Point</label>
            {unloadingPoint ?
              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
                name='unLoading'
                id='unLoading'
                {...register("unLoading")}
                defaultValue={''}
              >
                <option value=''>Select All</option>

                {
                  unloadingPoint.map((item, idx) => {
                    return <option key={idx} value={item.id}>{item.name}</option>
                  })
                }

              </select> :
              <select className="form-select form-select-sm border-dark-subtle" aria-label="Default select example">
                <option value=""></option>
              </select>
            }
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-2">
            <label htmlFor="inputField6">Display Order</label>
            <select
              className="form-select form-select-sm border-dark-subtle"
              aria-label="Default select example"
            >
              <option value="">On Permit Number</option>
              {/* <option value="">Challan Holder</option>
              <option value="">Received Date</option>
              <option value="">Payble Amount</option>
              <option value="">Collection Center</option>
              <option value="">Entry Date</option> */}
            </select>
          </div>
          <div className="form-group col-md-4">
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
              <div className="mx-2">To</div>
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

          <div className="form-group col-md-4 p-2">
            <button type="button" className="btn btn-sm btn-primary  mt-4 ml-4">
              GET
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary  mt-4 ml-4"
            >
              Clear
            </button>
            <button type="button" className="btn btn-sm btn-primary  mt-4 ml-4">
              Excel
            </button>
          </div>
        </div>
      </form>
      <hr />
      <div>
        <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
          <AgGridReact rowData={rowData} columnDefs={columnDefs} pagination={true} />
        </div>

      </div>
    </div>
  );
}

export default PermitMasterList;
