import React, { useState, useEffect } from 'react';
import ModalFieldMaster from './modals/ModalFieldMaster';
import ModalFleetMaster from './modals/ModalFleetMaster';
import { Tab, Tabs } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../config/AxiosConfig';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function FieldStaffFleetAgent() {
  const accessDetails = useSelector((state) => state.access.accessDetails);
  const navigate = useNavigate();

  const [fleetData, setFleetData] = useState();
  const [fieldData, setFieldData] = useState();
  const [fleetDataName, setFleetDataName] = useState("");
  const [fleetDataDate, setFleetDataDate] = useState("");
  const [fleetDataAmount, setFleetDataAmount] = useState("");
  const [fleetOptionValue, setFleetOptionValue] = useState("Dr");
  const [startSpneer, setStartSpneer] = useState(false);
  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  //for field
  const [fieldDataName, setFieldDataName] = useState("");
  const [fieldDataDate, setFieldDataDate] = useState("");
  const [fieldDataAmount, setFieldDataAmount] = useState("");
  const [fieldOptionValue, setFieldOptionValue] = useState("Dr");
  const [fieldNameIsEmpty, setFieldNameIsEmpty] = useState(false);
  const [fieldDataisSaved, setFieldDataIsSaved] = useState(false);
  const [startFieldSaveSpneer, setStartFieldSaveSpneer] = useState(false);
  const [updateFieldData, setUpdateFieldData] = useState(false);
  const [displayFieldModal, setDisplayFieldModal] = useState(false);


  const [postError, setPostError] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);
  const [snameIsEmpty, setSnameIsEmpty] = useState(false);
  const [updateFleetData, setUpdateFleetData] = useState(false); // used in useEffect as a dependency to update the table.

  const [editData, setEditData] = useState(null);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [fleetDataLoading, setFleetDataLoading] = useState(false);


  const handleDateChange = (date) => {
    setFleetDataDate(date);
    // format(date, 'dd-MMM-yyyy')
  };

  const handleFieldDateChange = (date) => {
    setFieldDataDate(date);
    // format(date, 'dd-MMM-yyyy')
  };


  useEffect(() => {
    if (accessDetails) {
      if (accessDetails.role !== 'ADMIN') {
        if (accessDetails.role === 'USER') {
          if (accessDetails.setupApplicationAccess !== "Y") {
            Swal.fire("Error", "You don't have access to this section.", "error");
            navigate('/work-space');
          }

        } else {
          Swal.fire("Error", "You don't have access to this section.", "error");
          navigate('/work-space');
        }
      }

    } else {
      Swal.fire("Error", "You don't have access to this section.", "error");
      navigate('/work-space');
    }

  }, []);




  async function getFleetData() {
    setFleetDataLoading(true);
    await axiosInstance.get('/api/v1/get/all/fleet-agent-broker-master')
      .then(function (response) {
        // handle success
        setFleetDataLoading(false);
        const filteredData = response.data.filter(obj => obj.id !== 152); // need to hide the perticular element
        setFleetData(filteredData);
        setUpdateFleetData(false);
      })
      .catch(function (error) {
        // handle error
        setFleetDataLoading(false);
        console.log(error);
      });
  }

  async function getFieldData() {
    await axiosInstance.get('/api/v1/get/all/field-staff-master')
      .then(function (response) {
        // handle success
        const filteredData = response.data.filter(obj => obj.id !== 52);
        setFieldData(filteredData);
        setUpdateFieldData(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }
  // Saving the fleet data
  async function postFleetData(fleetData) {
    await axiosInstance.post('/api/v1/add/one/fleet-agent-broker-master',
      fleetData
    )
      .then(function (response) {
        // handle success
        console.log(response.data);
        if (response.data === "success" && response.status === 201) {
          setUpdateFleetData(true);
          setStartSpneer(false);
          setIsSaved(true);
          toast.success('Successfully Saved!', {
            position: "bottom-center",
            style: {
              background: "green",
              color: "#fff",
            }
          });

        } else {
          setPostError(true);
          toast.error("Some Error Occured!");
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);
        if (error.response.data === "duplicate" && error.response.status === 409) {
          setIsDuplicate(true);
          setStartSpneer(false);
          toast.error("Duplicate Entry!");
        } else {
          setStartSpneer(false);
          toast.error("Some Error Occured!");
        }

      });
  }

  // Saving the field data
  async function postFieldData(fieldData) {
    await axiosInstance.post('/api/v1/add/one/field-staff-master',
      fieldData
    )
      .then(function (response) {
        // handle success
        console.log(response.data);
        if (response.data === "success" && response.status === 201) {
          setUpdateFieldData(true);
          setStartFieldSaveSpneer(false);
          setFieldDataIsSaved(true);
          toast.success('Successfully Saved!', {
            position: "bottom-center",
            style: {
              background: "green",
              color: "#fff",
            }
          });

        } else {
          toast.error("Some Error Occured!");
          setPostError(true);
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);
        if (error.response.data === "duplicate" && error.response.status === 409) {
          setIsDuplicate(true);
          setStartFieldSaveSpneer(false);
          toast.error("Duplicate Entry!");
        } else {
          setStartFieldSaveSpneer(false);
          toast.error("Some Error Occured!");
        }

      });
  }


  useEffect(() => {
    getFleetData();
    getFieldData();
  }, []);

  useEffect(() => {
    getFleetData(); // fleet data

  }, [updateFleetData]);

  useEffect(() => {
    getFieldData(); // field data

  }, [updateFieldData]);

  useEffect(() => {
    let timer;
    if (nameIsEmpty) {
      timer = setTimeout(() => {
        setNameIsEmpty(false);
      }, 3000);
    }
    if (snameIsEmpty) {
      timer = setTimeout(() => {
        setSnameIsEmpty(false);
      }, 3000);
    }
    if (isDuplicate) {
      timer = setTimeout(() => {
        setIsDuplicate(false);
      }, 4000);
    }

    if (isSaved) {
      timer = setTimeout(() => {
        setFleetDataName("");
        setFleetDataAmount("");
        setFleetDataDate("");
        document.getElementById("form1").reset();
        setIsSaved(false);
      }, 3000);
    }
    if (fieldNameIsEmpty) {
      timer = setTimeout(() => {
        setFieldNameIsEmpty(false);
      }, 3000);
    }
    if (fieldDataisSaved) {
      timer = setTimeout(() => {
        setFieldDataName("");
        setFieldDataAmount("");
        setFieldDataDate("");
        setFieldOptionValue("");
        document.getElementById("form2").reset();
        setFieldDataIsSaved(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };

  }, [nameIsEmpty, snameIsEmpty, isDuplicate, isSaved, fieldDataisSaved, fieldNameIsEmpty]);

  function handleSave(e) {
    e.preventDefault();
    console.log(fleetDataName, fleetDataAmount, fleetDataDate, fleetOptionValue);
    setStartSpneer(true);
    if (!fleetDataName) {
      setNameIsEmpty(true);
      setStartSpneer(false);
      return
    }

    const fleetData = {
      "name": fleetDataName,
      "joiningDate": fleetDataDate,
      "openingBalance": fleetDataAmount,
      "balanceType": fleetOptionValue,
      "createdBy": ""
    }
    postFleetData(fleetData);
  }

  // handle field data save
  function handleFieldDataSave(e) {
    e.preventDefault();
    console.log(fieldDataName, fieldDataAmount, fieldDataDate, fieldOptionValue);
    setStartFieldSaveSpneer(true);
    if (!fieldDataName) {
      setFieldNameIsEmpty(true);
      setStartFieldSaveSpneer(false);
      return
    }

    const fieldData = {
      "name": fieldDataName,
      "joiningDate": fieldDataDate,
      "openingBalance": fieldDataAmount,
      "balanceType": fieldOptionValue,
      "createdBy": ""
    }
    postFieldData(fieldData);
  }

  // handle delete

  async function deleteOneById(url, type) {

    await axiosInstance.get(url)
      .then(function (response) {
        // handle success
        if (response.data === "success") {
          if (type === 'f') {
            setUpdateFleetData(true);
          } else {
            setUpdateFieldData(true);
          }

          Swal.fire({
            title: "Successfully Deleted!",
            icon: "success"
          });
        }
      })
      .catch(function (error) {
        // handle error
        Swal.fire({
          title: "Some Error Occured!!",
          icon: "error"
        });
      });

  }

  async function handleFleetDelete(id) {
    Swal.fire({
      title: "Are you sure to Delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOneById(`/api/v1/delete/fleet-agent-broker-master/${id}`, 'f');
      }
    });

  }

  async function handleFieldDelete(id) {
    Swal.fire({
      title: "Are you sure to Delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOneById(`/api/v1/delete/field-staff-master/${id}`, 'a');
      }
    });

  }

  function handleFleetEdit(id, name, joiningDate, openingBalance, balanceType) {
    setDisplayModal(true);
    setEditData({ id, name, joiningDate, openingBalance, balanceType });
  }

  function handleFieldEdit(id, name, joiningDate, openingBalance, balanceType) {
    setDisplayFieldModal(true);
    setEditData({ id, name, joiningDate, openingBalance, balanceType });
  }





  return (
    <>
      <div className="work-space-container">
        <Tabs
          defaultActiveKey="broker-master"
          id="fieldStaffAndFieldAgent"
          className="mb-3"
          fill
        >
          <Tab eventKey="broker-master" title="Fleet Agent/Broker Master">

            <div className="container">
              <div
                className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                role="alert"
              >
                {/* name of the table */}
                <span className="mb-0 h6">Fleet Agent/Broker Master</span>
              </div>

              <div className="row">
                {/*   <!-- Area Chart --> */}
                <div className="mx-auto">
                  <div className="mb-4">
                    {/*  <!-- Card Body --> */}
                    <div className="card-body font-weight-normal textColor">
                      <form className="justify-content-around" id="form1">
                        <div className="row">
                          <div className="form-group m-1 col-sm">
                            <div className="input-group input-group-sm m-1">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="inputGroup-sizing-sm"
                                >
                                  Name
                                </span>
                              </div>
                              <input
                                type="text"
                                className="form-control form-control-sm w-75"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm m-4"
                                onChange={(e) => { setFleetDataName(e.target.value) }}
                              />
                            </div>
                            {nameIsEmpty && <div className="text-sm text-danger font-weight-normal">Name should not be Empty!!</div>}
                          </div>

                          <div className="form-group m-1 col-sm">
                            <div className="input-group input-group-sm m-1">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="inputGroup-sizing-sm"
                                >
                                  As on Date
                                </span>
                              </div>
                              <DatePicker
                                className="date-picker-input pl-2 ml-1 w-100"
                                selected={fleetDataDate}
                                onChange={handleDateChange}
                                dateFormat="d-MMM-yyyy"
                                placeholderText="Select a date"
                                name='fleetDate'
                                id='fleetDate'
                              />
                            </div>
                            {/* {snameIsEmpty && <div className="text-sm text-danger font-weight-normal">Short Name should not be Empty!!</div>} */}
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group m-1 col-sm">
                            <div className="input-group input-group-sm m-1">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="inputGroup-sizing-sm"
                                >
                                  Opening as on date
                                </span>
                              </div>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={(e) => { setFleetDataAmount(e.target.value) }}
                              />
                            </div>
                          </div>

                          <div className="form-group m-1 col-sm">
                            <div className="input-group input-group-sm m-1">
                              <select
                                class="form-select"
                                id="floatingSelect"
                                aria-label="Floating label select example"
                                onChange={(e) => { setFleetOptionValue(e.target.value) }}
                              >
                                <option defaultValue value="Dr">Dr</option>
                                <option value="Cr">Cr</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div
                          id="buttons"
                          className="btn-div mx-auto justify-content-around"
                        >
                          <button
                            type="submit"
                            form="form1"
                            disabled={startSpneer}
                            className="btn btn-sm btn-primary m-2"
                            onClick={(e) => { handleSave(e) }}
                          >
                            {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                            </div>}
                            Save
                          </button>
                          <button
                            type="reset"
                            className="btn btn-outline-primary btn-sm"
                          >
                            Clear
                          </button>
                        </div>
                      </form>
                    </div>
                    <Toaster
                      position="bottom-center"
                      reverseOrder={true}
                    />
                  </div>
                </div>

                {/*  <!-- Pie Chart --> */}
                <div className="overflow-auto">
                  <div className="mb-4">

                    <div className="card-body table-card">
                      <table className="table table-striped table-bordered table-hover align-middle">
                        <thead className="thead-dark">
                          <tr className="text-center">
                            <th scope="col">SL No.</th>
                            <th scope="col">Agent/Broker Name</th>
                            <th scope="col">Opening Date</th>
                            <th scope="col">Opening Amount</th>
                            <th scope="col">Amount Type</th>
                            <th scope="col" colSpan="2">Actions</th>
                          </tr>
                        </thead>
                        {fleetData &&
                          <tbody className="font-weight-normal textColor">
                            {fleetData.map((data, idx) => (
                              <tr key={idx}>
                                <td className='text-center'>{idx + 1}</td>
                                <td className='p-2'>{data.name}</td>
                                <td className='p-2 text-center'>{data.joiningDate ? format(data.joiningDate, 'd-MMM-yyyy') : ""}</td>
                                <td className='p-2 text-center'>{data.openingBalance}</td>
                                <td className='p-2 text-center'>{data.balanceType}</td>
                                <td className='text-center p-2' data-toggle="modal" data-target="#editModal" onClick={() => { handleFleetEdit(data.id, data.name, data.joiningDate, data.openingBalance, data.balanceType) }}><i className="bi bi-pencil-square text-primary bg-white p-1 rounded custom-cursor-hand"></i></td>
                                <td className='text-center p-2'><i className="bi bi-trash text-danger bg-white p-1 rounded custom-cursor-hand" onClick={() => { handleFleetDelete(data.id) }}></i></td>
                              </tr>
                            ))}
                          </tbody>
                        }
                        {fleetDataLoading && <div className="spinner-border mx-auto text-primary text-center m-5" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="field-staff-master" title="Field Staff Master">
            {/* ------------------------------------------------------ */}
            <div className="container">

              <div
                className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                role="alert"
              >
                {/* name of the table */}
                <span className="mb-0 h6">Field Staff Master</span>
              </div>

              <div className="row">
                {/*   <!-- Area Chart --> */}
                <div className="mx-auto">
                  <div className="mb-4">
                    {/*  <!-- Card Body --> */}
                    <div className="card-body font-weight-normal textColor">
                      <form className="justify-content-around" id="form2">
                        <div className="row">
                          <div className="form-group m-1 col-sm">
                            <div className="input-group input-group-sm m-1">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="inputGroup-sizing-sm"
                                >
                                  Name
                                </span>
                              </div>
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm m-4"
                                onChange={(e) => { setFieldDataName(e.target.value) }}
                              />
                            </div>
                            {fieldNameIsEmpty && <div className="text-sm text-danger font-weight-normal">Name should not be Empty!!</div>}
                          </div>

                          <div className="form-group m-1 col-sm">
                            <div className="input-group input-group-sm m-1">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="inputGroup-sizing-sm"
                                >
                                  As on Date
                                </span>
                              </div>
                              {/* <input
                                type="date"
                                className="form-control"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={(e) => { setFieldDataDate(e.target.value) }}
                              /> */}
                              <DatePicker
                                className="date-picker-input pl-2 ml-1 w-100"
                                selected={fieldDataDate}
                                onChange={handleFieldDateChange}
                                dateFormat="d-MMM-yyyy"
                                placeholderText="Select a date"
                                name='fieldDate'
                                id='fieldDate'
                              />
                            </div>
                            {/* {snameIsEmpty && <div className="text-sm text-danger font-weight-normal">Short Name should not be Empty!!</div>} */}
                          </div>
                        </div>
                        <div className="row">
                          <div className="form-group m-1 col-sm">
                            <div className="input-group input-group-sm m-1">
                              <div className="input-group-prepend">
                                <span
                                  className="input-group-text"
                                  id="inputGroup-sizing-sm"
                                >
                                  Opening as on date
                                </span>
                              </div>
                              <input
                                type="text"
                                className="form-control"
                                aria-label="Small"
                                aria-describedby="inputGroup-sizing-sm"
                                onChange={(e) => { setFieldDataAmount(e.target.value) }}
                              />
                            </div>
                          </div>

                          <div className="form-group m-1 col-sm">
                            <div className="input-group input-group-sm m-1">
                              <select
                                class="form-select"
                                id="floatingSelect"
                                aria-label="Floating label select example"
                                onChange={(e) => { setFieldOptionValue(e.target.value) }}
                              >
                                <option defaultValue value="dr">Dr</option>
                                <option value="cr">Cr</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div
                          id="buttons"
                          className="btn-div mx-auto justify-content-around"
                        >
                          <button
                            type="submit"
                            form="form1"
                            className="btn btn-sm btn-primary m-1"
                            onClick={(e) => { handleFieldDataSave(e) }}
                          >
                            {startFieldSaveSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                            </div>}
                            Save
                          </button>
                          <button
                            type="reset"
                            className="btn btn-outline-primary btn-sm m-1"
                          >
                            Clear
                          </button>
                        </div>
                      </form>

                      {/* {
                                postError && <div className="alert alert-danger alert-dismissible fade show m-2" role="alert">
                                    Some Error Occurred !!
                                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                            }
                            {
                                isDuplicate && <div className="alert alert-warning fade show m-2" role="alert">
                                    Short Name already exist.
                                </div>
                            }*/}
                      {/* {
                        fieldDataisSaved && <div className="alert alert-success fade show m-2" role="alert">
                          Successfully Saved.
                        </div>
                      } */}
                    </div>
                  </div>
                </div>

                {/*  <!-- Pie Chart --> */}
                <div className="overflow-auto">
                  <div className="mb-4">
                    {/*  <!-- Card Header - Dropdown --> */}
                    {/* <div className="card-header py-2 d-flex flex-row align-items-center justify-content-around">
                    <h6 className="m-0 font-weight-bold text-primary text-center">
                      List of Existing Mines/ Consignor
                    </h6>
                  </div> */}
                    {/*  <!-- Card Body --> */}

                    <div className="card-body table-card">
                      <table className="table table-striped table-sm table-bordered table-hover align-middle">
                        <thead className="thead-dark">
                          <tr className="text-center">
                            <th scope="col">SL No.</th>
                            <th scope="col">Field Staff Name</th>
                            <th scope="col">Opening Date</th>
                            <th scope="col">Opening Amount</th>
                            <th scope="col">Amount Type</th>
                            <th scope='col' colSpan="2">Actions</th>
                          </tr>
                        </thead>
                        {fieldData ?
                          <tbody className="font-weight-normal textColor">
                            {fieldData.map((data, idx) => (
                              <tr key={idx}>
                                <td className='p-2 text-center'>{idx + 1}</td>
                                <td className='p-2'>{data.name}</td>
                                <td className='p-2 text-center'>{data.joiningDate ? format(data.joiningDate, 'd-MMM-yyyy') : ""}</td>
                                <td className='p-2 text-center'>{data.openingBalance}</td>
                                <td className='p-2 text-center'>{data.balanceType}</td>
                                <td className='p-2 text-white text-center' data-toggle="modal" data-target="#editModal" onClick={() => { handleFieldEdit(data.id, data.name, data.joiningDate, data.openingBalance, data.balanceType) }}><i className="bi bi-pencil-square text-primary bg-white p-1 rounded custom-cursor-hand"></i></td>
                                <td className='p-2 text-white text-center'><i className="bi bi-trash text-danger bg-white p-1 rounded custom-cursor-hand" onClick={() => { handleFieldDelete(data.id) }}></i></td>
                              </tr>
                            ))}
                          </tbody> : <div className="spinner-border text-info m-5" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        }
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
      {displayModal && <ModalFleetMaster eData={editData} closeModal={() => {
        setDisplayModal(false);
      }} updated={() => { setUpdateFleetData(true) }} />}

      {displayFieldModal && <ModalFieldMaster eData={editData} closeModal={() => {
        setDisplayFieldModal(false);
      }} updated={() => { setUpdateFieldData(true) }} />}

    </>
  );
}

export default FieldStaffFleetAgent;
