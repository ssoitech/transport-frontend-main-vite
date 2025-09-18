import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const tok = Cookies.get("token");


    if (tok) {

        return <Navigate to="/work-space" />

    } else {
        return <Navigate to="/login" />;
    }
}

export default Home;
