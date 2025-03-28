const express = require("express");
const { createDonation, getAllDonations, getDonationHistory,deleteDonation,deleteDonationHistory , getUserDonations,getUserDonationsHistory } = require("../controllers/donationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createDonation); // ✅ Create donation
router.get("/", getAllDonations); // ✅ Get active donations
router.get("/history", protect, getDonationHistory); // ✅ Get donation history
// Delete a specific donation (from both tables)
router.delete("/:id", protect, deleteDonation);

// Delete a specific history record (from history only)
router.delete("/history/:id", protect, deleteDonationHistory);

router.get("/my-donations", protect, getUserDonations);  // ✅ Get logged-in user's donations
router.get("/history", protect, getUserDonationsHistory); // ✅ Users see only their own donations

module.exports = router;
