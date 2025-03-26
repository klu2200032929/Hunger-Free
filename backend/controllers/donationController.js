const Donation = require("../models/Donation");
const DonationHistory = require("../models/DonationHistory"); // ✅ Import DonationHistory

const createDonation = async (req, res) => {
    try {
        const { foodItem, quantity, pickupLocation } = req.body;

        // ✅ Save donation in the active Donation table
        const donation = await Donation.create({
            donor: req.user._id,
            foodItem,
            quantity,
            pickupLocation,
        });

        // ✅ Save a copy in the DonationHistory table (Permanently stored)
        await DonationHistory.create({
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

// ✅ Fetch only active donations (quantity > 0)
const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ quantity: { $gt: 0 }, status: "available" }).populate("donor", "name email");
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Fetch all donations from history table (permanent record)
const getDonationHistory = async (req, res) => {
    try {
        const donationHistory = await DonationHistory.find({}).populate("donor", "name email");
        res.json(donationHistory);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
const deleteDonation = async (req, res) => {
    try {
        // ✅ Delete from both tables using the correct _id
        const donation = await Donation.findByIdAndDelete(req.params.id);
        const historyDeletion = await DonationHistory.deleteMany({ donor: donation.donor, foodItem: donation.foodItem, pickupLocation: donation.pickupLocation });

        if (!donation) {
            return res.status(404).json({ message: "❌ Donation not found in active donations table" });
        }

        res.json({ message: "✅ Donation deleted from both active and history tables successfully" });
    } catch (error) {
        console.error("❌ Error deleting donation:", error.message);
        res.status(500).json({ message: "❌ Server Error", error: error.message });
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
        // ✅ Fetch only the donations where `donor` matches the logged-in user's ID
        const donations = await Donation.find({ donor: req.user._id });

        res.json(donations);
    } catch (error) {
        console.error("❌ Error fetching donation history:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};



module.exports = { createDonation, getAllDonations, getDonationHistory, deleteDonation, getUserDonations, getUserDonationsHistory };
