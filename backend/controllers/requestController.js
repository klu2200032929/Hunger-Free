const Request = require('../models/Request');
const Donation = require('../models/Donation');

// ✅ Create a new food request & update donation quantity
const createRequest = async (req, res) => {
    try {
        const { foodItem, quantityNeeded } = req.body;

        // ✅ Find an available donation (Must have a positive quantity)
        const donation = await Donation.findOne({ foodItem, quantity: { $gt: 0 } });

        if (!donation) {
            return res.status(400).json({ message: "No available donation for this food item" });
        }

        if (quantityNeeded > donation.quantity) {
            return res.status(400).json({ message: `Only ${donation.quantity} meals available` });
        }

        // ✅ Create the request
        const request = await Request.create({
            beneficiary: req.user._id,
            foodItem,
            quantityNeeded,
            status: "pending", // ✅ Add status field for tracking
            otp: Math.floor(100000 + Math.random() * 900000), // ✅ Generate random 6-digit OTP
        });

        // ✅ Reduce donation quantity
        donation.quantity -= quantityNeeded;

        // ✅ If the donation is fully used, delete it
        if (donation.quantity === 0) {
            await Donation.findByIdAndDelete(donation._id);
        } else {
            await donation.save(); // ✅ Save updated quantity
        }

        res.status(201).json({ message: "Food request submitted successfully", request });
    } catch (error) {
        console.error("❌ Error creating request:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getPendingRequests = async (req, res) => {
    try {
        // ✅ Fix: Use `requestStatus` instead of `status`
        const requests = await Request.find({ requestStatus: "pending" }).populate("beneficiary", "name email");

        console.log("✅ Found Pending Requests:", requests); // ✅ Debugging Log

        if (requests.length === 0) {
            return res.status(200).json([]); // ✅ Return empty array instead of error
        }

        res.json(requests);
    } catch (error) {
        console.error("❌ Error fetching pending requests:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ✅ Fetch all requests (Pending & Delivered)
const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find({}).populate("beneficiary", "name email");

        if (!requests.length) {
            return res.status(404).json({ message: "No food requests found" });
        }

        res.json(requests);
    } catch (error) {
        console.error("❌ Error fetching requests:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
const deleteRequest = async (req, res) => {
    try {
        const request = await Request.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "❌ Request not found" });
        }
        res.json({ message: "✅ Request deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting request:", error.message);
        res.status(500).json({ message: "❌ Server Error", error: error.message });
    }
};

// ✅ Get requests made by the logged-in user
const getUserRequests = async (req, res) => {
    try {
        const requests = await Request.find({ beneficiary: req.user._id });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
const fetchRequests = async () => {
    try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/api/requests/");
        console.log("Fetched Requests:", response.data); // Debugging
        setRequests(response.data); // Update state with new data
    } catch (error) {
        console.error("Error fetching requests:", error);
        setError(error.response?.data?.message || "Failed to load requests.");
    } finally {
        setIsLoading(false);
    }
};

// Call fetchRequests after updating a request
const updateRequestStatus = async (requestId, newStatus) => {
    try {
        await axios.put(`http://localhost:5000/api/requests/${requestId}`, {
            requestStatus: newStatus
        });
        console.log(`Request ${requestId} updated to ${newStatus}`);
        
        fetchRequests(); // ✅ Re-fetch updated data
    } catch (error) {
        console.error("Error updating request:", error);
    }
};

module.exports = { createRequest, getAllRequests, getPendingRequests, deleteRequest, getUserRequests };
