import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const RequestFood = () => {
    const [foodItem, setFoodItem] = useState("");
    const [quantityNeeded, setQuantityNeeded] = useState("");
    const [availableDonations, setAvailableDonations] = useState([]);
    const [otp, setOtp] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Container styles
    const containerStyle = {
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), 
                    url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') no-repeat center center/cover`,
        padding: '20px',
        marginTop: '-1rem'
    };

    // Form container styles
    const formContainerStyle = {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '0 auto'
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

    // Message styles
    const messageStyle = {
        padding: '12px',
        borderRadius: '8px',
        margin: '1rem 0',
        backgroundColor: message.includes('✅') ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
        borderLeft: message.includes('✅') ? '4px solid #4CAF50' : '4px solid #F44336'
    };

    // OTP display styles
    const otpContainerStyle = {
        background: 'rgba(100, 255, 218, 0.1)',
        border: '1px solid rgba(100, 255, 218, 0.3)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '2rem',
        textAlign: 'center'
    };

    useEffect(() => {
        if (!token) {
            alert("You must be logged in to request food!");
            navigate("/login");
            return;
        }

        setIsLoading(true);
        axios.get("http://localhost:5000/api/donations/")
            .then((response) => {
                setAvailableDonations(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching donations:", error);
                setIsLoading(false);
            });
    }, [token, navigate]);

    const handleRequestFood = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const selectedDonation = availableDonations.find(d => d.foodItem === foodItem);
            if (!selectedDonation) {
                setMessage("❌ Invalid food item selected!");
                setIsLoading(false);
                return;
            }

            if (parseInt(quantityNeeded) > selectedDonation.quantity) {
                setMessage(`❌ You cannot request more than ${selectedDonation.quantity} meals.`);
                setIsLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:5000/api/requests/create", 
                { foodItem, quantityNeeded },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setOtp(response.data.request.otp);
            setMessage("✅ Food Request Submitted! Check your email for the OTP.");
        } catch (error) {
            setMessage("❌ Failed to submit request: " + (error.response?.data?.message || ""));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <motion.div 
                style={formContainerStyle}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <motion.h2
                    style={{ 
                        fontSize: '2rem',
                        fontWeight: '700',
                        marginBottom: '1.5rem',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Request Food
                </motion.h2>

                {message && (
                    <motion.div 
                        style={messageStyle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {message}
                    </motion.div>
                )}

                {isLoading && availableDonations.length === 0 ? (
                    <p style={{ color: 'white' }}>Loading available donations...</p>
                ) : availableDonations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p style={{ color: 'white' }}>No donations available at the moment.</p>
                    </motion.div>
                ) : (
                    <motion.form 
                        onSubmit={handleRequestFood}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label style={{ 
                            display: 'block', 
                            textAlign: 'left',
                            marginBottom: '0.5rem',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            Select Food Item:
                        </label>
                        <motion.select
                            value={foodItem}
                            onChange={(e) => setFoodItem(e.target.value)}
                            required
                            style={{ 
                                ...inputStyle,
                                cursor: 'pointer'
                            }}
                            whileFocus={{ scale: 1.02 }}
                        >
                            <option value="">-- Select a Donation --</option>
                            {availableDonations.map((donation) => (
                                <option key={donation._id} value={donation.foodItem}>
                                    {donation.foodItem} ({donation.quantity} meals available)
                                </option>
                            ))}
                        </motion.select>
                        
                        <label style={{ 
                            display: 'block', 
                            textAlign: 'left',
                            marginBottom: '0.5rem',
                            color: 'rgba(255, 255, 255, 0.8)'
                        }}>
                            Quantity Needed:
                        </label>
                        <motion.input
                            type="number"
                            placeholder="Quantity Needed"
                            value={quantityNeeded}
                            onChange={(e) => setQuantityNeeded(e.target.value)}
                            required
                            min="1"
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
                            {isLoading ? "🔄 Processing..." : "Request Food"}
                        </motion.button>
                    </motion.form>
                )}

                {otp && (
                    <motion.div
                        style={otpContainerStyle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 style={{ color: '#64ffda', marginBottom: '0.5rem' }}>Your OTP Code</h3>
                        <p style={{ 
                            fontSize: '2rem', 
                            fontWeight: 'bold',
                            letterSpacing: '0.5rem',
                            color: '#64ffda',
                            margin: '1rem 0'
                        }}>
                            {otp}
                        </p>
                        <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                            Share this OTP with the volunteer at delivery time.
                        </small>
                    </motion.div>
                )}
            </motion.div>

            {/* Global styles */}
            <style>{`
                select option {
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                }
                input[type="number"]::-webkit-inner-spin-button,
                input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default RequestFood;