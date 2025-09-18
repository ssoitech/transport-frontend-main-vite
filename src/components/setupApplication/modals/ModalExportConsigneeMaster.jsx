
import '../../../css/Modal.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { BaseUrl } from '../../../services/BaseURI';
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../../config/AxiosConfig';


function ModalExportConsigneeMaster({ eData, closeModal, updated }) {
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

    const [startSpneer, setStartSpneer] = useState(false);


    useEffect(() => {
        console.log("inside modal use effect");
        let timer;
        if (valueIsEmpty) {
            timer = setTimeout(() => {
                setValueIsEmpty(false);
            }, 3000);
        }

        if (updateSuccess) {
            timer = setTimeout(() => {
                setUpdateSuccess(false);
                closeModal();
            }, 3000);
        }

        return () => {
            clearTimeout(timer);
        };

    }, [valueIsEmpty, updateSuccess, closeModal, updated]);

    async function updateEditedData(data) {
        await axiosInstance.post('/api/v1/update/exporter-consignee-master',
            data
        )
            .then(function (response) {
                // handle success
                console.log(response)
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

                } else {
                    setStartSpneer(false);
                    setUpdateError(true);
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error.response.data);
                if (error.response.data === "duplicate") {
                    setStartSpneer(false);
                    setIsDuplicate(true);
                } else {
                    setStartSpneer(false);
                    setUpdateError(true);
                }

            })
    }


    function handleSubmit() {
        setStartSpneer(true);
        // validations
        if (!fname || !sname) {
            setStartSpneer(false);
            setValueIsEmpty(true);
            return;
        }

        if (fname === eData.name && sname === eData.sname && phNo === eData.contactNo && add1 === eData.add1 && add2 === eData.add2 && add3 === eData.add3) {
            setStartSpneer(false);
            closeModal();
            return;
        }

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
        // if (updateSuccess) {
        //     updated();
        // }
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
                {/* {updateSuccess && <div className="alert alert-success fade show mt-3" role="alert">
                    Successfully Updated.
                </div>

                } */}
                <div className="modal-footer">
                    <button className="btn btn-sm btn-outline-primary m-2" type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" className="btn btn-sm btn-primary pl-3 pr-3" onClick={handleSubmit}>
                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                        </div>}
                        Save
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

export default ModalExportConsigneeMaster
