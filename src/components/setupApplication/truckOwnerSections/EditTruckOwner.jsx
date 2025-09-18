import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../../../services/BaseURI';
import axios from 'axios';
import axiosInstance from '../../../config/AxiosConfig';

function EditTruckOwner() {
  const [ownerData, setOwnerData] = useState();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [pan, setPan] = useState("");
  const [adhar, setAdhar] = useState("");
  const [isAdharLinkedWithPan, setIsAdharLinkedWithPan] = useState("");
  const [address, setAddress] = useState("");
  const [bankAcNo, setBankAcNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [branch, setBranch] = useState("");
  const [remark, setRemark] = useState("");
  const [ownerType, setOwnerType] = useState("actual");
  const [tdsStatus, setTdsStatus] = useState("yes");
  const [submissionDate, setSubmissionDate] = useState("");
  const [docRefNo, setDocRefNo] = useState("");

  const [fieldIsDisabled, setFieldIsDisabled] = useState(true);
  const [isNameEmpty, setIsNameEmpty] = useState(false);
  const [isPanInValid, setIsPanInValid] = useState(false);
  const [isAdharInValid, setIsAdharInValid] = useState(false);

  const [isSaved, setIsSaved] = useState(false);
  const [startSpneer, setStartSpneer] = useState(false);
  const [postError, setPostError] = useState(false);

  function isValidPanCardNo(panCardNo) {
    const pattern = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
    return pattern.test(panCardNo);
  }

  function isValidAadharNo(aadharNumber) {
    const pattern = /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/;
    return pattern.test(aadharNumber);
  }

  // Saving the data
  async function postData(fdata) {

    await axiosInstance.post('/api/v1/update/one/truck-owner-details',
      fdata
    )
      .then(function (response) {
        // handle success
        console.log(response.data);
        if (response.data === "success" && response.status === 201) {
          setIsSaved(true);
          setStartSpneer(false);

        } else {
          setPostError(true);
          setStartSpneer(false)
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error.response);
        if (error.response.data === "duplicate" && error.response.status === 409) {
          // setIsDuplicate(true);
          setStartSpneer(false);
        } else {
          setPostError(true);
          setStartSpneer(false);
        }

      });
  }

  useEffect(() => {
    if (tdsStatus === "no") {
      setFieldIsDisabled(false);
    }
    if (tdsStatus === "yes") {
      setFieldIsDisabled(true);
    }

  }, [tdsStatus]);

  useEffect(() => {

    let timer;
    if (isNameEmpty) {
      timer = setTimeout(() => {
        setIsNameEmpty(false);
      }, 3000);
    }
    if (isPanInValid) {
      timer = setTimeout(() => {
        setIsPanInValid(false);
      }, 3000);
    }
    if (isAdharInValid) {
      timer = setTimeout(() => {
        setIsAdharInValid(false);
      }, 3000);
    }

    if (isSaved) {
      timer = setTimeout(() => {
        setName("");
        setContact("");
        setPan("");
        setAdhar("")
        setIsAdharLinkedWithPan("");
        setAddress("");
        setBankAcNo("");
        setBankName("");
        setIfscCode("");
        setBranch("");
        setRemark("");
        setOwnerType("");
        setTdsStatus("");
        setSubmissionDate("");
        setDocRefNo("");
        document.getElementById("form").reset();
        setIsSaved(false);
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };

  }, [isNameEmpty, isPanInValid, isAdharInValid, isSaved]);



  function handleSubmit(e) {
    e.preventDefault();
    setStartSpneer(true);

    if (!name) {
      setIsNameEmpty(true);
      setStartSpneer(false)
      return;
    }
    if (pan) {
      if (!isValidPanCardNo(pan)) {
        setIsPanInValid(true);
        setStartSpneer(false)
        return;
      }
    }
    if (adhar) {
      if (!isValidAadharNo(adhar)) {
        setIsAdharInValid(true);
        setStartSpneer(false)
        return;
      }
    }

    const submitData = {
      "name": name,
      "contactNumber": contact,
      "panNumber": pan,
      "adharNumber": adhar,
      "panAdharLinkStatus": isAdharLinkedWithPan,
      "address": address,
      "tdsStatus": tdsStatus,
      "tdsSubmissionDate": submissionDate,
      "docRefNo": docRefNo,
      "bankAcNo": bankAcNo,
      "bankName": bankName,
      "ifscCode": ifscCode,
      "branchName": branch,
      "remark": remark,
      "ownerType": ownerType
    }

    postData(submitData);
    // console.log(submitData);
  }

  async function findDataByName(data) {

    await axiosInstance.post('/api/v1/get/one/truck-owner-details', data)
      .then(function (response) {
        // handle success
        setOwnerData(response.data);
        // setUpdateData(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }

  function handleFind(e) {
    e.preventDefault();
    if (!name) {
      setIsNameEmpty(true);
      return
    }
    console.log(name);
    const data = {
      "name": name,
      "contactNumber": contact,
      "panNumber": pan,
      "adharNumber": adhar,
      "panAdharLinkStatus": isAdharLinkedWithPan,
      "address": address,
      "tdsStatus": tdsStatus,
      "tdsSubmissionDate": submissionDate,
      "docRefNo": docRefNo,
      "bankAcNo": bankAcNo,
      "bankName": bankName,
      "ifscCode": ifscCode,
      "branchName": branch,
      "remark": remark,
      "ownerType": ownerType
    }
    findDataByName(data);
  }


  return (
    <div className='card overflow-auto'>
      <div className='card-body'>
        <form id="form">

          <div className="form-row">
            <div className="form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Name</span>
              </div>
              <input
                type="text"
                className="form-control"
                id="inputEmail4"
                aria-describedby="inputGroup-sizing-sm"
                value={ownerData ? ownerData.name : name}
                onChange={(e) => { setName(e.target.value) }}
              />
              {isNameEmpty && <p className='text-danger'>Name Should Not be Empty</p>}
            </div>
            <div className="form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Contact</span>
              </div>
              <input
                type="number"
                className="form-control"
                id="inputPassword4"
                value={ownerData ? ownerData.contactNumber : contact}
                onChange={(e) => { setContact(e.target.value) }}
              />
            </div>
            <div className="form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">PAN</span>
              </div>
              <input
                type="text"
                className="form-control"
                id="inputPassword4"
                value={ownerData ? ownerData.panNumber : pan}
                onChange={(e) => { setPan(e.target.value) }}
              />
              {isPanInValid && <p className='text-danger'>Please Enter Valid PAN Number</p>}
            </div>
            <div className="form-group col-md-3">
              <button className="btn btn-sm btn-primary" onClick={(e) => { handleFind(e) }}>
                {/* {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                </div>} */}
                <span>Find</span>
              </button>
            </div>
          </div>
          {/* second row */}
          <div className="form-row">
            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Aadhar</span>
              </div>
              <input
                type="text"
                className="form-control"
                id="inputEmail4"
                value={ownerData ? ownerData.adharNumber : adhar}
                onChange={(e) => { setAdhar(e.target.value) }}
              />
              {isAdharInValid && <p className='text-danger'>Please Enter Valid Aadhar Number</p>}
            </div>
            <div className="form-group col-md-3 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Adhar Linked with PAN</span>
              </div>

              <select
                class="form-select"
                id="floatingSelect"
                aria-label="Floating label select example"
                value={ownerData ? ownerData.panAdharLinkStatus : isAdharLinkedWithPan}
                onChange={(e) => { setIsAdharLinkedWithPan(e.target.value) }}

              >
                <option value="no">No</option>
                <option value="yes">Yes</option>

              </select>
            </div>
            <div className="form-group col-md-5 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">Address</span>
              </div>

              <input
                type="text"
                className="form-control"
                id="inputPassword4"
                value={ownerData ? ownerData.address : address}
                onChange={(e) => { setAddress(e.target.value) }}
              />
            </div>
          </div>
          {/* third row */}
          <div className="form-row">
            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">Bank A/C Number</span>
              </div>
              <input
                type="text"
                className="form-control"
                id="inputEmail4"
                value={ownerData ? ownerData.bankAcNo : bankAcNo}
                onChange={(e) => { setBankAcNo(e.target.value) }}
              />
            </div>
            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">Bank Name</span>
              </div>

              <input
                type="text"
                className="form-control"
                id="inputEmail4"
                value={ownerData ? ownerData.bankName : bankName}
                onChange={(e) => { setBankName(e.target.value) }}
              />
            </div>
            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">IFSC Code</span>
              </div>

              <input
                type="text"
                className="form-control"
                id="inputPassword4"
                value={ownerData ? ownerData.ifscCode : ifscCode}
                onChange={(e) => { setIfscCode(e.target.value) }}
              />
            </div>
          </div>
          {/* fourth row */}
          <div className="form-row">
            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">Branch Name</span>
              </div>

              <input
                type="text"
                className="form-control"
                id="inputEmail4"
                value={ownerData ? ownerData.branchName : branch}
                onChange={(e) => { setBranch(e.target.value) }}
              />
            </div>
            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">Owner Type</span>
              </div>

              <select
                className="form-select"
                id="floatingSelect"
                aria-label="Floating label select example"
                value={ownerData ? ownerData.ownerType : ownerType}
                onChange={(e) => { setOwnerType(e.target.value) }}
              >
                <option value="actual">Actual</option>
                <option value="lease">Lease</option>

              </select>
            </div>
            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">Remark</span>
              </div>
              <input
                type="text"
                className="form-control"
                id="inputEmail4"
                value={ownerData ? ownerData.remark : remark}
                onChange={(e) => { setRemark(e.target.value) }}
              />
            </div>


          </div>
          {/* fifth row */}
          <div className="form-row">
            {/* <div className="form-group col-md-4">
              <div className='row'>
                <div class="input-group-prepend col">
                  <span class="input-group-text" id="inputPassword4">TDS Declaration Submitted</span>
                </div>


                <div className="form-check form-check-inline col">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="radio1"
                    value="yes"
                    checked={ownerData ? ownerData.tdsStatus === "yes" ? true : false : true}
                    onClick={(e) => { setTdsStatus(e.target.value) }}
                  />
                  <label className="form-check-label" for="radio1">yes</label>
                </div>
                <div className="col form-check form-check-inline pt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="inlineRadioOptions"
                    id="radio2"
                    value="no"
                    checked={ownerData ? ownerData.tdsStatus === "no" ? true : false : false}
                    onClick={(e) => { setTdsStatus(e.target.value) }}
                  />
                  <label className="form-check-label" for="radio2">No</label>
                </div>

              </div>
            </div> */}

            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">Submission Date</span>
              </div>

              <input
                type="date"
                className="form-control"
                id="inputEmail4"
                value={ownerData ? ownerData.tdsSubmissionDate : submissionDate}
                disabled={fieldIsDisabled}
                onChange={(e) => { setSubmissionDate(e.target.value) }}
              />
            </div>
            <div className="form-group col-md-4 form-group col-md-3 input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputPassword4">Doc Ref No.</span>
              </div>

              <input
                type="text"
                className="form-control"
                id="inputPassword4"
                placeholder="Enter Doc Ref No"
                value={ownerData ? ownerData.docRefNo : docRefNo}
                disabled={fieldIsDisabled}
                onChange={(e) => { setDocRefNo(e.target.value) }}
              />
            </div>

          </div>

          <button type="submit" className="btn btn-primary m-2" onClick={(e) => { handleSubmit(e) }}>
            {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

            </div>}
            <span>Save</span>
          </button>
          <button type="submit" className="btn btn-outline-primary">
            Clear
          </button>
          {
            postError && <div className="alert alert-danger alert-dismissible fade show m-2" role="alert">
              Some Error Occurred !!
              <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          }
          {/* {
                        isDuplicate && <div className="alert alert-warning fade show m-2" role="alert">
                            Short Name already exist.
                        </div>
                    } */}
          {
            isSaved && <div className="alert alert-success fade show m-2" role="alert">
              Successfully Saved.
            </div>
          }
        </form>
      </div>
    </div>
  )
}

export default EditTruckOwner;
