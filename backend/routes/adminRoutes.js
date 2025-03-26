const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { 
    getAllUsers, deleteUser, 
    getAllDonations, deleteDonation, 
    getAllRequests, deleteRequest 
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", protect, getAllUsers);
router.delete("/users/:id", protect, deleteUser);
// ✅ Fix: Correct API path to delete from both tables
router.get("/donations/history", protect, getAllDonations);
router.delete("/donations/:id", protect, deleteDonation); // ✅ Corrected
router.get("/requests", protect, getAllRequests);  // ✅ Use correct route
router.delete("/requests/:id", protect, deleteRequest);

module.exports = router;
