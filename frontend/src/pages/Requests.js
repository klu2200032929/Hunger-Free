import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    // Glass card styling
    const cardStyle = {
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        padding: "1.5rem",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "all 0.3s ease"
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get("http://localhost:5000/api/requests", {
                    headers: { "Content-Type": "application/json" }
                });

                setRequests(response.data);
            } catch (error) {
                console.error("Error fetching requests:", error);
                setError(error.response?.data?.message || "Failed to load requests. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // Ensure requestStatus is correctly used instead of status
    const filteredRequests = filter === "all"
        ? requests
        : requests.filter(request => request.requestStatus?.toLowerCase() === filter);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "completed": return "#4CAF50";
            case "pending": return "#FFC107";
            case "rejected": return "#F44336";
            default: return "#9E9E9E";
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            padding: "2rem",
            background: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') no-repeat center center/cover"
        }}>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ maxWidth: "1200px", margin: "0 auto" }}
            >
                <motion.h2
                    style={{
                        fontSize: "2rem",
                        fontWeight: "700",
                        color: "white",
                        marginBottom: "2rem",
                        textShadow: "0 2px 4px rgba(0,0,0,0.3)"
                    }}
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                >
                    Food Requests
                </motion.h2>

                {/* Status Filter */}
                <motion.div 
                    style={{ 
                        display: "flex", 
                        gap: "1rem", 
                        marginBottom: "2rem",
                        ...cardStyle,
                        padding: "1rem"
                    }}
                >
                    {["all", "pending", "completed", "rejected"].map((status) => (
                        <motion.button
                            key={status}
                            onClick={() => setFilter(status)}
                            style={{
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
                                border: "none",
                                background: filter === status ? "rgba(100, 255, 218, 0.3)" : "transparent",
                                color: "white",
                                cursor: "pointer",
                                textTransform: "capitalize"
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {status}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Loading State */}
                {isLoading && (
                    <motion.div 
                        style={{ ...cardStyle, textAlign: "center", padding: "2rem" }}
                    >
                        <p>Loading requests...</p>
                    </motion.div>
                )}

                {/* Requests Grid */}
                {!isLoading && (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: "1.5rem"
                    }}>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((request, index) => (
                                <motion.div
                                    key={request._id}
                                    style={cardStyle}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    whileHover={{ transform: "translateY(-5px)", boxShadow: "0 12px 20px rgba(0, 0, 0, 0.3)" }}
                                >
                                    <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "#64ffda" }}>
                                        {request.foodItem}
                                    </h3>
                                    <p><strong>Quantity Needed:</strong> {request.quantityNeeded} meals</p>
                                    <p><strong>Beneficiary:</strong> {request.beneficiary?.name || "Unknown"}</p>
                                    <p>
                                        <strong>Status:</strong> 
                                        <span style={{ color: getStatusColor(request.requestStatus), fontWeight: "600" }}>
                                            {request.requestStatus}
                                        </span>
                                    </p>
                                </motion.div>
                            ))
                        ) : (
                            <p>No {filter} food requests available.</p>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Requests;
