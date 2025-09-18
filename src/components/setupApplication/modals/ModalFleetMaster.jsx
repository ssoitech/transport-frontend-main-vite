
import '../../../css/Modal.css';
import React, { useState, useEffect } from 'react'
import axios from 'axios';


function ModalFleetMaster({ eData, closeModal, updated }) {
    // console.log(eData.name);
    const [name, setName] = useState(eData.name);
    const [date, setDate] = useState(eData.joiningDate);
    const [balance, setBalance] = useState(eData.openingBalance);
    const [balanceType, setBalanceType] = useState(eData.balanceType);

    const [startSpneer, setStartSpneer] = useState(false);

    const [valueIsEmpty, setValueIsEmpty] = useState(false);
    const [updateError, setUpdateError] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);


    useEffect(() => {
        console.log("inside modal use effect");
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
        const URL = "http://localhost:8080/api/v1/update/one/fleet-agent-broker-master";
        await axios.post(URL,
            data
        )
            .then(function (response) {
                // handle success
                console.log(response)
                if (response.data === "success" && response.status === 201) {
                    setStartSpneer(false);
                    setUpdateSuccess(true);

                } else {
                    setStartSpneer(false);
                    setUpdateError(true);
                }

            })
            .catch(function (error) {
                // handle error
                console.log(error.response.data);
                if (error.response.data === "duplicate") {
                    setIsDuplicate(true);
                } else {
                    setStartSpneer(false);
                    setUpdateError(true);
                }

            }).finally(function () {
                console.log("from finally block");
            });
    }


    function handleSubmit() {
        setStartSpneer(true);

        // validations
        if (!name) {
            setValueIsEmpty(true);
            return;
        }

        if (name === eData.name && date === eData.joiningDate && balance === eData.openingBalance && balanceType === eData.balanceType) {
            closeModal();
            return;
        }

        console.log("afterrr efffecttttttt");
        const data = {
            "id": eData.id,
            "name": name,
            "joiningDate": date,
            "openingBalance": balance,
            "balanceType": balanceType
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
                    <div className="form-group">
                        <div className="input-group-prepend">
                            <span
                                className="input-group-text"
                                id="inputGroup-sizing-sm"
                            >
                                Name
                            </span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm m-4"
                            value={name}
                            onChange={(e) => { setName(e.target.value) }}
                        />

                    </div>
                    <div className="form-group">
                        <div className="input-group-prepend">
                            <span
                                className="input-group-text"
                                id="inputGroup-sizing-sm"
                            >
                                As on Date
                            </span>
                        </div>
                        <input
                            type="date"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={date}
                            onChange={(e) => { setDate(e.target.value) }}
                        />
                    </div>
                    <div className="form-group">
                        <div className="input-group-prepend">
                            <span
                                className="input-group-text"
                                id="inputGroup-sizing-sm"
                            >
                                Opening as on date
                            </span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            aria-label="Small"
                            aria-describedby="inputGroup-sizing-sm"
                            value={balance}
                            onChange={(e) => { setBalance(e.target.value) }}
                        />
                    </div>
                    <div className="form-group">
                        <select
                            class="form-select"
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            value={balanceType}
                            onChange={(e) => { setBalanceType(e.target.value) }}
                        >
                            <option value="Dr">Dr</option>
                            <option value="Cr">Cr</option>
                        </select>
                    </div>

                </form>
                {valueIsEmpty && <div className="alert alert-danger fade show mt-3" role="alert">
                    Name should not be empty!
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
                    <button className="btn btn-secondary m-2" type="button" onClick={handleCancel}>Cancel</button>
                    <button type="button" className="btn btn-primary m-2" onClick={handleSubmit}>
                        {startSpneer && <div className="spinner-border text-light spinner-border-sm pr-1" role="status">

                        </div>}
                        Save changes
                    </button>
                </div>
            </div>
        </div >

    )
}

export default ModalFleetMaster;
