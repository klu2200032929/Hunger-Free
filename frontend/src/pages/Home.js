import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Home = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:5000/api/donations/")
            .then((response) => {
                setDonations(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching donations:", error);
                setIsLoading(false);
            });
    }, []);

    const containerStyle = {
        minHeight: 'calc(100vh - 60px)',
        padding: '2rem',
        background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), 
                    url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80') no-repeat center center/cover`,
        marginTop: '-1rem'
    };

    const cardStyle = {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={containerStyle}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ maxWidth: '1200px', margin: '0 auto' }}
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
                    Available Donations
                </motion.h2>

                {isLoading ? (
                    <div style={{ textAlign: 'center', color: 'white' }}>
                        <p>Loading donations...</p>
                    </div>
                ) : donations.length === 0 ? (
                    <motion.div
                        style={{
                            ...cardStyle,
                            textAlign: 'center',
                            padding: '2rem'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p>No donations available at the moment. Check back later!</p>
                    </motion.div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {donations.map((donation, index) => (
                            <motion.div
                                key={donation._id}
                                style={cardStyle}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ 
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.3)'
                                }}
                            >
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '1rem',
                                    color: '#64ffda',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                                }}>
                                    {donation.foodItem}
                                </h3>
                                <p style={{ marginBottom: '0.5rem' }}>
                                    <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Quantity:</strong> 
                                    <span style={{ marginLeft: '0.5rem' }}>{donation.quantity} meals</span>
                                </p>
                                <p style={{ marginBottom: '0.5rem' }}>
                                    <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Pickup Location:</strong> 
                                    <span style={{ marginLeft: '0.5rem' }}>{donation.pickupLocation}</span>
                                </p>
                                {donation.donor && (
                                    <p style={{ marginBottom: '0.5rem' }}>
                                        <strong style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Donated by:</strong> 
                                        <span style={{ marginLeft: '0.5rem' }}>{donation.donor.name}</span>
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Home;