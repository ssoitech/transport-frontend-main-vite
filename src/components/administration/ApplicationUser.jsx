import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useApiQuery, useApiMutation } from "../../hooks/api/useApiQuery";
import ReusableForm from "../../components/reusable/ReusableForm";
import ReusableInput from "../../components/reusable/ReusableInput";
import ReusableSelect from "../../components/reusable/ReusableSelect";
import ReusableButton from "../../components/reusable/ReusableButton";
import ReusableTable from "../../components/reusable/ReusableTable";
// import other reusable components as needed

/**
 * ApplicationUser - World-class, robust, maintainable user management component
 * - Uses reusable components for form, input, select, button, and table
 * - API logic separated using generic React Query hooks (SOLID/DRY)
 * - No Redux or direct axios logic
 * - Detailed comments for major functionality
 */
function ApplicationUser() {
  // React Hook Form for form state management
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const [isAdmin, setIsAdmin] = useState(false);
  const role = watch("role");

  // Fetch users using generic useApiQuery hook
  const { data: users = [], refetch: refetchUsers } = useApiQuery({
    key: "users",
    url: "/api/v1/get-all-users-without-pass",
    method: "get",
  });

  // Mutation for user registration
  const { mutate: registerUser, isLoading: isRegistering } = useApiMutation({
    key: "registerUser",
    url: "/api/auth/user/register",
    method: "post",
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User data has been saved successfully.",
        confirmButtonText: "OK",
      });
      reset();
      refetchUsers();
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error saving user data. Please try again.",
        confirmButtonText: "OK",
      });
    },
  });

  // Handle role change and set admin state
  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setIsAdmin(selectedRole === "ADMIN");
    const checkboxes = [
      "Administrator",
      "AlterBankAccount",
      "SetupApplication",
      "ChallanInput",
      "ChallanReceived",
      "ChallanPayment",
      "HSDRegister",
      "Billing",
      "CanChangeRate",
      "Query",
      "Report",
      "DuplicateVoucher",
      "ChallanDetails",
      "ReceivedChallan",
      "PaidChallan",
    ];
    checkboxes.forEach((checkbox) => {
      setValue(checkbox, selectedRole === "ADMIN");
    });
  };

  // Handle form submit using mutation
  const onSubmit = (data) => {
    const registerCriteria = {
      user: {
        username: data.loginName,
        password: data.password,
        email: data.email,
        name: data.name,
        role: data.role,
      },
      userAccess: {
        username: data.loginName,
        role: data.role,
        administratorAccess: data.Administrator ? "Y" : "N",
        challanReceivedAccess: data.ChallanReceived ? "Y" : "N",
        canChangeRateAccess: data.CanChangeRate ? "Y" : "N",
        alterBankAccountAccess: data.AlterBankAccount ? "Y" : "N",
        challanPaymentAccess: data.ChallanPayment ? "Y" : "N",
        queryAccess: data.Query ? "Y" : "N",
        setupApplicationAccess: data.SetupApplication ? "Y" : "N",
        hsdRegisterAccess: data.HSDRegister ? "Y" : "N",
        reportAccess: data.Report ? "Y" : "N",
        challanInputAccess: data.ChallanInput ? "Y" : "N",
        billingAccess: data.Billing ? "Y" : "N",
        duplicateVoucherAccess: data.DuplicateVoucher ? "Y" : "N",
        challanDetailsAlterOrDeleteAccess: data.ChallanDetails ? "Y" : "N",
        receivedChallanAlterOrDeleteAccess: data.ReceivedChallan ? "Y" : "N",
        paidChallanAlterOrDeleteAccess: data.PaidChallan ? "Y" : "N",
      },
    };
    registerUser(registerCriteria);
  };

  // Clear form and admin state
  const handleClear = () => {
    reset();
    setIsAdmin(false);
  };

  // Table columns for ReusableTable
  const columns = [
    { header: "Edit", accessor: "edit" },
    { header: "Joining Date", accessor: "joiningDate" },
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Login Name", accessor: "username" },
  ];

  // Render row for ReusableTable
  const renderRow = (row) => (
    <tr key={row.id}>
      <td className="text-center">
        <FaEdit style={{ cursor: "pointer", color: "blue" }} />
      </td>
      <td>{row.joiningDate}</td>
      <td>{row.name}</td>
      <td>{row.email}</td>
      <td>{row.role}</td>
      <td>{row.username}</td>
    </tr>
  );

  return (
    <div className="work-space-container">
      {/* Header Section */}
      <div
        className="alert alert-primary text-center font-weight-bold text-dark p-1"
        role="alert"
      >
        <span className="mb-0 h6">Application User Maintenance</span>
      </div>

      {/* Form Section */}
      <div className="card mt-4 p-2">
        <ReusableForm onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <div className="form-group col-md-4">
              <ReusableInput
                label="Joining Date"
                name="joiningDate"
                type="date"
                {...register("joiningDate")}
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-4">
              <ReusableInput
                label="Name"
                name="name"
                {...register("name")}
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
            <div className="form-group col-md-4">
              <ReusableInput
                label="Email"
                name="email"
                type="email"
                {...register("email")}
                className="form-control form-control-sm border-dark-subtle"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-4">
              <ReusableSelect
                label={
                  <span>
                    Role <span className="text-danger">*</span>
                  </span>
                }
                name="role"
                options={[
                  { value: "", label: "Select Role" },
                  { value: "USER", label: "USER" },
                  { value: "ADMIN", label: "ADMIN" },
                ]}
                value={role}
                onChange={handleRoleChange}
                className="form-control form-control-sm border-dark-subtle"
                {...register("role", { required: "Role is required" })}
              />
              {errors.role && (
                <small className="text-danger">{errors.role.message}</small>
              )}
            </div>
            <div className="form-group col-md-4">
              <ReusableInput
                label={
                  <span>
                    Login Name <span className="text-danger">*</span>
                  </span>
                }
                name="loginName"
                {...register("loginName", {
                  required: "Login Name is required",
                })}
                className="form-control form-control-sm border-dark-subtle"
              />
              {errors.loginName && (
                <small className="text-danger">
                  {errors.loginName.message}
                </small>
              )}
            </div>
            <div className="form-group col-md-4">
              <ReusableInput
                label={
                  <span>
                    Password <span className="text-danger">*</span>
                  </span>
                }
                name="password"
                type="password"
                {...register("password", { required: "Password is required" })}
                className="form-control form-control-sm border-dark-subtle"
              />
              {errors.password && (
                <small className="text-danger">{errors.password.message}</small>
              )}
            </div>
          </div>
          {/* Access Control Section */}
          <h6>Access Control</h6>
          <div
            className="card pt-4 pl-4 pr-4 mb-2"
            style={{ backgroundColor: "#F6E9B2" }}
          >
            <div className="row">
              {[
                "Administrator",
                "AlterBankAccount",
                "SetupApplication",
                "ChallanInput",
                "ChallanReceived",
                "ChallanPayment",
                "HSDRegister",
                "Billing",
                "CanChangeRate",
                "Query",
                "Report",
                "DuplicateVoucher",
              ].map((checkbox, index) => (
                <div key={index} className="col-md-4 mb-2">
                  <div className="form-check">
                    <ReusableInput
                      type="checkbox"
                      name={checkbox}
                      {...register(checkbox)}
                      disabled={isAdmin}
                      className="form-check-input border-dark-subtle"
                    />
                    <label className="form-check-label" htmlFor={checkbox}>
                      {checkbox.replace(/([A-Z])/g, " $1").trim()}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Alter / Delete Options Section */}
          <h6>Alter / Delete Options</h6>
          <div
            className="card pt-3 pl-4 pr-4 mb-2"
            style={{ backgroundColor: "#FFC5C5" }}
          >
            <div className="row">
              {["ChallanDetails", "ReceivedChallan", "PaidChallan"].map(
                (checkbox, index) => (
                  <div key={index} className="col-md-4 mb-2">
                    <div className="form-check">
                      <ReusableInput
                        type="checkbox"
                        name={checkbox}
                        {...register(checkbox)}
                        disabled={isAdmin}
                        className="form-check-input border-dark-subtle"
                      />
                      <label className="form-check-label" htmlFor={checkbox}>
                        {checkbox.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-12">
              <ReusableButton
                type="submit"
                className="btn btn-primary m-2"
                ariaLabel="Save"
                disabled={isRegistering}
              >
                Save
              </ReusableButton>
              <ReusableButton
                type="button"
                className="btn btn-secondary m-2"
                ariaLabel="Clear"
                onClick={handleClear}
              >
                Clear
              </ReusableButton>
              <ReusableButton
                type="button"
                className="btn btn-danger m-2"
                ariaLabel="Delete"
              >
                Delete
              </ReusableButton>
              <ReusableButton
                type="button"
                className="btn btn-success m-2"
                ariaLabel="New"
              >
                New
              </ReusableButton>
            </div>
          </div>
        </ReusableForm>
      </div>

      {/* Users List Section */}
      <div className="mt-4">
        <h6>Users List</h6>
        <div className="table-responsive">
          <ReusableTable
            columns={columns}
            data={users}
            renderRow={renderRow}
            className="table table-bordered table-hover"
            ariaLabel="Users Table"
          />
        </div>
      </div>
    </div>
  );
}

export default ApplicationUser;
