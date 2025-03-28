const User = require("../models/User");
const Donation = require("../models/Donation");
const DonationHistory = require("../models/DonationHistory"); // Add this import
const Request = require("../models/Request");

// Fetch All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Fetch All Donations
const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find().populate("donor", "name email");
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Donation (updated to delete from both collections)
const deleteDonation = async (req, res) => {
    try {
        // Delete from both collections
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) return res.status(404).json({ message: "Donation not found" });
        
        await DonationHistory.findOneAndDelete({ _id: req.params.id });
        
        res.json({ message: "Donation deleted from both collections" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Fetch All Requests
const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate("beneficiary", "name email");
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Delete Request
const deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        res.json({ message: "Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { 
    getAllUsers, 
    deleteUser, 
    getAllDonations, 
    deleteDonation, 
    getAllRequests, 
    deleteRequest 
};