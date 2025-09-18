import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddChallanHolder from './challanHolderSection/AddChallanHolder';
import EditChallanHolder from './challanHolderSection/EditChallanHolder';
import ChallanHolderTable from './challanHolderSection/ChallanHolderTable';


function ChallanHolder() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();
    const [stateValue, setStateValue] = useState(false);

    useEffect(() => {
        if (accessDetails) {
            if (accessDetails.role !== 'ADMIN') {
                if (accessDetails.role === 'USER') {
                    if (accessDetails.setupApplicationAccess !== "Y") {
                        Swal.fire("Error", "You don't have access to this section.", "error");
                        navigate('/work-space');
                    }

                } else {
                    Swal.fire("Error", "You don't have access to this section.", "error");
                    navigate('/work-space');
                }
            }

        } else {
            Swal.fire("Error", "You don't have access to this section.", "error");
            navigate('/work-space');
        }

    }, []);

    const toggleState = () => {
        setStateValue((prev) => !prev);
    };

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Challan Holder/ 3rd Party Details</span>
            </div>
            <div>
                <Tabs
                    defaultActiveKey="add-new-owner"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="add-new-owner" title="Add New Challan Holder">
                        <AddChallanHolder toggleState={toggleState} />
                    </Tab>
                    <Tab eventKey="edit-owner" title="Edit Existing Challan Holder Data">
                        <EditChallanHolder toggleState={toggleState} />
                    </Tab>

                </Tabs>

            </div>
            <div>
                <ChallanHolderTable stateValue={stateValue} />
            </div>

        </div>
    )
}

export default ChallanHolder;
