import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

/**
 * PrivateRoute protects routes that require authentication.
 * @param {object} props
 * @param {React.ComponentType} props.element - The component to render
 * @param {React.ComponentType} [props.layout] - Optional layout component
 * @returns {JSX.Element}
 */
const PrivateRoute = ({ element: Element, layout: Layout, ...rest }) => {
  const token = Cookies.get("token");
  if (token) {
    if (Layout) {
      return (
        <Layout>
          <Element {...rest} />
        </Layout>
      );
    }
    return <Element {...rest} />;
  }
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
