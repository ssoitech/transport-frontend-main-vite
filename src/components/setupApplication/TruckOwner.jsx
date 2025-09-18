import React, { useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import AddNewTruckOwner from './truckOwnerSections/AddNewTruckOwner';
import EditTruckOwner from './truckOwnerSections/EditTruckOwner';
import TruckOwnerTable from './truckOwnerSections/TruckOwnerTable';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function TruckOwner() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

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

    return (
        <div className='work-space-container'>
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Truck Owner Details</span>
            </div>
            <div>
                <Tabs
                    defaultActiveKey="add-new-owner"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="add-new-owner" title="Add New Owner">
                        <AddNewTruckOwner />
                    </Tab>
                    <Tab eventKey="edit-owner" title="Edit Existing Owner Data">
                        <EditTruckOwner />
                    </Tab>
                    <Tab eventKey="owner-table" title="All Owner Details">
                        <TruckOwnerTable />
                    </Tab>

                </Tabs>

            </div>

        </div>
    )
}

export default TruckOwner;
