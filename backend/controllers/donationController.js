const Donation = require("../models/Donation");
const DonationHistory = require("../models/DonationHistory");

const createDonation = async (req, res) => {
    try {
        const { foodItem, quantity, pickupLocation } = req.body;

        const donation = await Donation.create({
            donor: req.user._id,
            foodItem,
            quantity,
            pickupLocation,
        });

        await DonationHistory.create({
            _id: donation._id, // Use same ID for easy deletion
            donor: req.user._id,
            foodItem,
            quantity,
            pickupLocation,
        });

        res.status(201).json(donation);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ quantity: { $gt: 0 }, status: "available" })
            .populate("donor", "name email");
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getDonationHistory = async (req, res) => {
    try {
        const donationHistory = await DonationHistory.find({})
            .populate("donor", "name email");
        res.json(donationHistory);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: "Donation not found" });
        }
        
        // Delete corresponding history record using same ID
        await DonationHistory.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Donation deleted from both tables" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const deleteDonationHistory = async (req, res) => {
    try {
        const historyItem = await DonationHistory.findByIdAndDelete(req.params.id);
        if (!historyItem) {
            return res.status(404).json({ message: "History record not found" });
        }
        res.json({ message: "History record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getUserDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ donor: req.user._id });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getUserDonationsHistory = async (req, res) => {
    try {
        const donations = await DonationHistory.find({ donor: req.user._id });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = {
    createDonation,
    getAllDonations,
    getDonationHistory,
    deleteDonation,
    deleteDonationHistory,
    getUserDonations,
    getUserDonationsHistory
};