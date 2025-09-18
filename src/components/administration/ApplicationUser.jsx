import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa'; // Import an edit icon
import Swal from 'sweetalert2';
import axiosInstance from '../../config/AxiosConfig';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ApplicationUser() {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
    const [users, setUsers] = useState([]); // State to hold users
    const [isAdmin, setIsAdmin] = useState(false);

    const accessDetails = useSelector((state) => state.access.accessDetails);
    const navigate = useNavigate();

    const role = watch('role');

    // Fetch users from the backend
    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get('/api/v1/get-all-users-without-pass');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };
    useEffect(() => {

        fetchUsers();
    }, []);

    const onSubmit = async (data) => {
        try {


            const registerCriteria = {
                user: {
                    "username": data.loginName, // Get username from form data
                    "password": data.password, // Get password from form data
                    "email": data.email,       // Get email from form data
                    "name": data.name,         // Get name from form data
                    "role": data.role,         // Get role from form data
                },
                userAccess: {
                    "username": data.loginName,  // Get username again if needed for access
                    "role": data.role,          // Get role again for access
                    "administratorAccess": data.Administrator ? "Y" : "N",
                    "challanReceivedAccess": data.ChallanReceived ? "Y" : "N",
                    "canChangeRateAccess": data.CanChangeRate ? "Y" : "N",
                    "alterBankAccountAccess": data.AlterBankAccount ? "Y" : "N",
                    "challanPaymentAccess": data.ChallanPayment ? "Y" : "N",
                    "queryAccess": data.Query ? "Y" : "N",
                    "setupApplicationAccess": data.SetupApplication ? "Y" : "N",
                    "hsdRegisterAccess": data.HSDRegister ? "Y" : "N",
                    "reportAccess": data.Report ? "Y" : "N",
                    "challanInputAccess": data.ChallanInput ? "Y" : "N",
                    "billingAccess": data.Billing ? "Y" : "N",
                    "duplicateVoucherAccess": data.DuplicateVoucher ? "Y" : "N",
                    "challanDetailsAlterOrDeleteAccess": data.ChallanDetails ? "Y" : "N",
                    "receivedChallanAlterOrDeleteAccess": data.ReceivedChallan ? "Y" : "N",
                    "paidChallanAlterOrDeleteAccess": data.PaidChallan ? "Y" : "N",
                },
            };

            console.log(registerCriteria);

            // Send the registerCriteria data to the backend API
            const response = await axiosInstance.post('/api/auth/user/register', registerCriteria);

            // Check if the request was successful
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User data has been saved successfully.',
                    confirmButtonText: 'OK'
                });

                // Reset the form and fetch updated user data
                reset();
                fetchUsers();
            }
        } catch (error) {
            console.error("Error saving data", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'There was an error saving user data. Please try again.',
                confirmButtonText: 'OK'
            });
        }
    };

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setIsAdmin(selectedRole === "ADMIN");

        const checkboxes = [
            "Administrator", "AlterBankAccount", "SetupApplication", "ChallanInput",
            "ChallanReceived", "ChallanPayment", "HSDRegister", "Billing",
            "CanChangeRate", "Query", "Report", "DuplicateVoucher", "ChallanDetails",
            "ReceivedChallan", "PaidChallan"
        ];

        checkboxes.forEach((checkbox) => {
            setValue(checkbox, selectedRole === "ADMIN");
        });
    };

    const handleEditClick = async (user) => {
        return;
        try {

            // Set form values
            setValue("joiningDate", user.joiningDate);
            setValue("name", user.name);
            setValue("email", user.email);
            setValue("role", user.role);
            setValue("loginName", user.loginName);

            // Fetch user data by ID
            const userResponse = await axios.get(`/api/v1/get-access/${user.id}`);
            const accessValues = userResponse.data;

            // Set checkbox values based on access data
            Object.keys(accessValues).forEach((key) => {
                setValue(key, accessValues[key]);
            });

            // Set admin state
            setIsAdmin(user.role === "ADMIN");

        } catch (error) {
            console.error("Error fetching user data", error);
        }
    };

    const handleClear = () => {
        reset();
        setIsAdmin(false);
    }

    return (
        <div className="work-space-container">
            <div className="alert alert-primary text-center font-weight-bold text-dark p-1" role="alert">
                <span className='mb-0 h6'>Application User Maintenance</span>
            </div>

            <div className="card mt-4 p-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="joiningDate">Joining Date</label>
                            <input
                                type="date"
                                className="form-control form-control-sm border-dark-subtle"
                                id="joiningDate"
                                {...register("joiningDate")}
                            />
                        </div>

                        <div className="form-group col-md-4">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                id="name"
                                {...register("name")}
                            />
                        </div>

                        <div className="form-group col-md-4">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-control form-control-sm border-dark-subtle"
                                id="email"
                                {...register("email")}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label htmlFor="role">Role <span className="text-danger">*</span></label>
                            <select
                                id="role"
                                className="form-control form-control-sm border-dark-subtle"
                                {...register("role", { required: "Role is required" })}
                                onChange={handleRoleChange}
                            >
                                <option value="">Select Role</option>
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            {errors.role && <small className="text-danger">{errors.role.message}</small>}
                        </div>

                        <div className="form-group col-md-4">
                            <label htmlFor="loginName">Login Name <span className="text-danger">*</span></label>
                            <input
                                type="text"
                                className="form-control form-control-sm border-dark-subtle"
                                id="loginName"
                                {...register("loginName", { required: "Login Name is required" })}
                            />
                            {errors.loginName && <small className="text-danger">{errors.loginName.message}</small>}
                        </div>

                        <div className="form-group col-md-4">
                            <label htmlFor="password">Password <span className="text-danger">*</span></label>
                            <input
                                type="password"
                                className="form-control form-control-sm border-dark-subtle"
                                id="password"
                                {...register("password", { required: "Password is required" })}
                            />
                            {errors.password && <small className="text-danger">{errors.password.message}</small>}
                        </div>
                    </div>

                    <h6>Access Control</h6>
                    <div className="card pt-4 pl-4 pr-4 mb-2" style={{ backgroundColor: "#F6E9B2" }}>
                        <div className="row">
                            {["Administrator", "AlterBankAccount", "SetupApplication", "ChallanInput", "ChallanReceived", "ChallanPayment", "HSDRegister", "Billing", "CanChangeRate", "Query", "Report", "DuplicateVoucher"].map((checkbox, index) => (
                                <div key={index} className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input border-dark-subtle"
                                            type="checkbox"
                                            id={checkbox}
                                            {...register(checkbox)}
                                            disabled={isAdmin}
                                        />
                                        <label className="form-check-label" htmlFor={checkbox}>
                                            {checkbox.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <h6>Alter / Delete Options</h6>
                    <div className="card pt-3 pl-4 pr-4 mb-2" style={{ backgroundColor: "#FFC5C5" }}>
                        <div className="row">
                            {["ChallanDetails", "ReceivedChallan", "PaidChallan"].map((checkbox, index) => (
                                <div key={index} className="col-md-4 mb-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input border-dark-subtle"
                                            type="checkbox"
                                            id={checkbox}
                                            {...register(checkbox)}
                                            disabled={isAdmin}
                                        />
                                        <label className="form-check-label" htmlFor={checkbox}>
                                            {checkbox.replace(/([A-Z])/g, ' $1').trim()}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-12">
                            <button type="submit" className="btn btn-primary m-2" disabled={accessDetails.role !== "ADMIN"}>Save</button>
                            <button type="button" className="btn btn-secondary m-2" onClick={handleClear}>Clear</button>
                            <button type="button" className="btn btn-danger m-2">Delete</button>
                            <button type="button" className="btn btn-success m-2">New</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="mt-4">
                <h6>Users List</h6>
                <div className='table-responsive'>
                    <table className="table table-bordered table-hover">
                        <thead className='table-dark'>
                            <tr className='text-center'>
                                <th className='p-1'>Edit</th>
                                <th className='p-1'>Joining Date</th>
                                <th className='p-1'>Name</th>
                                <th className='p-1'>Email</th>
                                <th className='p-1'>Role</th>
                                <th className='p-1'>Login Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className='text-center'>
                                        <FaEdit
                                            onClick={() => handleEditClick(user)}
                                            style={{ cursor: 'pointer', color: 'blue' }}
                                        />
                                    </td>
                                    <td>{user.joiningDate}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.username}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ApplicationUser;
