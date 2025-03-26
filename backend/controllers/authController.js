const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ✅ Allowed email domains
const allowedDomains = ["gmail.com", "outlook.com", "yahoo.com", "icloud.com", "hotmail.com",
    "aol.com", "protonmail.com", "zoho.com", "yandex.com", "gmx.com"];

// ✅ Email Validation Function
const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    if (!emailRegex.test(email)) return false; // General email format check

    const domain = email.split("@")[1]; // Extract domain from email
    return allowedDomains.includes(domain); // Check if domain is in the allowed list
};

// ✅ Generate JWT including user role
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// ✅ Register New User with Email Validation
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email! Only Gmail, Yahoo, Outlook, iCloud, etc. are allowed." });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Login User & Authenticate
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "User not found. Please register first." });
        }

        const isMatch = await user.matchPassword(password); // Compare entered password with hashed password

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        res.json({
            token: generateToken(user.id, user.role),  // ✅ Send JWT token
            user: { 
                _id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { registerUser, loginUser };
