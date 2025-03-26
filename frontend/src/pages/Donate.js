import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Donate = () => {
    const [foodItem, setFoodItem] = useState("");
    const [quantity, setQuantity] = useState("");
    const [pickupLocation, setPickupLocation] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    // Redirect user if not logged in
    useEffect(() => {
        if (!token) {
            alert("You must be logged in to donate food!");
            navigate("/login");
        }
    }, [token, navigate]);

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

    const formContainerStyle = {
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '2.5rem',
        width: '90%',
        maxWidth: '450px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        margin: '0 auto'
    };

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

    const messageStyle = {
        padding: '12px',
        borderRadius: '8px',
        margin: '1rem 0',
        backgroundColor: message.includes('✅') ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
        borderLeft: message.includes('✅') ? '4px solid #4CAF50' : '4px solid #F44336'
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate quantity
        if (quantity <= 0 || isNaN(quantity)) {
            setMessage("❌ Quantity must be a positive number!");
            setIsLoading(false);
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/api/donations/create",
                { foodItem, quantity, pickupLocation },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("✅ Donation Created Successfully!");
            setFoodItem("");
            setQuantity("");
            setPickupLocation("");
        } catch (error) {
            setMessage("❌ Failed to donate food. " + (error.response?.data?.message || ""));
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
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Donate Food
                </motion.h2>
                
                {message && (
                    <motion.div 
                        style={messageStyle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {message}
                    </motion.div>
                )}

                <motion.form onSubmit={handleDonate}>
                    <motion.input 
                        type="text" 
                        placeholder="Food Item" 
                        value={foodItem}
                        onChange={(e) => setFoodItem(e.target.value)} 
                        required
                        style={inputStyle}
                        className="donate-input"
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input 
                        type="number" 
                        placeholder="Quantity" 
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)} 
                        required 
                        min="1"
                        style={inputStyle}
                        className="donate-input"
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input 
                        type="text" 
                        placeholder="Pickup Location" 
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)} 
                        required
                        style={inputStyle}
                        className="donate-input"
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
                        {isLoading ? "🔄 Donating..." : "Donate"}
                    </motion.button>
                </motion.form>
            </motion.div>

            {/* Global styles */}
            <style>{`
                .donate-input::placeholder {
                    color: rgba(255, 255, 255, 0.8) !important;
                    opacity: 1 !important;
                }
                .donate-input:focus {
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
                    background-color: rgba(255, 255, 255, 0.25);
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

export default Donate;