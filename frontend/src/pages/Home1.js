import React, { useState, useEffect } from 'react';

const Home1 = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop",
            alt: "People helping with food distribution"
        },
        {
            image: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=2940&auto=format&fit=crop",
            alt: "Community food bank"
        },
        {
            image: "https://images.unsplash.com/photo-1587271339318-2e65b5306481?q=80&w=2940&auto=format&fit=crop",
            alt: "Volunteers packaging food"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const navStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        zIndex: 1000
    };

    const navContentStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const logoStyle = {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#4F46E5',
        cursor: 'pointer',
    };

    const navLinksStyle = {
        display: isMenuOpen ? 'flex' : 'none',
        flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
        gap: '2rem',
        '@media (min-width: 768px)': {
            display: 'flex'
        }
    };

    const buttonStyle = {
        padding: '0.5rem 1rem',
        border: 'none',
        background: 'none',
        color: '#4F46E5',
        cursor: 'pointer',
        fontSize: '1rem'
    };

    const heroStyle = {
        height: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        paddingTop: '64px'
    };

    const heroImageStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: -1
    };

    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: -1
    };

    const sectionStyle = {
        padding: '4rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
    };

    const cardContainerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        padding: '2rem 0'
    };

    const cardStyle = {
        padding: '2rem',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.5rem',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        cursor: 'pointer'
    };

    const contactStyle = {
        backgroundColor: '#f3f4f6',
        padding: '4rem 2rem',
        textAlign: 'center'
    };

    return (
        <div>
            {/* Navigation */}
            <nav style={navStyle}>
                <div style={navContentStyle}>
                    <h1 style={logoStyle}>Hunger-Free Tomorrow</h1>
                    <div style={navLinksStyle}>
                        <button style={buttonStyle} onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}>Home</button>
                        <button style={buttonStyle} onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>About</button>
                        <button style={buttonStyle} onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}>Contact</button>
                    </div>
                    <button style={buttonStyle} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        ☰
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section id="home" style={heroStyle}>
                <img src={slides[currentSlide].image} alt={slides[currentSlide].alt} style={heroImageStyle} />
                <div style={overlayStyle}></div>
                <div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Creating a Hunger-Free Tomorrow</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Join us in our mission to ensure no one goes to bed hungry.</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        style={{
                            padding: '1rem 2rem',
                            backgroundColor: '#4F46E5',
                            color: 'white',
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontSize: '1.125rem'
                        }}
                    >
                    Get Involved
                </button>

                </div>
            </section>

            {/* About Section */}
            <section id="about" style={sectionStyle}>
                <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>About Us</h2>
                <div style={cardContainerStyle}>
                    <div style={cardStyle}>
                        <h3 style={{ marginBottom: '1rem' }}>Our Mission</h3>
                        <p>Dedicated to eradicating hunger and food insecurity in communities worldwide.</p>
                    </div>
                    <div style={cardStyle}>
                        <h3 style={{ marginBottom: '1rem' }}>Our Impact</h3>
                        <p>Connecting donors, volunteers, and recipients to create lasting change.</p>
                    </div>
                    <div style={cardStyle}>
                        <h3 style={{ marginBottom: '1rem' }}>Get Involved</h3>
                        <p>Join our mission by donating, volunteering, or seeking assistance.</p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" style={contactStyle}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Contact Us</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Contact Information</h3>
                        <p>📧 ruther18042005@gmail.com</p>
                        <p>📞 +91 7386969984, +91 9951566939</p>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Office Hours</h3>
                        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p>Saturday: 10:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home1;