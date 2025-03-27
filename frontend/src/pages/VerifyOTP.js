import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const VerifyOTP = () => {
    const { requestId } = useParams(); // ✅ Get request ID from URL
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "https://hunger-free-backend.onrender.com/api/requests/verify-otp",
                { requestId, otp },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("✅ Delivery verified successfully!");
            setTimeout(() => navigate("/verify-delivery"), 2000);
        } catch (error) {
            setMessage("❌ Invalid OTP. Try again.");
        }
    };

    return (
        <main className="container">
            <h2>Enter OTP for Verification</h2>
            {message && <p style={{ color: message.includes("❌") ? "red" : "green" }}>{message}</p>}
            <form onSubmit={handleVerify} className="grid">
                <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                <button type="submit">Verify OTP</button>
            </form>
        </main>
    );
};

export default VerifyOTP;
