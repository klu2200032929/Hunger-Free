const express = require("express");
const { createDonation, getAllDonations, getDonationHistory,deleteDonation,deleteDonationHistory , getUserDonations,getUserDonationsHistory } = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createDonation); // ✅ Create donation
router.get("/", getAllDonations); // ✅ Get active donations
router.get("/history", protect, getDonationHistory); // ✅ Get donation history
router.delete("/:id", protect, deleteDonation); // ✅ Deletes from both `donations` and `donations/history`

router.get("/my-donations", protect, getUserDonations);  // ✅ Get logged-in user's donations
router.get("/history", protect, getUserDonationsHistory); // ✅ Users see only their own donations

module.exports = router;
