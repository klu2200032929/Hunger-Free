import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    let user = null;
    try {
        user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
    } catch (error) {
        console.error("Error parsing user data:", error);
        user = null;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        window.location.reload();
    };

    const [hoveredButton, setHoveredButton] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-container")) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const baseButtonStyle = {
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
        fontWeight: "600",
        transition: "all 0.3s ease-in-out",
        textDecoration: "none",
        border: "2px solid",
        margin: "0 0.3rem",
        display: "inline-block",
        cursor: "pointer",
    };

    const getButtonStyle = (color, hoverColor, key) => ({
        ...baseButtonStyle,
        borderColor: hoveredButton === key ? hoverColor : color,
        color: hoveredButton === key ? "white" : color,
        backgroundColor: hoveredButton === key ? color : "transparent",
    });

    return (
        <nav style={{
            backgroundColor: "#f8f9fa",
            padding: "1rem",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "2rem",
            position: "sticky",
            top: "0",
            zIndex: "1000"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                maxWidth: "1200px",
                margin: "0 auto",
                flexWrap: "wrap"
            }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Link to="/" style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        textDecoration: "none",
                        color: "#333",
                        marginRight: "2rem",
                        transition: "all 0.3s ease"
                    }}>
                        Hunger-Free Tomorrow
                    </Link>
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap"
                }}>
                    <Link
                        to="/"
                        style={getButtonStyle("#4CAF50", "#3e8e41", "home")}
                        onMouseEnter={() => setHoveredButton("home")}
                        onMouseLeave={() => setHoveredButton(null)}
                    >
                        Home
                    </Link>

                    {token && (
                        <Link
                            to="/donate"
                            style={getButtonStyle("#FF5722", "#e64a19", "donate")}
                            onMouseEnter={() => setHoveredButton("donate")}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            Donate
                        </Link>
                    )}

                    {token && (
                        <Link
                            to="/request-food"
                            style={getButtonStyle("#2196F3", "#1976d2", "request")}
                            onMouseEnter={() => setHoveredButton("request")}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            Request Food
                        </Link>
                    )}

                    {token && user?.role === "admin" && (
                        <>
                            <Link
                                to="/requests"
                                style={getButtonStyle("#9C27B0", "#7b1fa2", "admin-requests")}
                                onMouseEnter={() => setHoveredButton("admin-requests")}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                Requests
                            </Link>

                            <Link
                                to="/admin-dashboard"
                                style={getButtonStyle("#D32F2F", "#B71C1C", "admin-dashboard")}
                                onMouseEnter={() => setHoveredButton("admin-dashboard")}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                Admin Dashboard
                            </Link>
                        </>
                    )}

                    {token && user?.role === "volunteer" && (
                        <Link
                            to="/verify-delivery"
                            style={getButtonStyle("#FFC107", "#ffa000", "volunteer")}
                            onMouseEnter={() => setHoveredButton("volunteer")}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            Verify Delivery
                        </Link>
                    )}

                    {token && (
                        <div className="dropdown-container" style={{ position: "relative", display: "inline-block" }}>
                            <button
                                style={getButtonStyle("#009688", "#00796b", "profile")}
                                onClick={() => setShowDropdown(!showDropdown)}
                                onMouseEnter={() => setHoveredButton("profile")}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                {user?.name || "Profile"}
                            </button>

                            {showDropdown && (
                                <div style={{
                                    position: "absolute",
                                    right: "0",
                                    backgroundColor: "white",
                                    minWidth: "160px",
                                    boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
                                    borderRadius: "8px",
                                    padding: "0.5rem 0",
                                    display: "block",
                                    zIndex: "10",
                                    transition: "opacity 0.3s ease-in-out"
                                }}>
                                    <Link
                                        to="/profile"
                                        style={{
                                            display: "block",
                                            padding: "0.5rem 1rem",
                                            textDecoration: "none",
                                            color: "#009688",
                                            fontWeight: "600"
                                        }}
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            textAlign: "left",
                                            background: "transparent",
                                            border: "none",
                                            padding: "0.5rem 1rem",
                                            fontWeight: "600",
                                            cursor: "pointer",
                                            color: "#F44336"
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!token && (
                        <>
                            <Link
                                to="/login"
                                style={getButtonStyle("#607D8B", "#455a64", "login")}
                                onMouseEnter={() => setHoveredButton("login")}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                style={getButtonStyle("#3F51B5", "#303F9F", "register")}
                                onMouseEnter={() => setHoveredButton("register")}
                                onMouseLeave={() => setHoveredButton(null)}
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
