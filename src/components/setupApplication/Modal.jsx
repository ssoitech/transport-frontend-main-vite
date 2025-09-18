
import '../../css/Modal.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { BaseUrl } from '../../services/BaseURI';
import axiosInstance from '../../config/AxiosConfig';


function Modal({ eData, closeModal, updated }) {
    // console.log(eData.name);
    const [fname, setFname] = useState(eData.name);
    const [sname, setSname] = useState(eData.sname);
    const [comms, setComms] = useState(eData.comm);
    const [valueIsEmpty, setValueIsEmpty] = useState(false);
    const [updateError, setUpdateError] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [startSpneer, setStartSpneer] = useState(false);


    useEffect(() => {
        // console.log("inside modal use effect");
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

    async function updateEditedData(fdata) {
        setStartSpneer(true);
        await axiosInstance.post('/api/v1/update/consigner-owner-master',
            fdata
        )
            .then(function (response) {
                // handle success
                console.log(response.data)
                if (response.data === "success" && response.status === 201) {
                    setStartSpneer(false);
                    toast.success('Successfully Updated.', {
                        position: "bottom-center",
                        style: {
                            background: "green",
                            color: "#fff",
                        }
                    });
                    setUpdateSuccess(true);
                    updated();
                    closeModal();

                } else {
                    setStartSpneer(false);
                    setUpdateError(true);
                }

            })
            .catch(function (error) {
                // handle error
                setStartSpneer(false);
                console.log(error.response.data);
                if (error.response.data === "duplicate") {
                    setIsDuplicate(true);
                } else {
                    setUpdateError(true);
                }

            })
    }

    async function handleSubmit() {

        console.log(fname, sname, comms);
        // validations
        if (!fname || !sname) {

            setValueIsEmpty(true);
            return;
        }

        if (fname === eData.name && sname === eData.sname && comms === eData.comm) {

            closeModal();
            return;
        }

        // console.log("afterrr efffecttttttt");
        const fdata = {
            "id": eData.id,
            "name": fname,
            "communication": comms,
            "shortName": sname
        }

        await updateEditedData(fdata);
    }

    function handleCancel() {
        closeModal();
    }

    return (
        <div className='modal-container'>
            <div className="modal-card">
                <form className='justify-content-around' id="form2">
                    <div className="form-group">
                        <label htmlFor="consignorName">Consignor Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="consignorName"
                            placeholder=""
                            value={fname}
                            onChange={(e) => { setFname(e.target.value) }}

                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="shortName">Short Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="shortName"
                            placeholder=""
                            value={sname}
                            onChange={(e) => { setSname(e.target.value) }}
                            required
                        />

                    </div>
                    <div className="form-group">
                        <label htmlFor="communication">Communication</label>
                        <input
                            type="text"
                            className="form-control"
                            id="communication"
                            placeholder=""
                            value={comms}
                            onChange={(e) => { setComms(e.target.value) }}
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
                {/* {updateSuccess && <div className="alert alert-success fade show mt-3" role="alert">
                    Successfully Updated.
                </div>

                } */}
                <div className="modal-footer">
                    <button className="btn btn-sm btn-outline-primary mr-2" type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" className="btn btn-sm btn-primary" onClick={handleSubmit}>
                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">
                        </div>}
                        <span>Save</span>
                    </button>
                </div>
            </div>
            <Toaster
                position="bottom-center"
                reverseOrder={true}
            />
        </div >

    )
}

export default Modal
