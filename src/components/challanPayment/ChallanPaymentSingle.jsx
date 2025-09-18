import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PdfComponent from "./challanPaymentComponents/PdfComponent";
import InvoiceGenerator from "./challanPaymentComponents/InvoiceGenerator";
import ModalChallanPayment from "./modalChallanPayment/ModalChallanPayment";
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';
import Swal from "sweetalert2";
import { Gradient } from "@mui/icons-material";
import axiosInstance from "../../config/AxiosConfig";

function ChallanPaymentSingle() {
  const [pdfPreview, setPdfPreview] = useState(false);
  const [displayModal, setDisplayModal] = useState(false);

  const [referenceNumber, setReferenceNumber] = useState("");
  const [data, setData] = useState(null);
  const [challanDetails, setChallanDetails] = useState([]);
  const [referenceDetails, setReferenceDetails] = useState([]);

  const {
    control: controlPaymentSection,
    getValues: getPaymentSectionValue,
    setValue: setPaymentSectionValue,
    watch: watchPaymentSectionValue,
    register: registerPaymentSection,
    handleSubmit: handlePaymentSection,
    reset: resetPaymentSection,
    formState: { errors }
  } = useForm();

  const {
    control: controlFirstSection,
    getValues: getFirstSectionValue,
    setValue: setFirstSectionValue,
    watch: watchFirstSectionValue,
    register: registerFirstSection,
    handleSubmit: handleFirstSection,
    reset: resetFirstSection,
    formState: { errorsFirstSection }
  } = useForm();

  useEffect(() => {
    if (referenceDetails.length !== 0) {
      setFirstSectionValue("challanHolder", referenceDetails.challan_holder_name);
      setFirstSectionValue("contactNumber", referenceDetails.contact_number);
      setFirstSectionValue("panNumber", referenceDetails.pan_number);

      var accDetails = "A/C No - " + referenceDetails.account_number + ", " + referenceDetails.bank_name + ", " + referenceDetails.branch + ", IFSC - " + referenceDetails.ifsc_code;

      setFirstSectionValue("bankDetails", accDetails);
    }


  }, [referenceDetails])

  function handlePdf() {
    setDisplayModal(true);
  }

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1/get/details-for-payment/${referenceNumber}`);
      console.log(response.data);
      setChallanDetails(response.data.challanDetails); // Store response data as needed
      setReferenceDetails(response.data.referenceDetails[0]);
      console.log(referenceDetails);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const onSubmitPaymentSectionData = (data) => {
    console.log("Form Data:", data);
    alert(`Form Submitted! Name`);
  };

  return (
    <div className="work-space-container">
      <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
        <span className='mb-0 h6'>Challan Payment</span>
      </div>

      <div className="card p-2">
        <div className="form-row">
          <div className="form-group col-md-2">
            <label htmlFor="inputField5">Received on Ref No.</label>
            <input
              type="text"
              className="form-control form-control-sm border-dark-subtle"
              id="inputField5"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </div>
          <div className="form-group col-md-4 p-2">
            <button type="button" className="btn btn-sm btn-primary  mt-4 ml-4" onClick={handleSearch}>Search</button>
            <button type="button" className="btn btn-sm btn-outline-primary  mt-4 ml-4">New</button>
            <button type="button" className="btn btn-sm btn-primary  mt-4 ml-4">Delete</button>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="inputField2">Date To</label>
            <div className="date-picker-container">

              <DatePicker
                className="date-picker-input pl-2"
                // selected={receivedFromDate}
                // onChange={handleFromDateChange}
                dateFormat="d-MMM-yyyy"
                placeholderText="Select a date"
                name="receivedOn"
                id="receivedOn"
                required={true}
              />

            </div>
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="inputField5">Search On Vehicle No.</label>
            <input
              type="text"
              className="form-control form-control-sm border-dark-subtle"
              id="inputField5"
            />
          </div>

        </div>
        <div className="form-row">
          <div className="form-group col-md-2">
            <label htmlFor="challanHolder">Challan Holder</label>
            <input
              type="text"
              className="form-control form-control-sm border-dark-subtle"
              id="challanHolder"
              name="challanHolder"
              {...registerFirstSection("challanHolder")}
            />
          </div>
          <div className="form-group col-md-6 p-2">
            <button type="button" className="btn btn-sm btn-secondary  mt-4 ml-4">Pending</button>
            <button type="button" className="btn btn-sm btn-outline-primary  mt-4 ml-4">Earlier Payment</button>
            <button type="button" className="btn btn-sm btn-danger  mt-4 ml-4">Voucher</button>
            <button type="button" className="btn btn-sm btn-primary  mt-4 ml-4" onClick={handlePdf}>Print A4</button>
            <button type="button" className="btn btn-sm btn-outline-primary  mt-4 ml-4">Excel</button>
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="challanHolder">Updated By</label>
            <input
              type="text"
              className="form-control form-control-sm border-dark-subtle"
              id="challanHolder"

            />
          </div>
          <div className="form-group col-md-2">
            <label htmlFor="challanHolder">Updated Date</label>
            <input
              type="text"
              className="form-control form-control-sm border-dark-subtle"
              id="challanHolder"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-2">
            <label htmlFor="challanHolder">Contact No</label>
            <input
              type="number"
              className="form-control form-control-sm border-dark-subtle"
              id="contactNumber"
              name="contactNumber"
              {...registerFirstSection("contactNumber")}
            />
          </div>
          <div className="form-group col-md-3">
            <label htmlFor="challanHolder">PAN</label>
            <input
              type="text"
              className="form-control form-control-sm border-dark-subtle"
              id="panNumber"
              name="panNumber"
              {...registerFirstSection("panNumber")}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="challanHolder">Bank Details</label>
            <input
              type="text"
              className="form-control form-control-sm border-dark-subtle"
              id="bankDetails"
              name="bankDetails"
              {...registerFirstSection("bankDetails")}
            />
          </div>
        </div>
      </div>

      <div >
        {/* ------------------------------------------------------- */}
        {/* table */}

        <div className="container mt-3">
          <div className="table-responsive">

            <table className="table-striped table-bordered table-hover align-middle">
              <thead className="thead-light">
                <tr className="text-center">
                  <th className='p-1' scope='col'>S.L No</th>
                  <th className='p-1' scope='col'>Status</th>
                  <th className='p-1' scope='col'>Load Date</th>
                  <th className='p-1' scope='col'>TP Number</th>
                  <th className='p-1' scope='col'>Truck Number</th>
                  <th className='p-1' scope='col'>Load Weight</th>
                  <th className='p-1' scope='col'>Net Unloaded</th>
                  <th className='p-1' scope='col'>Vehicle Rate</th>
                  <th className='p-1' scope='col'>Freight</th>
                  <th className='p-1' scope='col'>Shortage Rate</th>
                  <th className='p-1' scope='col'>HSD Advance</th>
                  <th className='p-1' scope='col'>Cash Advance</th>
                  <th className='p-1' scope='col'>Bank Advance</th>
                  <th className='p-1' scope='col'>Net Payable</th>
                  <th className='p-1' scope='col'>Office Expenses</th>
                  <th className='p-1' scope='col'>Other Deduction</th>
                  <th className='p-1' scope='col'>Total Deduction</th>
                  <th className='p-1' scope='col'>Short Name</th>
                  <th className='p-1' scope='col'>Loading Point Name</th>
                  <th className='p-1' scope='col'>Unloading Point Name</th>
                </tr>
              </thead>

              {challanDetails.length > 0 &&
                challanDetails.map((item, index) => (
                  <tr key={index}>
                    <td className='p-1 text-center'>{index + 1}</td>
                    <td className='p-1'>{item.status}</td>
                    <td className='p-1'>{item.loadDate}</td>
                    <td className='p-1'>{item.tpNumber}</td>
                    <td className='p-1'>{item.truckNumber}</td>
                    <td className='p-1'>{item.loadWeight}</td>
                    <td className='p-1'>{item.netUnloaded}</td>
                    <td className='p-1'>{item.vehicleRate}</td>
                    <td className='p-1'>{item.freight}</td>
                    <td className='p-1'>{item.shortageRate}</td>
                    <td className='p-1'>{item.hsdAdvance}</td>
                    <td className='p-1'>{item.cashAdvance}</td>
                    <td className='p-1'>{item.bankAdvance}</td>
                    <td className='p-1'>{item.netPayable}</td>
                    <td className='p-1'>{item.officeExpenses}</td>
                    <td className='p-1'>{item.otherDeduction}</td>
                    <td className='p-1'>{item.totalDeduction}</td>
                    <td className='p-1'>{item.shortName}</td>
                    <td className='p-1'>{item.loadingPointName}</td>
                    <td className='p-1'>{item.unloadingPointName}</td>
                  </tr>
                ))
              }
            </table>
          </div>
        </div>

        {/* table end */}
        {/* ------------------------------------------------- */}

        {/* after table section */}
        <div className="card p-3 mt-3">

          <form onSubmit={handlePaymentSection(onSubmitPaymentSectionData)}>

            <div className="form-row mt-2">
              <div className="col-sm">
                <label htmlFor="totalFreight" className="form-label">Total Freight</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="totalFreight"
                      name="totalFreight"
                      {...registerPaymentSection("totalFreight")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="totalDeduction" className="form-label">Total Deduction</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="totalDeduction"
                      name="totalDeduction"
                      {...registerPaymentSection("totalDeduction")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="totalPayable" className="form-label">Total Payable</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="totalPayable"
                      name="totalPayable"
                      {...registerPaymentSection("totalPayable")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="totalTds" className="form-label">Total TDS</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="totalTds"
                      name="totalTds"
                      {...registerPaymentSection("totalTds")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="onAdvance" className="form-label">On Advance</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="onAdvance"
                      name="onAdvance"
                      {...registerPaymentSection("onAdvance")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* second row */}
            <div className="form-row mt-2">
              <div className="col-sm">
                <label htmlFor="onFinal" className="form-label">On Final</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="onFinal"
                      name="onFinal"
                      {...registerPaymentSection("onFinal")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="netPayble" className="form-label">Net Payble</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="netPayble"
                      name="netPayble"
                      {...registerPaymentSection("netPayble")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="voucherNo" className="form-label">Voucher No.</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="voucherNo"
                      name="voucherNo"
                      {...registerPaymentSection("voucherNo")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="paymentMode" className="form-label">Payment Mode</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="paymentMode"
                      name="paymentMode"
                      {...registerPaymentSection("paymentMode")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="finalPaidAmount" className="form-label">Final Paid Amount</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="finalPaidAmount"
                      name="finalPaidAmount"
                      {...registerPaymentSection("finalPaidAmount")}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* third row */}
            <div className="form-row mt-2">
              <div className="col-sm">
                <label htmlFor="totalTgAmount" className="form-label">Total TG Amount</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="totalTgAmount"
                      name="totalTgAmount"
                      {...registerPaymentSection("totalTgAmount")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="paymentDate" className="form-label">Payment Date</label>
                <div className="row">
                  <div className="col-auto">
                    <Controller
                      id="paymentDate"
                      name="paymentDate"
                      control={controlPaymentSection}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker
                          placeholderText="Select date"
                          className='date-picker-input pl-2'
                          onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                          selected={field.value ? new Date(field.value) : null}
                          dateFormat="d-MMM-yyyy"

                        />
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="bankName" className="form-label">Bank Name</label>
                <div className="row">
                  <div className="col-auto">
                    <select
                      className="form-select form-select-sm border-dark-subtle"
                      aria-label="Default select example"
                      name='bankName'
                      id='bankName'
                      {...registerPaymentSection("bankName")}
                    >
                      <option value=""></option>
                      <option value="">ICICI Bank</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="cqNo" className="form-label">Cq. No.</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="cqNo"
                      name="cqNo"
                      {...registerPaymentSection("cqNo")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="cqDate" className="form-label">Cq. Date</label>
                <div className="row">
                  <div className="col-auto">
                    <Controller
                      id="cqDate"
                      name="cqDate"
                      control={controlPaymentSection}
                      defaultValue={null}
                      render={({ field }) => (
                        <DatePicker
                          placeholderText="Select date"
                          className='date-picker-input pl-2'
                          onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                          selected={field.value ? new Date(field.value) : null}
                          dateFormat="d-MMM-yyyy"

                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* fourth section */}

            <div className="form-row mt-2">
              <div className="col-sm">
                <label htmlFor="receivedBy" className="form-label">Received By</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="receivedBy"
                      name="receivedBy"
                      {...registerPaymentSection("receivedBy")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="paidBy" className="form-label">Paid By</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="paidBy"
                      name="paidBy"
                      {...registerPaymentSection("paidBy")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="entryBy" className="form-label">Entry By</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="entryBy"
                      name="entryBy"
                      {...registerPaymentSection("entryBy")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="entryDate" className="form-label">Entry Date</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="entryDate"
                      name="entryDate"
                      {...registerPaymentSection("entryDate")}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <label htmlFor="entryPlace" className="form-label">Entry Place</label>
                <div className="row">
                  <div className="col-auto">
                    <input
                      type="text"
                      className="form-control form-control-sm border-dark-subtle"
                      id="entryPlace"
                      name="entryPlace"
                      {...registerPaymentSection("entryPlace")}
                    />
                  </div>
                </div>
              </div>

            </div>
            <div className="col-sm">
              <label htmlFor="paymentNote" className="form-label">Payment Note</label>
              <div className="row">
                <div className="col-auto">
                  <textarea
                    type="text"
                    className="form-control form-control-sm border-dark-subtle"
                    id="paymentNote"
                    name="paymentNote"
                    {...registerPaymentSection("paymentNote")}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm">
              <label htmlFor="paymentNote" className="form-label">CT Exp %</label>
              <div className="row">
                <div className="col-auto">
                  <input
                    type="number"
                    className="form-control form-control-sm border-dark-subtle"
                    id="ctExpPercent"
                    name="ctExpPercent"
                    {...registerPaymentSection("ctExpPercent")}
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                class="btn btn-primary m-2"
              >
                Confirm
              </button>

            </div>

          </form>
        </div>


        {/* after table section end */}
      </div>

      {
        displayModal && <ModalChallanPayment closeModal={() => {
          setDisplayModal(false);
        }} updated={() => { }} />
      }

    </div>
  );
}

export default ChallanPaymentSingle;
