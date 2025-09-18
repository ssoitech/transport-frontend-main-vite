import React from "react";

export default function Page3() {
  return (
    <div>
      <div className="justify-content-center py-2 container col-sm-10">
        <h3 className="text-center my-2 p-2">EXPORTER / CONSIGNEE Master</h3>
        <div className="col-sm-12 bg-warning p-3">
          <form>
            <div className="form-group">
              <label htmlFor="exporterName">NAME</label>
              <input
                type="text"
                className="form-control"
                id="exporterName"
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="exporterShortName">SHORT NAME</label>
              <input
                type="text"
                className="form-control"
                id="exporterShortName"
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactNo">CONTACT NO</label>
              <input
                type="text"
                className="form-control"
                id="contactNo"
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="adress">ADDRESS</label>
              <input
                type="text"
                className="form-control"
                id="adress1"
                placeholder=""
              />
              <input
                type="text"
                className="form-control"
                id="adress2"
                placeholder=""
              />
              <input
                type="text"
                className="form-control"
                id="adress3"
                placeholder=""
              />
            </div>
            <div id="buttons" className="row justify-content-around m-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm col-2"
              >
                SAVE
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm col-2"
              >
                REMOVE
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm col-2"
              >
                EDIT
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm col-2"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
        <div className="col-sm-10 p-2 bg-info">
          <h5>List of Existing Mines/ Consignor</h5>
              
          <table class="table table-striped align-item-center border">
            <thead class="thead-dark">
              <tr>
                <th scope="col">SL No.</th>
                <th scope="col">Exporter/Consigner Name</th>
                <th scope="col">Contact No.</th>
                <th scope="col">Address1</th>
                <th scope="col">Address2</th>
                <th scope="col">Address3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td scope="row">1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                <td>@mdo</td>
                <td>@mdo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
