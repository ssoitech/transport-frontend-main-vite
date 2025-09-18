
import '../../../css/Modal.css';
import React, { useState, useEffect, useContext } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import axiosInstance from '../../../config/AxiosConfig';
import { AuthContext } from '../../../services/AuthContext';
import { useSelector } from 'react-redux';



function VehiclePassingWeightModal({ eData, closeModal, updated }) {
    const accessDetails = useSelector((state) => state.access.accessDetails);

    const [valueIsEmpty, setValueIsEmpty] = useState(false);
    const [updateError, setUpdateError] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [wheel6, setWheel6] = useState(eData ? eData.sixWheel : "");
    const [wheel8, setWheel8] = useState(eData ? eData.eightWheel : "");
    const [wheel10, setWheel10] = useState(eData ? eData.tenWheel : "");
    const [wheel12, setWheel12] = useState(eData ? eData.twelveWheel : "");
    const [wheel14, setWheel14] = useState(eData ? eData.fourteenWheel : "");
    const [wheel16, setWheel16] = useState(eData ? eData.sixteenWheel : "");
    const [wheel18, setWheel18] = useState(eData ? eData.eighteenWheel : "");
    const [wheel22, setWheel22] = useState(eData ? eData.twentyTwoWheel : "");
    const [updatedBy, setUpdatedBy] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");

    const [startSpneer, setStartSpneer] = useState(false);

    const { username } = useContext(AuthContext);


    function getCurrentDate() {
        let objectDate = new Date();

        let day = objectDate.getDate();
        let month = objectDate.getMonth();
        let year = objectDate.getFullYear();

        let format = day + "/" + (month + 1) + "/" + year;

        return format;

    }


    useEffect(() => {

        let timer;
        if (valueIsEmpty) {
            timer = setTimeout(() => {
                setValueIsEmpty(false);
            }, 3000);
        }

        if (updateSuccess) {
            timer = setTimeout(() => {
                setUpdateSuccess(false);
                updated();
                closeModal();
            }, 3000);
        }

        return () => {
            clearTimeout(timer);
        };

    }, [valueIsEmpty, updateSuccess]);

    async function updateEditedData(data) {

        await axiosInstance.post("/api/v1/update/vehicle-passing-weight",
            data
        )
            .then(function (response) {
                // handle success
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

                } else {
                    setStartSpneer(false);
                    setUpdateError(true);
                }

            })
            .catch(function (error) {
                // handle error
                // console.log(error.response.data);
                setStartSpneer(false);
                setUpdateError(true);

                console.log(error);

            })
    }


    async function handleSubmit() {
        setStartSpneer(true);

        // validations
        if (!wheel6 || !wheel8 || !wheel10 || !wheel12 || !wheel14 || !wheel16 || !wheel18) {
            setStartSpneer(false);
            setValueIsEmpty(true);
            return;
        }

        if (wheel6 === eData.sixWheel && wheel8 === eData.eightWheel && wheel10 === eData.tenWheel && wheel12 === eData.twelveWheel && wheel14 === eData.fourteenWheel && wheel16 === eData.sixteenWheel && wheel18 === eData.eighteenWheel && wheel22 === eData.twentyTwoWheel) {
            setStartSpneer(false);
            closeModal();
            return;
        }

        // setUpdatedAt(getCurrentDate());
        // setUpdatedBy(getToken());
        const data = {
            "id": eData.id,
            "sixWheel": wheel6,
            "eightWheel": wheel8,
            "tenWheel": wheel10,
            "twelveWheel": wheel12,
            "fourteenWheel": wheel14,
            "sixteenWheel": wheel16,
            "eighteenWheel": wheel18,
            "twentyTwoWheel": wheel22,
            "updatedBy": accessDetails.userId
        }

        console.log(data);
        await updateEditedData(data);
    }

    function handleCancel() {
        updated();
        closeModal();
    }

    return (
        <div className='modal-container'>
            <div className="modal-card">
                <form className='justify-content-around' id="form2">
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">6 Wheel</span>
                        </div>
                        <input
                            type="text"
                            className="form-control pl-3"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={wheel6}
                            onChange={(e) => { setWheel6(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">8 Wheel</span>
                        </div>
                        <input
                            type="text"
                            className="form-control pl-3"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={wheel8}
                            onChange={(e) => { setWheel8(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">10 Wheel</span>
                        </div>
                        <input
                            type="text"
                            className="form-control pl-3"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={wheel10}
                            onChange={(e) => { setWheel10(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">12 Wheel</span>
                        </div>
                        <input
                            type="text"
                            className="form-control pl-3"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={wheel12}
                            onChange={(e) => { setWheel12(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">14 Wheel</span>
                        </div>
                        <input
                            type="text"
                            className="form-control pl-3"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={wheel14}
                            onChange={(e) => { setWheel14(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">16 Wheel</span>
                        </div>
                        <input
                            type="text"
                            className="form-control pl-3"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={wheel16}
                            onChange={(e) => { setWheel16(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">18 Wheel</span>
                        </div>
                        <input
                            type="text"
                            className="form-control pl-3"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={wheel18}
                            onChange={(e) => { setWheel18(e.target.value) }}
                        />
                    </div>
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="inputGroup-sizing-sm">22 Wheel</span>
                        </div>
                        <input
                            type="text"
                            className="form-control pl-3"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={wheel22}
                            onChange={(e) => { setWheel22(e.target.value) }}
                        />
                    </div>

                </form>
                {valueIsEmpty && <div className="alert alert-danger fade show mt-3" role="alert">
                    Value should not be empty!!
                </div>}
                {
                    updateError && <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
                        Some Error Occurred !!
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
                    <button type="button" disabled={startSpneer} className="btn btn-sm btn-primary text-white pl-3 pr-3" onClick={handleSubmit}>
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

export default VehiclePassingWeightModal;
