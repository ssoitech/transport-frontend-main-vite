import React from "react";
import { useApiQuery } from "../../hooks/api/useApiQuery";
import ReusableForm from "../reusable/ReusableForm";
import ReusableInput from "../reusable/ReusableInput";
import ReusableButton from "../reusable/ReusableButton";
import ReusableSelect from "../reusable/ReusableSelect";
import ReusableDatePicker from "../reusable/ReusableDatePicker";
import { BaseUrl } from "../../services/BaseURI";

function PaymentReferenceDetails() {
  // Fetch collection center names using React Query
  const { data: allCollectionCenterNames = [] } = useApiQuery({
    key: "collectionCenters",
    url: BaseUrl + "/api/v1/get/all/collection-center-names",
    select: (data) =>
      data.map((element) => ({ id: element[0], name: element[1] })),
  });

  // Prepare options for reusable select components
  const collectionCenterOptions = allCollectionCenterNames
    ? [
        { value: 0, label: "Select All" },
        ...allCollectionCenterNames.map((item) => ({
          value: item.id,
          label: item.name,
        })),
      ]
    : [{ value: 0, label: "Select All" }];

  const orderByOptions = [
    { value: "referenceNumber", label: "Reference Number" },
    { value: "challanHolder", label: "Challan Holder" },
    { value: "receivedDate", label: "Received Date" },
    { value: "paybleAmount", label: "Payble Amount" },
    { value: "collectionCenter", label: "Collection Center" },
    { value: "entryDate", label: "Entry Date" },
  ];

  return (
    <div className="work-space-container">
      <div
        className="alert alert-primary text-center font-weight-bold text-dark p-1"
        role="alert"
      >
        <span className="mb-0 h6">Reference Details</span>
      </div>
      <ReusableForm onSubmit={() => {}} className="mb-3">
        <div className="form-row">
          <div className="col-md-2">
            <ReusableInput
              label="Entered By"
              name="enteredBy"
              value={""}
              onChange={() => {}}
              className="form-control form-control-sm border-dark-subtle"
            />
          </div>
          <div className="col-md-3">
            <ReusableSelect
              label="Collection Center"
              name="collectionCenter"
              options={collectionCenterOptions}
              value={0}
              onChange={() => {}}
              className="form-select form-select-sm border-dark-subtle"
            />
          </div>
          <div className="col-md-2">
            <ReusableSelect
              label="Select On"
              name="selectOn"
              options={[{ value: "receivedDate", label: "Received Date" }]}
              value={"receivedDate"}
              onChange={() => {}}
              className="form-select form-select-sm border-dark-subtle"
            />
          </div>
          <div className="col-md-2">
            <ReusableDatePicker
              label="Date From"
              name="dateFrom"
              value={""}
              onChange={() => {}}
              className="date-picker-input w-100 pl-2"
            />
          </div>
          <div className="col-md-2">
            <ReusableDatePicker
              label="Date To"
              name="dateTo"
              value={""}
              onChange={() => {}}
              className="date-picker-input w-100 pl-2"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="col-md-3">
            <ReusableSelect
              label="Order By"
              name="orderBy"
              options={orderByOptions}
              value={"referenceNumber"}
              onChange={() => {}}
              className="form-select form-select-sm border-dark-subtle"
            />
          </div>
          <div className="col-md-3">
            <ReusableInput
              label="Challan Holder Name / PAN"
              name="challanHolderName"
              value={""}
              onChange={() => {}}
              className="form-control form-control-sm border-dark-subtle"
            />
          </div>
          <div className="col-md-4 p-2">
            <ReusableButton className="btn btn-sm btn-primary mt-4 ml-4">
              Proceed
            </ReusableButton>
            <ReusableButton className="btn btn-sm btn-outline-primary mt-4 ml-4">
              Clear
            </ReusableButton>
            <ReusableButton className="btn btn-sm btn-primary mt-4 ml-4">
              Excel
            </ReusableButton>
          </div>
        </div>
      </ReusableForm>
      <hr />
    </div>
  );
}

export default PaymentReferenceDetails;
