
import '../../css/Modal.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import axiosInstance from '../../config/AxiosConfig';


function ModalTraderBillingPartyMaster({ eData, closeModal, updated }) {
    // console.log(eData.name);
    const [fname, setFname] = useState(eData.name);
    const [sname, setSname] = useState(eData.sname);
    const [phNo, setPhNo] = useState(eData.contactNo);
    const [add1, setAdd1] = useState(eData.add1);
    const [add2, setAdd2] = useState(eData.add2);
    const [add3, setAdd3] = useState(eData.add3);
    const [valueIsEmpty, setValueIsEmpty] = useState(false);
    const [updateError, setUpdateError] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);


    useEffect(() => {

        let timer1, timer2;
        if (valueIsEmpty) {
            timer1 = setTimeout(() => {
                setValueIsEmpty(false);
            }, 3000);
        }

        if (updateSuccess) {
            timer2 = setTimeout(() => {
                setUpdateSuccess(false);
                updated();
                closeModal();
            }, 3000);
        }

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };

    }, [valueIsEmpty, updateSuccess, closeModal, updated]);

    async function updateEditedData(data) {
        await axiosInstance.post("/api/v1/update/trader-billing-party-master",
            data
        )
            .then(function (response) {
                // handle success
                console.log(response)
                if (response.data === "success" && response.status === 201) {
                    setUpdateSuccess(true);

                } else {
                    setUpdateError(true);
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error.response.data);
                if (error.response.data === "duplicate") {
                    setIsDuplicate(true);
                } else {
                    setUpdateError(true);
                }

            }).finally(function () {
                console.log("from finally block");
            });
    }


    function handleSubmit() {
        // validations
        if (!fname || !sname) {

            setValueIsEmpty(true);
            return;
        }

        if (fname === eData.name && sname === eData.sname && phNo === eData.contactNo && add1 === eData.add1 && add2 === eData.add2 && add3 === eData.add3) {
            closeModal();
            return;
        }

        console.log("afterrr efffecttttttt");
        const data = {
            "id": eData.id,
            "name": fname,
            "shortName": sname,
            "contactNo": phNo,
            "address1": add1,
            "address2": add2,
            "address3": add3
        }

        updateEditedData(data);
    }

    function handleCancel() {
        closeModal();
    }

    return (
        <div className='modal-container'>
            <div className="modal-card">
                <form className='justify-content-around' id="form2">

                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">Name</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={fname}
                            onChange={(e) => { setFname(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">Short Name</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={sname}
                            onChange={(e) => { setSname(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">Contact No</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={phNo}
                            onChange={(e) => { setPhNo(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">Address 1</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={add1}
                            onChange={(e) => { setAdd1(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">Address 2</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={add2}
                            onChange={(e) => { setAdd2(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">Address 3</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={add3}
                            onChange={(e) => { setAdd3(e.target.value) }}
                        />
                    </div>
                </form>
                {valueIsEmpty && <div className="alert alert-danger fade show mt-3" role="alert">
                    Consignor Name and Short Name can not be Empty !!
                </div>}
                {
                    updateError && <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                        Some Error Occurred !!
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                }
                {
                    isDuplicate && <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                        Short Name already exist.
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                }
                {updateSuccess && <div className="alert alert-success fade show mt-3" role="alert">
                    Successfully Updated.
                </div>

                }
                <div className="modal-footer">
                    <button className="btn btn-sm btn-secondary m-1" type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" className="btn btn-sm btn-primary m-1" onClick={handleSubmit}>
                        Save
                    </button>
                </div>
            </div>
        </div >

    )
}

export default ModalTraderBillingPartyMaster;
