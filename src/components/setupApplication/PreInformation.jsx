import React, { useEffect } from 'react'
import { Tab, Tabs } from 'react-bootstrap';
import TransportingMaterials from './sections/TransportingMaterials';
import Destinations from './sections/Destinations';
import ChallanCollectionCenter from './sections/ChallanCollectionCenter';
import FieldStaffExpenditure from './sections/FieldStaffExpenditure';
import FillingStation from './sections/FillingStation';
import Swal from "sweetalert2";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function PreInformation() {
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
            <div
                className="alert alert-primary text-center font-weight-bold text-dark position-relative p-1"
                role="alert">
                {/* name of the table */}
                <span className="mb-0 h6">Pre-Defined Information Master</span>
            </div>

            <Tabs
                defaultActiveKey="transporting-material"
                id="fill-tab-example"
                className="mb-3"
                fill
            >
                <Tab eventKey="transporting-material" title="Transporting Material">
                    <TransportingMaterials />
                </Tab>
                <Tab eventKey="destinations" title="Points/Destinations">
                    <Destinations />
                </Tab>
                <Tab eventKey="challan-collection-center" title="Challan Collection Center">
                    <ChallanCollectionCenter />
                </Tab>
                <Tab eventKey="field-staff-expenditure" title="Field Staff Expenditure">
                    <FieldStaffExpenditure />
                </Tab>
                <Tab eventKey="filling-station" title="Filling Station">
                    <FillingStation />
                </Tab>
            </Tabs>

        </div>

    )
}

export default PreInformation
