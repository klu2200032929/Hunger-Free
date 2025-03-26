const express = require("express");
const { createRequest, getAllRequests, getPendingRequests , deleteRequest, getUserRequests} = require("../controllers/requestController");
const { protect } = require("../middleware/authMiddleware");
const Request = require('../models/Request'); // Import Request model
const router = express.Router();

router.post("/create", protect, createRequest);
router.get("/", getAllRequests);
router.get("/pending", protect, getPendingRequests); // ✅ Ensure only volunteers/admins can access
router.delete("/:id", protect, deleteRequest);
router.get("/my-requests", protect, getUserRequests);  // ✅ Get logged-in user's requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find(); // Fetch latest request statuses
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.put('/api/requests/:id', async (req, res) => {
    try {
        const { requestStatus } = req.body;
        const updatedRequest = await Request.findByIdAndUpdate(
            req.params.id,
            { requestStatus: requestStatus.toLowerCase() }, // ✅ Ensure lowercase for consistency
            { new: true } // ✅ Return updated request
        );
        console.log("Updated Request:", updatedRequest); // Debugging
        res.json(updatedRequest);
    } catch (error) {
        console.error("Error updating request:", error);
        res.status(500).json({ message: "Failed to update request" });
    }
});

module.exports = router;
