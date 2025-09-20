import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../../../services/BaseURI';
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
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-12 col-xl-11'>
          <div className='card shadow-sm border-0'>
            <div className='card-body p-4'>
              <h5 className="card-title mb-4 text-primary fw-bold">Edit Truck Owner Details</h5>
              
              <form id="form">
                {/* Search Section */}
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <h6 className="text-secondary fw-semibold mb-3 border-bottom pb-2">Search Owner</h6>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Owner Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ownerData ? ownerData.name : name}
                      onChange={(e) => { setName(e.target.value) }}
                      placeholder="Enter owner name"
                    />
                    {isNameEmpty && <div className='text-danger small mt-1'>Name Should Not be Empty</div>}
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Contact Number</label>
                    <input
                      type="number"
                      className="form-control"
                      value={ownerData ? ownerData.contactNumber : contact}
                      onChange={(e) => { setContact(e.target.value) }}
                      placeholder="Enter contact number"
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">PAN Number</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control text-uppercase"
                        value={ownerData ? ownerData.panNumber : pan}
                        onChange={(e) => { setPan(e.target.value) }}
                        placeholder="Enter PAN number"
                        style={{ textTransform: 'uppercase' }}
                      />
                      <button className="btn btn-primary" type="button" onClick={(e) => { handleFind(e) }}>
                        <i className="bi bi-search"></i>
                      </button>
                    </div>
                    {isPanInValid && <div className='text-danger small mt-1'>Please Enter Valid PAN Number</div>}
                  </div>
                </div>

                {/* Personal Information Section */}
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <h6 className="text-secondary fw-semibold mb-3 border-bottom pb-2">Personal Information</h6>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Aadhar Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ownerData ? ownerData.adharNumber : adhar}
                      onChange={(e) => { setAdhar(e.target.value) }}
                      placeholder="Enter Aadhar number"
                      disabled={fieldIsDisabled}
                    />
                    {isAdharInValid && <div className='text-danger small mt-1'>Please Enter Valid Aadhar Number</div>}
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Adhar Linked with PAN</label>
                    <select 
                      className="form-select"
                      value={ownerData ? ownerData.panAdharLinkStatus : isAdharLinkedWithPan}
                      onChange={(e) => { setIsAdharLinkedWithPan(e.target.value) }}
                      disabled={fieldIsDisabled}
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ownerData ? ownerData.address : address}
                      onChange={(e) => { setAddress(e.target.value) }}
                      placeholder="Enter address"
                      disabled={fieldIsDisabled}
                    />
                  </div>
                </div>

                {/* Bank Information Section */}
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <h6 className="text-secondary fw-semibold mb-3 border-bottom pb-2">Bank Information</h6>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Bank A/C Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ownerData ? ownerData.bankAccountNumber : bankAcNo}
                      onChange={(e) => { setBankAcNo(e.target.value) }}
                      placeholder="Enter account number"
                      disabled={fieldIsDisabled}
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ownerData ? ownerData.bankName : bankName}
                      onChange={(e) => { setBankName(e.target.value) }}
                      placeholder="Enter bank name"
                      disabled={fieldIsDisabled}
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">IFSC Code</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      value={ownerData ? ownerData.ifscCode : ifscCode}
                      onChange={(e) => { setIfscCode(e.target.value) }}
                      placeholder="Enter IFSC code"
                      disabled={fieldIsDisabled}
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Branch Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ownerData ? ownerData.branchName : branch}
                      onChange={(e) => { setBranch(e.target.value) }}
                      placeholder="Enter branch name"
                      disabled={fieldIsDisabled}
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Remark</label>
                    <input
                      type="text"
                      className="form-control"
                      value={ownerData ? ownerData.remark : remark}
                      onChange={(e) => { setRemark(e.target.value) }}
                      placeholder="Enter remark"
                      disabled={fieldIsDisabled}
                    />
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <h6 className="text-secondary fw-semibold mb-3 border-bottom pb-2">Additional Information</h6>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Owner Type</label>
                    <select 
                      className="form-select"
                      value={ownerData ? ownerData.ownerType : ownerType}
                      onChange={(e) => { setOwnerType(e.target.value) }}
                      disabled={fieldIsDisabled}
                    >
                      <option value="actual">Actual</option>
                      <option value="lease">Lease</option>
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">TDS Status</label>
                    <select 
                      className="form-select"
                      value={ownerData ? ownerData.tdsStatus : tdsStatus}
                      onChange={(e) => { setTdsStatus(e.target.value) }}
                      disabled={fieldIsDisabled}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Submission Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={ownerData ? ownerData.tdsSubmissionDate : submissionDate}
                      disabled={fieldIsDisabled}
                      onChange={(e) => { setSubmissionDate(e.target.value) }}
                    />
                  </div>
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label className="form-label fw-semibold">Doc Ref No.</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Doc Ref No"
                      value={ownerData ? ownerData.docRefNo : docRefNo}
                      disabled={fieldIsDisabled}
                      onChange={(e) => { setDocRefNo(e.target.value) }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="row">
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary me-2"
                      onClick={(e) => { handleSubmit(e) }}
                      disabled={startSpneer}
                    >
                      {startSpneer && <span className="spinner-border spinner-border-sm me-2" role="status"></span>}
                      Save Changes
                    </button>
                    <button type="button" className="btn btn-outline-secondary">
                      Clear
                    </button>
                  </div>
                </div>

                {/* Status Messages */}
                {postError && (
                  <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    Some Error Occurred!
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                )}
                
                {isSaved && (
                  <div className="alert alert-success fade show mt-3" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Owner details successfully saved!
                  </div>
                )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default EditTruckOwner;
