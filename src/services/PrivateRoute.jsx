import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const PrivateRoute = ({ element: Element, layout: Layout, ...rest }) => {

    const tok = Cookies.get("token");

    if (tok) {
        return Layout ? (
            <Layout>
                <Element {...rest} />
            </Layout>
        ) : (
            <Element {...rest} />
        )
    } else {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;
