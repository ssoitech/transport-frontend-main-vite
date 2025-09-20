import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import axiosInstance from '../../../config/AxiosConfig';
import AutoComplete from '../../searchComponent/AutoComplete';
import { useSelector } from 'react-redux';



function EditChallanHolder({ toggleState }) {
  const accessDetails = useSelector((state) => state.access.accessDetails);

  const [startSpneer, setStartSpneer] = useState(false);
  const [postError, setPostError] = useState(false);
  const [searchedChallanHolderId, setSearchedChallanHolderId] = useState(null);
  const [searchedChallanHolderDetails, setSearchedchallanHolderDetails] = useState(null);
  const [searchByNameLoader, setSearchByNameLoader] = useState(false)

  const { setValue, watch, register, handleSubmit, reset, formState: { errors } } = useForm();


  // Saving the data
  async function postData(fdata) {
    setStartSpneer(true);
    await axiosInstance.put('/api/v1/challan-holder/update',
      fdata
    )
      .then(function (response) {
        // handle success
        console.log(response)
        setStartSpneer(false);
        if (response.data === "success") {
          setStartSpneer(false);
          toggleState();
          Swal.fire({
            icon: "success",
            text: "successfully Updated.",
            confirmButtonText: "OK",
          });
          return;

        } else {
          setPostError(true);
          setStartSpneer(false);
          toast.error("Some Error Occured!");
        }
      })
      .catch(() => {
        // handle error
        setStartSpneer(false);
        Swal.fire({
          icon: "error",
          text: "Some Error Occured!",
          confirmButtonText: "OK",
        });
      });
  }

  const onSubmitEditedData = async (data) => {

    console.log(data);
    const submitData = {
      "challanHolderDetails": {
        "id": searchedChallanHolderDetails.challanHolderId,
        "challanHolderName": data.ownerNameEdit,
        "contactNumber": data.contactEdit,
        "panNumber": data.panNumberEdit,
        "adharNumber": data.adharNumberEdit,
        "panAdharLinkStatus": data.linkedEdit,
        "address": data.addressEdit,
        "remark": data.remarkEdit,
        "paymentHold": data.checkTds === "Y" ? "Y" : searchedChallanHolderDetails.paymentHold,
        "updatedBy": accessDetails.userId ? accessDetails.userId : null
      },

      "challanHolderBankDetails": {
        "id": searchedChallanHolderDetails.bankAccountId,
        "accountNumber": data.accountNumberEdit,
        "bankName": data.bankNameEdit,
        "ifscCode": data.ifscCodeEdit,
        "branch": data.branchNameEdit,
        "updatedBy": accessDetails.userId ? accessDetails.userId : null
      }
    }

    await postData(submitData);
    // console.log(submitData);
  }

  useEffect(() => {
    if (!searchedChallanHolderDetails) return;

    setValue("ownerNameEdit", searchedChallanHolderDetails.challanHolderName ? searchedChallanHolderDetails.challanHolderName : "");
    setValue("contactEdit", searchedChallanHolderDetails.contactNumber ? searchedChallanHolderDetails.contactNumber : "");
    setValue("panNumberEdit", searchedChallanHolderDetails.panNumber ? searchedChallanHolderDetails.panNumber : "");
    setValue("adharNumberEdit", searchedChallanHolderDetails.adharNumber ? searchedChallanHolderDetails.adharNumber : "");
    setValue("linkedEdit", searchedChallanHolderDetails.panAdharLinkStatus ? searchedChallanHolderDetails.panAdharLinkStatus : "");
    setValue("addressEdit", searchedChallanHolderDetails.address ? searchedChallanHolderDetails.address : "");
    setValue("accountNumberEdit", searchedChallanHolderDetails.accountNumber ? searchedChallanHolderDetails.accountNumber : "");
    setValue("bankNameEdit", searchedChallanHolderDetails.bankName ? searchedChallanHolderDetails.bankName : "");
    setValue("ifscCodeEdit", searchedChallanHolderDetails.ifscCode ? searchedChallanHolderDetails.ifscCode : "");
    setValue("branchNameEdit", searchedChallanHolderDetails.branch ? searchedChallanHolderDetails.branch : "");
    setValue("remarkEdit", searchedChallanHolderDetails.remark ? searchedChallanHolderDetails.remark : "");
    setValue("checkTds", searchedChallanHolderDetails.paymentHold == "Y" ? "Y" : null);

  }, [searchedChallanHolderDetails, setValue])


  const handleFindByName = async () => {

    try {
      if (!searchedChallanHolderId) {
        return;
      } else {

        if (!searchedChallanHolderId.id) {
          return;
        }

        setSearchByNameLoader(true);


        const challanHolderId = searchedChallanHolderId.id ? searchedChallanHolderId.id : null;

        await axiosInstance.get(`/api/v1/challan-holder/get/one-by-id/${challanHolderId}`)
          .then(function (response) {
            setSearchByNameLoader(false);
            console.log(response.data);
            if (response.data.length > 0) {
              setSearchedchallanHolderDetails(response.data[0]);
            }
          })
          .catch(function (error) {
            // handle error
            setSearchByNameLoader(false);
            console.log(error);
          });
      }


    } catch {
      setSearchByNameLoader(false);
    }

  }


  return (
    <div className='container-fluid'>
      <div className='row justify-content-center'>
        <div className='col-12 col-xl-11'>
          <div className='card shadow-sm border-0'>
            <div className='card-body p-4'>
              {/* Search Section */}
              <div className="mb-4">
                <h5 className="card-title mb-3 text-primary fw-bold">Search Challan Holder</h5>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <label htmlFor="searchByName" className="form-label fw-semibold">
                      Search By Name
                    </label>
                    <AutoComplete
                      placeholder={"Enter holder name"}
                      url={'/api/v1/challan-holder/get/all/names-ids?keyword='}
                      datakey={"name"}
                      customLoading={<span className="text-muted">Loading...</span>}
                      onSelect={(res) => setSearchedChallanHolderId(res)}
                      onChange={() => { }}
                      onBlur={() => { }}
                      onFocus={() => { }}
                      customStyles={{}}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="searchByContact" className="form-label fw-semibold">
                      Search By Contact Number
                    </label>
                    <AutoComplete
                      placeholder={"Enter contact number"}
                      url={'/api/v1/challan-holder/get/all/contact-no-ids?keyword='}
                      datakey={"name"}
                      customLoading={<span className="text-muted">Loading...</span>}
                      onSelect={(res) => setSearchedChallanHolderId(res)}
                      onChange={() => { }}
                      onBlur={() => { }}
                      onFocus={() => { }}
                      customStyles={{}}
                    />
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="searchByPAN" className="form-label fw-semibold">
                      Search By PAN Number
                    </label>
                    <div className="d-flex gap-2">
                      <AutoComplete
                        placeholder={"Enter PAN number"}
                        url={'/api/v1/challan-holder/get/all/pan-no-ids?keyword='}
                        datakey={"name"}
                        customLoading={<span className="text-muted">Loading...</span>}
                        onSelect={(res) => setSearchedChallanHolderId(res)}
                        onChange={() => { }}
                        onBlur={() => { }}
                        onFocus={() => { }}
                        customStyles={{}}
                      />
                      <button 
                        type="button" 
                        className="btn btn-success px-4" 
                        disabled={searchByNameLoader} 
                        onClick={handleFindByName}
                      >
                        {searchByNameLoader ? (
                          <>
                            <output className="spinner-border spinner-border-sm me-2" aria-live="polite"></output>
                            Loading...
                          </>
                        ) : (
                          'Find'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="my-4" />


              {/* Edit Form Section */}
              <form id="form" onSubmit={handleSubmit(onSubmitEditedData)}>
                <h5 className="card-title mb-3 text-primary fw-bold">Edit Challan Holder Details</h5>
                
                {/* Personal Information Section */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <label htmlFor="ownerNameEdit" className="form-label fw-semibold">Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="ownerNameEdit"
                      name='ownerNameEdit'
                      placeholder="Enter full name"
                      {...register("ownerNameEdit", { required: { value: true, message: 'Name is required' } })}
                    />
                    {errors.ownerName && <div className='text-danger small mt-1'>{errors.ownerName.message}</div>}
                  </div>
                  <div className="col-12 col-md-4">
                    <label htmlFor="contactEdit" className="form-label fw-semibold">Contact</label>
                    <input
                      type="number"
                      className="form-control"
                      id="contactEdit"
                      name='contactEdit'
                      placeholder="Enter contact number"
                      {...register("contactEdit")}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label htmlFor="panNumberEdit" className="form-label fw-semibold">PAN Number</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      id="panNumberEdit"
                      name='panNumberEdit'
                      placeholder="Enter PAN number"
                      {...register("panNumberEdit", {
                        pattern: {
                          value: /[A-Z]{5}\d{4}[A-Z]/,
                          message: "Please Enter Valid PAN Number"
                        }
                      })}
                    />
                    {errors.panNumber && <div className='text-danger small mt-1'>{errors.panNumber.message}</div>}
                  </div>
                </div>

                {/* Address & Documents Section */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <label htmlFor="adharNumberEdit" className="form-label fw-semibold">Aadhar Number</label>
                    <input
                      type="number"
                      className="form-control"
                      id="adharNumberEdit"
                      name="adharNumberEdit"
                      placeholder="Enter Aadhar number"
                      {...register("adharNumberEdit", {
                        pattern: {
                          value: /^\d{12}$/,
                          message: "Please Enter Valid Adhar Number"
                        }
                      })}
                    />
                    {errors.adharNumber && <div className='text-danger small mt-1'>Please Enter Valid Aadhar Number</div>}
                  </div>
                  <div className="col-12 col-md-4">
                    <label htmlFor="linkedEdit" className="form-label fw-semibold">Adhar Linked with PAN</label>
                    <select
                      className="form-select"
                      id="linkedEdit"
                      name="linkedEdit"
                      {...register("linkedEdit")}
                    >
                      <option value="">Select an option</option>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label htmlFor="addressEdit" className="form-label fw-semibold">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="addressEdit"
                      name="addressEdit"
                      placeholder="Enter address"
                      {...register("addressEdit")}
                    />
                  </div>
                </div>

                {/* Bank Details Section */}
                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label htmlFor="accountNumberEdit" className="form-label fw-semibold">Bank A/C Number</label>
                    <input
                      type="text"
                      className="form-control"
                      id="accountNumberEdit"
                      name="accountNumberEdit"
                      placeholder="Enter account number"
                      {...register("accountNumberEdit")}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label htmlFor="bankNameEdit" className="form-label fw-semibold">Bank Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="bankNameEdit"
                      name="bankNameEdit"
                      placeholder="Enter bank name"
                      {...register("bankNameEdit")}
                    />
                  </div>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-4">
                    <label htmlFor="ifscCodeEdit" className="form-label fw-semibold">IFSC Code</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      id="ifscCodeEdit"
                      name="ifscCodeEdit"
                      placeholder="Enter IFSC code"
                      {...register("ifscCodeEdit")}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label htmlFor="branchNameEdit" className="form-label fw-semibold">Branch Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="branchNameEdit"
                      name="branchNameEdit"
                      placeholder="Enter branch name"
                      {...register("branchNameEdit")}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label htmlFor="remarkEdit" className="form-label fw-semibold">Remark</label>
                    <input
                      type="text"
                      className="form-control"
                      id="remarkEdit"
                      name="remarkEdit"
                      placeholder="Enter remark (optional)"
                      {...register("remarkEdit")}
                    />
                  </div>
                </div>

                {/* Payment Hold Section */}
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <div className="d-flex align-items-center gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="checkTds"
                          id="checkTds"
                          value="Y"
                          {...register("checkTds")}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="checkTds">
                          Payment Hold
                        </label>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        disabled={watch("checkTds") !== "Y"}
                        onClick={() => { reset() }}
                      >
                        Release Payment
                      </button>
                    </div>
                  </div>
                </div>

                {/* Buttons Section */}
                <div className='d-flex justify-content-center gap-3 mt-4 pt-3 border-top'>
                  <button type="submit" className="btn btn-primary px-4 py-2" disabled={startSpneer}>
                    {startSpneer ? (
                      <>
                        <output className="spinner-border spinner-border-sm me-2" aria-live="polite"></output>
                        Updating...
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                  <button type="button" className="btn btn-outline-primary px-4 py-2" onClick={() => { reset() }}>
                    Clear
                  </button>
                  <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => { reset() }}>
                    New
                  </button>
                </div>

                {/* Error Messages */}
                {postError && (
                  <div className="alert alert-danger alert-dismissible fade show mt-4" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Some Error Occurred! Please try again.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
      />
    </div>
  )
}

export default EditChallanHolder;
