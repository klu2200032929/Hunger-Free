import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyDelivery = () => {
    const [requests, setRequests] = useState([]); // ✅ Store pending requests
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    // ✅ Fetch Pending Requests for Volunteers
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get("https://hunger-free-backend.onrender.com/api/requests/pending", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRequests(response.data);
            } catch (error) {
                console.error("❌ Error fetching requests:", error);
                setMessage("❌ Failed to load pending requests.");
            }
        };

        fetchRequests();
    }, [token]);

    return (
        <main className="container">
            <h2>Verify Delivery</h2>

            {message && <p style={{ color: "red" }}>{message}</p>}

            {requests.length === 0 ? (
                <p>No pending deliveries available.</p>
            ) : (
                <div className="grid">
                    {requests.map((req) => (
                        <article key={req._id}>
                            <h3>{req.foodItem}</h3>
                            <p><strong>Beneficiary:</strong> {req.beneficiary?.name || "Unknown"}</p>
                            <p><strong>Quantity Needed:</strong> {req.quantityNeeded}</p>
                            
                            {/* ✅ Button to enter OTP */}
                            <button onClick={() => navigate(`/verify-delivery/${req._id}`)}>
                                Enter OTP
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
};

export default VerifyDelivery;
