import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * ProtectedRoute component
 * Ensures that the user is logged in before rendering the children components.
 * If not authenticated, redirects the user to the /login page.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);

    // If user is not authenticated, redirect to /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render children if authenticated
    return children;
};

export default ProtectedRoute;
