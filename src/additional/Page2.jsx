import React from "react";

function Page2() {
  return (
    <>
      <div className="d-flex flex-row justify-content-center p-2">
        {/* <h3 className="text-center my-2 p-2">Mines/Consignor Owner Master</h3> */}
        <div className="col-sm-5 bg-light card shadow mb-4 mr-2">
          <form>
            <div className="form-group">
              <label htmlFor="consignorName">CONSIGNOR NAME</label>
              <input
                type="text"
                className="form-control"
                id="consignorName"
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="shortName">SHORT NAME</label>
              <input
                type="text"
                className="form-control"
                id="shortName"
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label htmlFor="communication">COMMUNICATION</label>
              <input
                type="text"
                className="form-control"
                id="communication"
                placeholder=""
              />
            </div>
            <div id="buttons" className="row justify-content-around m-1">

              <button type="button" className="btn btn-outline-secondary btn-sm col-2">
                SAVE
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm col-2">
                REMOVE
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm col-2">
                EDIT
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm col-2">
                CANCEL
              </button>
            </div>
          </form>
        </div>
        <div className="col-sm-5 p-2 bg-info text-light card shadow mb-4 mr-2">
          <h5>List of Existing Mines/ Consignor</h5>
          <table class="table table-striped align-item-center border text-light">
            <thead class="thead-dark">
              <tr>
                <th scope="col">SL No.</th>
                <th scope="col">Consigner Name</th>
                <th scope="col">Communication</th>
                <th scope="col">Short Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td scope="row">1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Page2;
