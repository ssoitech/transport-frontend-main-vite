import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsernameFromJwt } from './JwtUtils';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';

// Create a context for authentication
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location (route)

    useEffect(() => {
        // Check if the user is authenticated on component mount
        const token = Cookies.get('token');
        console.log("hello from authcontext");
        if (token) {
            setIsAuthenticated(true);
            setUsername(getUsernameFromJwt(token));
        } else {
            setIsAuthenticated(false);
            setUsername(null);
        }
    }, [location, navigate]);

    const login = (token) => {

        Cookies.set('token', token, {
            expires: 1, // expires in 1 days
            secure: false, // ensures the cookie is sent only over HTTPS
            httpOnly: false, // prevents JavaScript access (Note: HttpOnly can only be set server-side)
            sameSite: 'Lax', // mitigates CSRF attacks
        });
        setIsAuthenticated(true);
        setUsername(getUsernameFromJwt(token));
        navigate('/work-space'); // Redirect after login
    };

    const logout = () => {

        Cookies.remove('token');
        setIsAuthenticated(false);
        setUsername(null);
        window.location.href = '/login'; // Redirect after logout
    };


    return (
        <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
// export const useAuth = () => useContext(AuthContext);
