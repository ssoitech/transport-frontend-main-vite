import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../services/AuthContext";
import ReusableCard from "../components/reusable/ReusableCard";
import ReusableForm from "../components/reusable/ReusableForm";
import ReusableInput from "../components/reusable/ReusableInput";
import ReusableButton from "../components/reusable/ReusableButton";
import ReusableSelect from "../components/reusable/ReusableSelect";
import ReusableLoader from "../components/reusable/ReusableLoader";
import ReusableToast from "../components/reusable/ReusableToast";
import Cookies from "js-cookie";
      <ReusableCard
        className="shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
          borderRadius: "16px",
          background: "#fff",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
        }}
      >
        <h3 className="card-title text-center mb-4">Login</h3>
        <ReusableForm onSubmit={handleSubmit}>
          <ReusableInput
            label="User Name"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mb-3 border-dark-subtle"
            style={{ borderRadius: "6px", fontSize: "1.1rem" }}
          />
          <ReusableInput
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-3 border-dark-subtle"
            style={{ borderRadius: "6px", fontSize: "1.1rem" }}
          />
          <ReusableSelect
            label="Financial Year"
            id="financialYear"
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            options={financialYears.map((year) => ({ value: year, label: year }))}
            className="mb-3 border-dark-subtle"
            style={{ borderRadius: "6px", fontSize: "1.1rem" }}
          />
          <ReusableButton
            type="submit"
            className="w-100"
            style={{
              background: "#4267f4",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.2rem",
              borderRadius: "8px",
              padding: "0.75rem 0",
              marginTop: "1.5rem",
              border: "none",
              boxShadow: "0 2px 8px rgba(66,103,244,0.10)",
            }}
            disabled={loading}
          >
            {loading ? <ReusableLoader text="Logging In ..." /> : "Login"}
          </ReusableButton>
        </ReusableForm>

      </ReusableCard>
    </div>

  // Token check effect
  useEffect(() => {
    const tok = Cookies.get("token");
    if (tok) {
      navigate(-1);
    }
  }, [navigate]);

  useEffect(() => {
    setFinancialYear(getCurrentFinancialYear());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      // const URL = "https://swastik.ssoitech.com/api/auth/user/login";
      const URL = "http://localhost:8081/api/auth/user/login";
      const response = await axios.post(URL, { username, password });

      console.log(response.data);

      if (response.status === 401) {
        setLoading(false);
        toast.error("Invalid Credentials!!");
        setUsername("");
        setPassword("");
        return;
      } else if (response.data.token) {
        console.log(response.data.token);
        // Dispatch the action with access details and token if login is successful
        if (response.data.accessDetails) {
          setLoading(false);
          console.log(response.data.accessDetails);
          const updatedAccessDetails = {
            ...response.data.accessDetails, // Keep all existing data
            currentFinancialYear: financialYear, // Add the new field
          };
          login(response.data.token);
        }
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("Something Went Wrong!");
        setUsername("");
        setPassword("");
        return;
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.status === 401) {
        toast.error("Invalid Credentials!!");
        setUsername("");
        setPassword("");
        return;
      } else {
        toast.error("Invalid Credentials!!", {
          position: "bottom-center",
          style: {
            background: "#A02334",
            color: "#fff",
          },
        });
        setUsername("");
        setPassword("");
        return;
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        background:
          "linear-gradient(90deg, rgba(7,124,118,1) 0%, rgba(31,204,178,1) 38%, rgba(215,248,255,1) 96%)",
      }}
    >
      {/* Logo in the top-left corner */}
      <img
        src="/ssoi_logo.png"
        alt="Logo"
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: "50px",
          top: "20px",
          left: "20px",
          height: "70px",
          width: "auto",
        }}
      />
      <ReusableCard
        className="p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="card-title text-center mb-4">Login</h3>
        <ReusableForm onSubmit={handleSubmit}>
          <ReusableInput
            label="User Name"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mb-3 border-dark-subtle"
          />
          <ReusableInput
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-3 border-dark-subtle"
          />
          <ReusableSelect
            label="Financial Year"
            id="financialYear"
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            options={financialYears.map((year) => ({
              value: year,
              label: year,
            }))}
            className="mb-3 border-dark-subtle"
          />

          <ReusableButton
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? <ReusableLoader text="Logging In ..." /> : "Login"}
          </ReusableButton>
        </ReusableForm>
      </ReusableCard>
      {/* Toast notification for errors */}
      {/* <ReusableToast message={errorMessage} type="error" onClose={...} /> */}
    </div>
  );
};

export default Login;
