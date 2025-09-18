import React,{useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function LoadingReportPermitDate() {
  const [permitFromDate, setPermitFromDate] = useState(null);
  const handleFromDateChange = (date) => {
    setPermitFromDate(date);
  };
  const [permitToDate, setPermitToDate] = useState(null);
  const handleToDateChange = (date) => {
    setPermitToDate(date);
  };
  return (
    <>
      <div className="work-space-container">
        <div
          className="alert alert-primary text-center font-weight-bold text-dark p-1"
          role="alert"
        >
          <span className="mb-0 h6">Date vs Permit Summary Report</span>
        </div>

        <form>
          <div className="form-row">
            <div className="form-group col-md-3">
              <label htmlFor="inputField1">Loading Point</label>
              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All Loading Point</option>
              </select>
            </div>
            <div className="form-group col-md-3">
              <label htmlFor="inputField1">Unloading Point</label>
              <select
                className="form-select form-select-sm border-dark-subtle"
                aria-label="Default select example"
              >
                <option value="">Select All unloading Point</option>
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
          <div className="form-group col-md-2">
            <label htmlFor="inputField6">Order By</label>
            <select
              className="form-select form-select-sm border-dark-subtle"
              aria-label="Default select example"
            >
              <option value="">Permit Number</option>

            </select>
          </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoadingReportPermitDate;
