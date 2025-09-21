import React from "react";
import AutoComplete from "../searchComponent/AutoComplete";
import ReusableButton from "../reusable/ReusableButton";
import ReusableLoader from "../reusable/ReusableLoader";

/**
 * ChallanSearchBar: Handles Challan and TP number search UI and logic.
 * Uses reusable AutoComplete and Button components.
 * Props:
 * - isSearching, tpIsSearching, challanNumber, tpNumber
 * - setChallanNumber, setTpNumber, getDataByChallanNumber, getDataByTpNumber
 */
const ChallanSearchBar = ({
  isSearching,
  tpIsSearching,
  challanNumber,
  tpNumber,
  setChallanNumber,
  setTpNumber,
  getDataByChallanNumber,
  getDataByTpNumber,
}) => (
  <div className="grid-section1">
    <div className="item1">
      <label htmlFor="challanNumber" className="form-label">
        Challan Number
      </label>
      <div className="row">
        <div className="col-auto">
          <AutoComplete
            placeholder={"Search here"}
            url={"/api/v1/get/challan-number?keyword="}
            datakey={"name"}
            customLoading={<ReusableLoader />}
            onSelect={setChallanNumber}
            customStyles={{}}
          />
        </div>
        <div className="col-auto">
          <ReusableButton
            type="button"
            size="small"
            disabled={isSearching}
            onClick={getDataByChallanNumber}
          >
            Get
          </ReusableButton>
        </div>
      </div>
    </div>
    <div className="item1">
      <label htmlFor="tpNumber" className="form-label">
        TP Number
      </label>
      <div className="row">
        <div className="col-auto">
          <AutoComplete
            placeholder={"Search here"}
            url={"/api/v1/get/tp-number?keyword="}
            datakey={"name"}
            customLoading={<ReusableLoader />}
            onSelect={setTpNumber}
            customStyles={{}}
          />
        </div>
        <div className="col-auto">
          <ReusableButton
            type="button"
            size="small"
            onClick={getDataByTpNumber}
          >
            Get
          </ReusableButton>
        </div>
      </div>
    </div>
    <div className="item1">
      <label htmlFor="truckNumber" className="form-label">
        Truck Number
      </label>
      <div className="row">
        <div className="col-auto">
          {/* You can replace with ReusableInput if needed */}
          <input
            type="text"
            className="form-control form-control-sm custom-border"
            id="truckNumber"
            name="truckNumber"
          />
        </div>
        <div className="col-auto">
          <ReusableButton type="button" size="small">
            Search
          </ReusableButton>
        </div>
      </div>
    </div>
    {(isSearching || tpIsSearching) && <ReusableLoader />}
  </div>
);

export default ChallanSearchBar;
