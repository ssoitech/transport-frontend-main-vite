import '../../../css/Modal.css';
import React, { useState, useEffect } from 'react'
import axiosInstance from '../../../config/AxiosConfig';


function EditTransportingMaterialModal({ eData, closeModal, updated }) {
    const [name, setName] = useState(eData.name);

    const [valueIsEmpty, setValueIsEmpty] = useState(false);
    const [updateError, setUpdateError] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const [startSpneer, setStartSpneer] = useState(false);

    const [cancalButtonDisabled, setCancelButtonDisabled] = useState(false);


    async function updateEditedData(data) {
        await axiosInstance.post('/api/v1/update/one/transporting-material',
            data
        )
            .then(function (response) {
                // handle success
                // console.log(response)
                if (response.data === "success" && response.status === 201) {
                    setStartSpneer(false);
                    setUpdateSuccess(true);
                    setCancelButtonDisabled(false);
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

    useEffect(() => {
        // console.log("inside modal use effect");
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

    }, [valueIsEmpty, updateSuccess]);



    function handleSubmit() {
        setCancelButtonDisabled(true);
        setStartSpneer(true);
        // validations
        if (!name) {
            setStartSpneer(false);
            setValueIsEmpty(true);
            return;
        }

        if (name === eData.name) {
            setStartSpneer(false);
            closeModal();
            return;
        }


        const data = {
            "id": eData.id,
            "materialName": name,
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
                            <span className="input-group-text" id="inputGroup-sizing-sm">Material Name</span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                        />
                    </div>

                </form>
                {valueIsEmpty && <div className="alert alert-danger fade show mt-3" role="alert">
                    Name can not be Empty !!
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
                        Material Name already exist.
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
                    <button disabled={cancalButtonDisabled} className="btn btn-sm btn-outline-primary m-2" type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" className="btn btn-sm btn-primary pl-3 pr-3" onClick={handleSubmit}>
                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                        </div>}
                        Save
                    </button>
                </div>
            </div>
        </div >
    )
}

export default EditTransportingMaterialModal;
