import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, Toaster } from 'react-hot-toast';
import Swal from "sweetalert2";
import axiosInstance from '../../../config/AxiosConfig';
import AutoComplete from '../../searchComponent/AutoComplete';
import { useSelector } from 'react-redux';



function EditChallanHolder({ toggleState }) {
  const accessDetails = useSelector((state) => state.access.accessDetails);

  const [isSaved, setIsSaved] = useState(false);
  const [startSpneer, setStartSpneer] = useState(false);
  const [postError, setPostError] = useState(false);
  const [searchedChallanHolderId, setSearchedChallanHolderId] = useState(null);
  const [searchedChallanHolderDetails, setSearchedchallanHolderDetails] = useState(null);
  const [searchByNameLoader, setSearchByNameLoader] = useState(false)


  const { control, getValues, setValue, watch, register, handleSubmit, reset, formState: { errors } } = useForm();


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
          setIsSaved(true);
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
      .catch(function (error) {
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

  }, [searchedChallanHolderDetails])


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


    } catch (e) {
      setSearchByNameLoader(false);
    }

  }


  return (
    <div className='card overflow-auto'>
      <div className='card-body'>


        <div className="container mt-3 mb-3">
          <div className="row">
            {/* Search By Name */}
            <div className="col-md-4 position-relative">

              <label htmlFor="ownerName" className="form-label">
                Search By Name
              </label>
              <div className="d-flex">
                <AutoComplete
                  placeholder={"Search here"}
                  url={'/api/v1/challan-holder/get/all/names-ids?keyword='}
                  datakey={"name"}
                  customLoading={<>Loading..</>}
                  onSelect={(res) => setSearchedChallanHolderId(res)}
                  onChange={(input) => { }}
                  onBlur={(e) => { }}
                  onFocus={(e) => { }}
                  customStyles={{}}
                />

              </div>

            </div>

            {/* Search By Contact */}
            <div className="col-md-4 position-relative">

              <label htmlFor="ownerName" className="form-label">
                Search By Contact Number
              </label>
              <div className="d-flex">
                <AutoComplete
                  placeholder={"Search here"}
                  url={'/api/v1/challan-holder/get/all/contact-no-ids?keyword='}
                  datakey={"name"}
                  customLoading={<>Loading..</>}
                  onSelect={(res) => setSearchedChallanHolderId(res)}
                  onChange={(input) => { }}
                  onBlur={(e) => { }}
                  onFocus={(e) => { }}
                  customStyles={{}}
                />

              </div>

            </div>

            {/* Search By PAN */}
            <div className="col-md-4 position-relative">

              <label htmlFor="ownerName" className="form-label">
                Search By PAN Number
              </label>
              <div className="d-flex">
                <AutoComplete
                  placeholder={"Search here"}
                  url={'/api/v1/challan-holder/get/all/pan-no-ids?keyword='}
                  datakey={"name"}
                  customLoading={<>Loading..</>}
                  onSelect={(res) => setSearchedChallanHolderId(res)}
                  onChange={(input) => { }}
                  onBlur={(e) => { }}
                  onFocus={(e) => { }}
                  customStyles={{}}
                />

                <button type="button" className="btn btn-sm btn-success ml-2" disabled={searchByNameLoader} onClick={handleFindByName}>
                  {searchByNameLoader ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Loading ...
                    </>
                  ) : (
                    'Find'
                  )}
                </button>

              </div>

            </div>

          </div>
        </div>


        <form
          id="form"
          onSubmit={handleSubmit(onSubmitEditedData)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          <div className="form-row g-3" >
            <div className="form-group col-md-4 px-2">
              <label htmlFor="ownerName">Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="ownerNameEdit"
                name='ownerNameEdit'
                {...register("ownerNameEdit", { required: { value: true, message: 'Name is required' } })}
              />
              {errors.ownerName && <p className='text-danger'>{errors.ownerName.message}</p>}
            </div>
            <div className="form-group col-md-4 px-2">
              <label htmlFor="contact">Contact</label>
              <input
                type="number"
                className="form-control form-control-sm border-dark-subtle"
                id="contactEdit"
                name='contactEdit'
                {...register("contactEdit")}
              />
            </div>
            <div className="form-group col-md-4 px-2">
              <label htmlFor="panNumber">PAN Number</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="panNumberEdit"
                name='panNumberEdit'
                {...register("panNumberEdit", {
                  pattern: {
                    value: /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
                    message: "Please Enter Valid PAN Number"
                  }
                })}
              />
              {errors.panNumber && <p className='text-danger'>{errors.panNumber.message}</p>}
            </div>
          </div>
          {/* second row */}
          <div className="form-row g-3">
            <div className="form-group col-md-4 px-2">
              <label htmlFor="adharNumber">Aadhar Number</label>
              <input
                type="number"
                className="form-control form-control-sm border-dark-subtle"
                id="adharNumberEdit"
                name="adharNumberEdit"
                {...register("adharNumberEdit", {
                  pattern: {
                    value: /^([0-9]{4}[0-9]{4}[0-9]{4}$)|([0-9]{4}\s[0-9]{4}\s[0-9]{4}$)|([0-9]{4}-[0-9]{4}-[0-9]{4}$)/,
                    message: "Please Enter Valid Adhar Number"
                  }
                })}
              />
              {errors.adharNumber && <p className='text-danger'>Please Enter Valid Aadhar Number</p>}
            </div>
            <div className="form-group col-md-4 px-2">
              <label htmlFor="linked">Adhar Linked with PAN</label>
              <select
                className="form-select form-select-sm border-dark-subtle"
                id="linkedEdit"
                name="linkedEdit"

                {...register("linkedEdit")}

              >
                <option value=""></option>
                <option value="no">No</option>
                <option value="yes">Yes</option>

              </select>
            </div>
            <div className="form-group col-md-4 px-2">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="addressEdit"
                name="addressEdit"
                {...register("addressEdit")}
              />
            </div>
          </div>
          {/* third row */}
          <div className="form-row g-3">
            <div className="form-group col-md-4 px-2">
              <label htmlFor="accountNumber">Bank A/C Number</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="accountNumberEdit"
                name="accountNumberEdit"
                {...register("accountNumberEdit")}
              />
            </div>

            <div className="form-group col-md-4 px-2">
              <label htmlFor="bankName">Bank Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="bankNameEdit"
                name="bankNameEdit"
                {...register("bankNameEdit")}
              />
            </div>
            <div className="form-group col-md-4 px-2">
              <label htmlFor="ifscCode">IFSC Code</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="ifscCodeEdit"
                name="ifscCodeEdit"
                {...register("ifscCodeEdit")}
              />
            </div>
            <div className="form-group col-md-4 px-2">
              <label htmlFor="branchName">Branch Name</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="branchNameEdit"
                name="branchNameEdit"
                {...register("branchNameEdit")}
              />
            </div>
            <div className="form-group col-md-4 px-2">
              <label htmlFor="remark">Remark</label>
              <input
                type="text"
                className="form-control form-control-sm border-dark-subtle"
                id="remarkEdit"
                name="remarkEdit"
                {...register("remarkEdit")}
              />
            </div>

            <div className="form-group col-md-4 px-2">

              <div className="form-check form-check-inline mt-4">

                <label htmlFor="checkTds">Payment Hold</label>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary ml-3"
                  disabled={watch("checkTds") === "Y" ? false : true}
                  onClick={(e) => { reset() }}>
                  Release Payment
                </button>
                <input
                  className="form-check-input mt-1 border-dark-subtle"
                  type="checkbox"
                  name="checkTds"
                  id="checkTds"
                  value="Y"
                  {...register("checkTds")}
                />

              </div>

            </div>

          </div>



          <div className='text-center'>
            {/* <button type="submit" disabled={startSpneer} className="btn btn-primary ml-3">
              {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

              </div>}
              <span>Update</span>
            </button> */}

            <button type="submit" className="btn btn-primary ml-3" disabled={startSpneer}>
              {startSpneer ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Updating ...
                </>
              ) : (
                'Update'
              )}
            </button>


            <button type="button" className="btn btn-outline-primary ml-3" onClick={(e) => { reset() }}>
              Clear
            </button>
            <button type="button" className="btn btn-secondary ml-3" onClick={(e) => { reset() }}>
              New
            </button>
          </div>
          {
            postError && <div className="alert alert-danger alert-dismissible fade show m-3" role="alert">
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
          {/* {
                        isSaved && <div className="alert alert-success fade show m-2" role="alert">
                            Successfully Saved.
                        </div>
                    } */}
        </form>
      </div>
      <Toaster
        position="bottom-center"
        reverseOrder={true}
      />
    </div>
  )
}

export default EditChallanHolder;
