import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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

    // Button styles
    const deleteButtonStyle = {
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        color: '#F44336',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid rgba(244, 67, 54, 0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: 'rgba(244, 67, 54, 0.4)'
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [usersRes, donationsRes, requestsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/admin/users", { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }),
                    axios.get("http://localhost:5000/api/donations/history", { 
                        headers: { Authorization: `Bearer ${token}` } 
                    }), 
                    axios.get("http://localhost:5000/api/requests", { 
                        headers: { Authorization: `Bearer ${token}` } 
                    })
                ]);

                setUsers(usersRes.data);
                setDonations(donationsRes.data);
                setRequests(requestsRes.data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleDeleteRequest = async (id) => {
        if (!window.confirm("Are you sure you want to delete this request?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/requests/${id}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setRequests(requests.filter(req => req._id !== id));
        } catch (error) {
            console.error("Error deleting request:", error);
            alert("Failed to delete request");
        }
    };

    const handleDeleteDonation = async (id) => {
        if (!window.confirm("Are you sure you want to delete this donation?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/donations/${id}`, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setDonations(donations.filter(donation => donation._id !== id));
        } catch (error) {
            console.error("Error deleting donation:", error);
            alert("Failed to delete donation");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`, { 
                headers: { Authorization: `Bearer ${token}` } 
            });
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user");
        }
    };

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
                    Admin Dashboard
                </motion.h2>

                {/* Users Card */}
                <motion.div
                    style={cardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <h3 style={{ color: '#64ffda', marginBottom: '1.5rem' }}>Users</h3>
                    
                    {isLoading ? (
                        <p style={{ color: 'white', textAlign: 'center' }}>Loading users...</p>
                    ) : users.length === 0 ? (
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>No users found.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Name</th>
                                        <th style={thStyle}>Email</th>
                                        <th style={thStyle}>Role</th>
                                        <th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <motion.tr 
                                            key={user._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td style={tdStyle}>{user.name}</td>
                                            <td style={tdStyle}>{user.email}</td>
                                            <td style={{
                                                ...tdStyle,
                                                color: user.role === 'admin' ? '#4CAF50' : 
                                                      user.role === 'volunteer' ? '#2196F3' : '#FFC107'
                                            }}>
                                                {user.role}
                                            </td>
                                            <td style={tdStyle}>
                                                <motion.button
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    style={deleteButtonStyle}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Delete
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Donations Card */}
                <motion.div
                    style={cardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h3 style={{ color: '#64ffda', marginBottom: '1.5rem' }}>Donations</h3>
                    
                    {isLoading ? (
                        <p style={{ color: 'white', textAlign: 'center' }}>Loading donations...</p>
                    ) : donations.length === 0 ? (
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>No donations available.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Food Item</th>
                                        <th style={thStyle}>Quantity</th>
                                        <th style={thStyle}>Location</th>
                                        <th style={thStyle}>Donor</th>
                                        <th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donations.map(donation => (
                                        <motion.tr 
                                            key={donation._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td style={tdStyle}>{donation.foodItem}</td>
                                            <td style={tdStyle}>{donation.quantity} meals</td>
                                            <td style={tdStyle}>{donation.pickupLocation}</td>
                                            <td style={tdStyle}>{donation.donor?.name || "Unknown"}</td>
                                            <td style={tdStyle}>
                                                <motion.button
                                                    onClick={() => handleDeleteDonation(donation._id)}
                                                    style={deleteButtonStyle}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Delete
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Requests Card */}
                <motion.div
                    style={cardStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h3 style={{ color: '#64ffda', marginBottom: '1.5rem' }}>Requests</h3>
                    
                    {isLoading ? (
                        <p style={{ color: 'white', textAlign: 'center' }}>Loading requests...</p>
                    ) : requests.length === 0 ? (
                        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>No food requests found.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={thStyle}>Food Item</th>
                                        <th style={thStyle}>Quantity Needed</th>
                                        <th style={thStyle}>Beneficiary</th>
                                        <th style={thStyle}>Status</th>
                                        <th style={thStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map(request => (
                                        <motion.tr 
                                            key={request._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td style={tdStyle}>{request.foodItem}</td>
                                            <td style={tdStyle}>{request.quantityNeeded} meals</td>
                                            <td style={tdStyle}>{request.beneficiary?.name || "Unknown"}</td>
                                            <td style={{
                                                ...tdStyle,
                                                color: request.status === 'completed' ? '#4CAF50' : 
                                                      request.status === 'pending' ? '#FFC107' : '#F44336'
                                            }}>
                                                {request.status}
                                            </td>
                                            <td style={tdStyle}>
                                                <motion.button
                                                    onClick={() => handleDeleteRequest(request._id)}
                                                    style={deleteButtonStyle}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Delete
                                                </motion.button>
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

export default AdminDashboard;