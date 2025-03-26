import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const containerStyle = {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: `url('https://t4.ftcdn.net/jpg/02/32/48/35/240_F_232483527_B9KZazS7LsGexMg0icM1gUNghIcqJDvL.jpg') no-repeat center center/cover`,
        padding: '20px'
    };

    const formContainerStyle = {
        background: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white
        borderRadius: '20px',
        padding: '40px',
        width: '100%',
        maxWidth: '450px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)'
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '8px',
        marginBottom: '1rem',
        outline: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        transition: 'all 0.3s ease'
    };

    const buttonStyle = {
        width: '100%',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '1rem',
        transition: '0.3s'
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            setMessage("✅ Login successful! Redirecting...");
            
            setTimeout(() => {
                switch (response.data.user.role) {
                    case "admin":
                        navigate("/admin-dashboard");
                        break;
                    case "volunteer":
                        navigate("/verify-delivery");
                        break;
                    case "beneficiary":
                        navigate("/request-food");
                        break;
                    default:
                        navigate("/");
                        break;
                }
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error("❌ Login Error:", error);
            setMessage("❌ Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={formContainerStyle}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Welcome Back!</h2>
                {message && <p>{message}</p>}
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                    <button type="submit" style={buttonStyle} disabled={isLoading}>
                        {isLoading ? "🔄 Logging in..." : "Login"}
                    </button>
                </form>
                <p style={{ marginTop: '1.5rem' }}>Don't have an account? <Link to="/register" style={{ color: 'lightblue' }}>Create one</Link></p>
            </div>
        </div>
    );
};

export default Login;
