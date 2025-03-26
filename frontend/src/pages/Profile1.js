import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [message, setMessage] = useState("");
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const token = localStorage.getItem("token");

    // Container styles
    const containerStyle = {
        minHeight: 'calc(100vh - 60px)',
        padding: '2rem',
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), 
                    url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') no-repeat center center/cover`,
        marginTop: '-1rem'
    };

    // Card styles
    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        marginBottom: '2rem'
    };

    // Input styles
    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '8px',
        marginBottom: '1rem',
        outline: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        color: 'white',
        transition: 'all 0.3s ease'
    };

    // Button styles
    const buttonStyle = {
        width: '100%',
        padding: '14px',
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '1rem',
        transition: 'all 0.3s ease'
    };

    // Table styles
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '1rem 0'
    };

    const thStyle = {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#64ffda'
    };

    const tdStyle = {
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            setUserName(storedUser.name);
            setUserEmail(storedUser.email);
        }
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.put(
                "http://localhost:5000/api/users/profile",
                { name: userName, email: userEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("✅ Profile updated successfully!");
            localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
            setMessage("❌ Failed to update profile.");
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(""), 3000);
        }
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setIsLoading(true);
                const [donationsRes, requestsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/donations/history", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get("http://localhost:5000/api/requests/my-requests", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const userDonations = donationsRes.data.filter(
                    (donation) => donation.donor._id === user?._id
                );

                setDonations(userDonations);
                setRequests(requestsRes.data);
            } catch (error) {
                console.error("Error fetching profile history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) fetchHistory();
    }, [token, user]);

    return (
        <div style={containerStyle}>
            <motion.div
                style={{ maxWidth: '1200px', margin: '0 auto' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.h2
                    style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        marginBottom: '2rem',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    My Profile
                </motion.h2>

                {/* Profile Update Card */}
                <motion.div
                    style={cardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    {message && (
                        <motion.div
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                backgroundColor: message.includes('✅') ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
                                borderLeft: message.includes('✅') ? '4px solid #4CAF50' : '4px solid #F44336'
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {message}
                        </motion.div>
                    )}

                    <motion.form onSubmit={handleUpdate}>
                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            Name:
                        </label>
                        <motion.input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            style={inputStyle}
                            whileFocus={{ scale: 1.02 }}
                        />

                        <label style={{ 
                            display: 'block', 
                            marginBottom: '0.5rem',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            Email:
                        </label>
                        <motion.input
                            type="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            style={inputStyle}
                            whileFocus={{ scale: 1.02 }}
                        />

                        <motion.button
                            type="submit"
                            style={{
                                ...buttonStyle,
                                ...(isLoading && {
                                    opacity: 0.7,
                                    cursor: 'not-allowed',
                                    ':hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                        transform: 'none',
                                        boxShadow: 'none'
                                    }
                                })
                            }}
                            whileHover={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.35)',
                                transform: 'translateY(-3px)',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                            }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                        >
                            {isLoading ? "🔄 Updating..." : "Update Profile"}
                        </motion.button>
                    </motion.form>
                </motion.div>

                {/* Donations History Card */}
                <motion.div
                    style={cardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h3 style={{ color: '#64ffda', marginBottom: '1.5rem' }}>My Donations History</h3>
                    
                    {isLoading ? (
                        <p style={{ color: 'white', textAlign: 'center' }}>Loading donations...</p>
                    ) : donations.length === 0 ? (
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>No donations made yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Food Item</th>
                                        <th style={thStyle}>Quantity</th>
                                        <th style={thStyle}>Pickup Location</th>
                                        <th style={thStyle}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map((donation) => (
                                        <motion.tr 
                                            key={donation._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td style={tdStyle}>{donation.foodItem}</td>
                                            <td style={tdStyle}>{donation.quantity} meals</td>
                                            <td style={tdStyle}>{donation.pickupLocation}</td>
                                            <td style={tdStyle}>
                                                {new Date(donation.createdAt).toLocaleDateString()}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Requests History Card */}
                <motion.div
                    style={cardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h3 style={{ color: '#64ffda', marginBottom: '1.5rem' }}>My Food Requests</h3>
                    
                    {isLoading ? (
                        <p style={{ color: 'white', textAlign: 'center' }}>Loading requests...</p>
                    ) : requests.length === 0 ? (
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>No food requests made yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Food Item</th>
                                        <th style={thStyle}>Quantity Needed</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request) => (
                                        <motion.tr 
                                            key={request._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td style={tdStyle}>{request.foodItem}</td>
                                            <td style={tdStyle}>{request.quantityNeeded} meals</td>
                                            <td style={{
                                                ...tdStyle,
                                                color: request.status === 'completed' ? '#4CAF50' : 
                                                      request.status === 'pending' ? '#FFC107' : '#F44336'
                                            }}>
                                                {request.status}
                                            </td>
                                            <td style={tdStyle}>
                                                {new Date(request.createdAt).toLocaleDateString()}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Profile;