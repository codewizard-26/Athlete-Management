import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * RoleProtectedRoute component
 * Restricts page access based on the user's role (e.g. athlete, organization, team).
 * - Redirects to /login if the user is not authenticated.
 * - Redirects to the homepage (/) if the user's role does not match the allowed role.
 */
const RoleProtectedRoute = ({ allowedRole, children }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    // If user is not logged in, redirect to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If user's role does not match the allowedRole, redirect to the homepage
    if (user?.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    // Render children if role matches
    return children;
};

export default RoleProtectedRoute;
