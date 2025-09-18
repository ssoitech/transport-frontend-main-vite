import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function OnershipTransfer() {
  const accessDetails = useSelector((state) => state.access.accessDetails);
  const navigate = useNavigate();

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

  
  return (
    <>
      <div className="work-space-container">
        <div className="container">
          <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
            <span className='mb-0 h6'>Truck Owner Details</span>
          </div>
          <div className="mx-auto">
            <div className="card mb-4">
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
                            Vehicle Numer
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                    </div>

                    <div className="form-group m-1 col-sm">
                      <div className="input-group input-group-sm m-1">
                        <button
                          type="submit"
                          form="form1"
                          className="btn btn-sm btn-primary border-primary"
                        >
                          Get
                        </button>

                        <button
                          type="reset"
                          className="btn btn-outline-primary btn-sm  border-primary"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    <div className="form-group m-1 col-sm">
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Effect From
                          </span>
                        </div>
                        <input
                          type="date"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                        <button
                          type="submit"
                          form="form1"
                          className="btn btn-sm btn-primary border-primary"
                        >
                          Get
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-6 ">
                      <h6>
                        Existing Owner Details <hr />
                      </h6>
                      {/* ----------------------------------- */}
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
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Contact
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            PAN
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Adress
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Bank A/c
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            IFSC
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Bank
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Branch
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div
                        id="buttons"
                        className="btn-div mx-auto justify-content-around"
                      >
                        <button
                          type="submit"
                          form="form1"
                          className="btn btn-sm btn-primary m-1 border-primary"
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                    <div className="col-6 ">
                      <h6>
                        New Owner Details <hr />
                      </h6>
                      {/* ----------------------------------- */}
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
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Contact
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            PAN
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Adress
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Bank A/c
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            IFSC
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Bank
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div className="input-group input-group-sm m-1">
                        <div className="input-group-prepend">
                          <span
                            className="input-group-text"
                            id="inputGroup-sizing-sm"
                          >
                            Branch
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          aria-label="Small"
                          aria-describedby="inputGroup-sizing-sm"
                        />
                      </div>
                      <div
                        id="buttons"
                        className="btn-div mx-auto justify-content-around"
                      >
                        <button
                          type="submit"
                          form="form1"
                          className="btn btn-sm btn-primary m-1 border-primary"
                        >
                          Confirm Revoke
                        </button>
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
                      className="btn btn-sm btn-primary m-1 border-primary"
                    >
                      Save
                    </button>

                    <button
                      type="reset"
                      className="btn btn-outline-primary btn-sm m-1 border-primary"
                    >
                      Clear
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* <div className="row">
            <div class="container-sm bg-info"></div>
            <form></form>
            <div className="col-6 bg-secondary">Existing Owner Details</div>
            <div className="col-6 bg-primary">New Owner Details</div>
          </div> */}

          <div className="overflow-auto my-4">
            <div className="mb-4">
              {/*  <!-- Card Header - Dropdown --> */}
              <div className="py-2 d-flex flex-row align-items-center justify-content-around">
                <h6 className="m-0 font-weight-bold text-primary text-center">
                  Existing Challan Details
                </h6>
              </div>
              {/*  <!-- Card Body --> */}
              {
                // ownerData ?
                <div className="table-responsive">
                  <table className="table table-striped table-bordered table-hover align-middle">
                    <thead className="thead-dark">
                      <tr className="text-center">
                        <th scope="col">SL No.</th>
                        <th scope="col">Consignee</th>
                        <th scope="col">Loading Point</th>
                        <th scope="col">Destination</th>
                        <th scope="col">TP Number</th>
                        <th scope="col">Loading Date</th>
                        <th scope="col">Quality</th>
                        <th scope="col">Challan</th>
                        <th scope="col">Recive</th>
                        <th scope="col">Owner Name</th>
                        <th scope="col">Owner PAN</th>
                        <th scope="col">Challan Holder Name</th>
                        <th scope="col">CH PAN</th>
                      </tr>
                    </thead>
                    <tbody className="font-weight-normal textColor">
                      <tr>
                        <td>{1}</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                        <td>{ }</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                //     : <div className="spinner-border text-primary m-5" role="status">
                //         <span className="sr-only">Loading...</span>
                //     </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OnershipTransfer;
