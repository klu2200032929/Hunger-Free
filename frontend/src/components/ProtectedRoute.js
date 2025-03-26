import React from "react";
import { Navigate } from "react-router-dom";

// ✅ Function to restrict access based on user roles
const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🛑 Redirect to home if user is not logged in or does not have the required role
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
