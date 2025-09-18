import React, { useState, useEffect, useContext } from 'react';
import '../css/login.css';
import axios from 'axios';
import { BaseUrl } from '../services/BaseURI';
import { toast, Toaster } from 'react-hot-toast';
import { AuthContext } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAccessDetails } from '../redux/accessSlice';


import Cookies from 'js-cookie';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [financialYear, setFinancialYear] = useState('');
  const startYear = 2022; // The starting year of the financial year range

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  // Get the current financial year
  const getCurrentFinancialYear = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // January is 0
    const currentYear = currentDate.getFullYear();
    return currentMonth >= 4 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;
  };

  // Generate financial years from 2022 to the current financial year
  const generateFinancialYears = () => {
    const financialYears = [];
    const currentFinancialYear = getCurrentFinancialYear();
    const [start, end] = currentFinancialYear.split('-').map(Number);

    for (let year = startYear; year <= start; year++) {
      financialYears.push(`${year}-${year + 1}`);
    }

    // Reverse the array to show the most recent year first
    return financialYears.reverse();
  };

  const financialYears = generateFinancialYears();
  const currentFinancialYear = getCurrentFinancialYear();


  useEffect(() => {
    const tok = Cookies.get("token");
    if (tok) {
      navigate(-1);
    }

  }, [])

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
        setUsername('');
        setPassword('');
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
          dispatch(setAccessDetails(updatedAccessDetails));
          login(response.data.token);
        }
        setLoading(false);
      } else {
        setLoading(false);
        toast.error("Something Went Wrong!");
        setUsername('');
        setPassword('');
        return;
      }

    } catch (error) {
      setLoading(false);
      console.log(error);
      if (error.status === 401) {
        toast.error("Invalid Credentials!!");
        setUsername('');
        setPassword('');
        return;
      } else {
        toast.error("Invalid Credentials!!", {
          position: "bottom-center",
          style: {
            background: "#A02334",
            color: "#fff",
          }
        });
        setUsername('');
        setPassword('');
        return;
      }
    }

  };


  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        margin: 0, // No margin
        padding: 0, // No padding
        boxSizing: 'border-box', // Ensure consistent box-sizing
        background: 'linear-gradient(90deg, rgba(7,124,118,1) 0%, rgba(31,204,178,1) 38%, rgba(215,248,255,1) 96%)',
      }}
    >

      {/* Logo in the top-left corner */}
      <img
        src="/ssoi_logo.png"
        alt="Logo"
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          borderRadius: '50px',
          top: '20px', // Distance from the top edge
          left: '20px', // Distance from the left edge
          height: '70px', // Adjust logo height
          width: 'auto', // Maintain aspect ratio
        }}
      />


      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h3 className="card-title text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">User Name</label>
            <input
              type="text"
              className="form-control border-dark-subtle"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control border-dark-subtle"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="financialYear">Financial Year</label>

            <select
              id="financialYear"
              className="form-select form-control border-dark-subtle"
              defaultValue={currentFinancialYear} // Set default value to current financial year
              onChange={(e) => setFinancialYear(e.target.value)}
            >
              {financialYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>


          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Logging In ...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>

      <Toaster
        position="bottom-center"
        reverseOrder={true}
      />
    </div>
  );
};

export default Login;
