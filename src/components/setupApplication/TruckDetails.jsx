import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalExportConsigneeMaster from './modals/ModalExportConsigneeMaster';
import { BaseUrl } from '../../services/BaseURI';
import Swal from "sweetalert2";
import { useForm, Controller } from 'react-hook-form';
import AutoComplete from '../searchComponent/AutoComplete';
import toast from 'react-hot-toast';
import DisplayTruckListTable from './truckSections/DisplayTruckListTable';
import { Tab, Tabs } from 'react-bootstrap';
import AddNewTruck from './truckSections/AddNewTruck';
import TruckList from './truckSections/TruckList';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TruckDetailsList from './truckSection/TruckDetailsList';

const defaultOptions = [
    { name: '', label: 'loading..' },
];
function TruckDetails() {
    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const [searchedOwnerData, setSearchedOwnerData] = useState();

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
                <span className='mb-0 h6'>Truck Details</span>
            </div>

            <div>
                <Tabs
                    defaultActiveKey="add-new-truck"
                    id="fill-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="add-new-truck" title="Add New Truck">
                        <AddNewTruck />
                    </Tab>

                    <Tab eventKey="truck-table" title="All Truck Details">
                        <TruckDetailsList />
                    </Tab>

                </Tabs>

            </div>

        </div>
    )
}

export default TruckDetails;
