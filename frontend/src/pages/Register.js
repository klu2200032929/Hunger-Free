import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("beneficiary");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Container styles
    const containerStyle = {
        minHeight: "100vh", // Ensures full height
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('https://t4.ftcdn.net/jpg/02/32/48/35/240_F_232483527_B9KZazS7LsGexMg0icM1gUNghIcqJDvL.jpg')",
        backgroundSize: "cover", // Ensures full coverage
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed", // Keeps the image fixed while scrolling
        padding: "20px",
        marginTop: "-1rem"
    };
    

    // Form container styles
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

    // Button styles with hover effect
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

    const allowedDomains = ["gmail.com", "outlook.com", "yahoo.com", "icloud.com", "hotmail.com", "aol.com", "protonmail.com"];

    const isValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        if (!emailRegex.test(email)) return false;
        return allowedDomains.includes(email.split("@")[1]);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (!isValidEmail(email)) {
            setMessage("❌ Invalid email! Allowed: Gmail, Yahoo, Outlook, etc.");
            setIsLoading(false);
            return;
        }
        
        try {
            await axios.post("https://hunger-free-backend.onrender.com/api/auth/register", { name, email, password, role });
            setMessage("✅ Registration Successful! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            setMessage("❌ Registration Failed. " + (error.response?.data?.message || ""));
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
                    Create Account
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

                <motion.form onSubmit={handleRegister}>
                    <motion.input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
                        required
                        style={inputStyle}
                        className="register-input"
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                        style={inputStyle}
                        className="register-input"
                        whileFocus={{ scale: 1.02 }}
                    />
                    <motion.input 
                        type="password" 
                        placeholder="Password (min 6 characters)" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        minLength={6}
                        style={inputStyle}
                        className="register-input"
                        whileFocus={{ scale: 1.02 }}
                    />
                    
                    <motion.div 
                        style={{ marginBottom: '1rem', textAlign: 'left' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Role:</label>
                        <motion.select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            required
                            style={{ ...inputStyle, cursor: 'pointer' }}
                            whileFocus={{ scale: 1.02 }}
                        >
                            <option value="donor">Donor</option>
                            <option value="beneficiary">Beneficiary</option>
                            <option value="volunteer">Volunteer</option>
                        </motion.select>
                    </motion.div>

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
                        {isLoading ? "🔄 Registering..." : "Register"}
                    </motion.button>
                </motion.form>
                
                <motion.p 
                    style={{ 
                        marginTop: '1.5rem',
                        fontSize: '0.9rem'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    Already have an account?{' '}
                    <Link to="/login" style={{ 
                        color: '#64b5f6', 
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Login here
                    </Link>
                </motion.p>
            </motion.div>

            {/* Global styles */}
            <style>{`
                .register-input::placeholder {
                    color: rgba(255, 255, 255, 0.8) !important;
                    opacity: 1 !important;
                }
                .register-input:focus {
                    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
                    background-color: rgba(255, 255, 255, 0.25);
                }
                a:hover {
                    text-decoration: underline;
                }
                select option {
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default Register;