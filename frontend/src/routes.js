import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Home1 from "./pages/Home1";  // ✅ Show before login
import Login from "./pages/Login";
import Register from "./pages/Register";
import Donate from "./pages/Donate";
import Requests from "./pages/Requests";  // ✅ Restricted Page
import RequestFood from "./pages/RequestFood";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyDelivery from "./pages/VerifyDelivery";
import VerifyOTP from "./pages/VerifyOTP";  // ✅ Import OTP Page
import Profile from "./pages/Profile1";
import ProtectedRoute from "./components/ProtectedRoute";  // ✅ Import ProtectedRoute

const AppRoutes = () => {
    const user = JSON.parse(localStorage.getItem("user")); // ✅ Check if user is logged in

    return (
        <Routes>
            {/* ✅ If user is NOT logged in, show Home1.js */}
            <Route path="/" element={user ? <Home /> : <Home1 />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/request-food" element={<RequestFood />} />
            <Route path="/verify-delivery" element={<VerifyDelivery />} />
            <Route path="/verify-delivery/:requestId" element={<VerifyOTP />} /> {/* ✅ Add OTP Page Route */}
            <Route path="/profile" element={<Profile />} />

            {/* ✅ Restrict "Requests" Page to Admins Only */}
            <Route path="/requests" element={<ProtectedRoute allowedRoles={["admin"]}><Requests /></ProtectedRoute>} />

            {/* ✅ Admin Dashboard (Only for Admins) */}
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        </Routes>
    );
};

export default AppRoutes;
