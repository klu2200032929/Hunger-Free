const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const cron = require("node-cron");
const Request = require("./models/Request");
const Donation = require("./models/Donation");
const { protect } = require("./middleware/authMiddleware");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const donationRoutes = require("./routes/donationRoutes");
const requestRoutes = require("./routes/requestRoutes");
const adminRoutes = require("./routes/adminRoutes");  // ✅ Add Admin Routes

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();



const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);  // ✅ Ensure admin routes are included

// ✅ Debug Route: Check All Donations in Database
app.get("/api/debug/donations", async (req, res) => {
    try {
        const donations = await Donation.find({});
        console.log("✅ Donations in database:", donations);
        res.json(donations);
    } catch (error) {
        console.error("❌ Error fetching donations:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Debug Route: Check All Requests in Database
app.get("/api/debug/requests", async (req, res) => {
    try {
        const requests = await Request.find({}).populate("beneficiary", "name email");
        console.log("✅ Requests in database:", requests);
        res.json(requests);
    } catch (error) {
        console.error("❌ Error fetching requests:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// ✅ Scheduled Job: Delete delivered requests after 24 hours
cron.schedule("0 * * * *", async () => {
    try {
        const cutoff = new Date();
        cutoff.setHours(cutoff.getHours() - 24);

        const deletedRequests = await Request.deleteMany({ status: "delivered", deliveredAt: { $lte: cutoff } });

        if (deletedRequests.deletedCount > 0) {
            console.log(`✅ Deleted ${deletedRequests.deletedCount} old delivered requests.`);
        }
    } catch (error) {
        console.error("❌ Error deleting old delivered requests:", error.message);
    }
});

// ✅ Root Endpoint
app.get("/", (req, res) => {
    res.send("🚀 Hunger-Free Tomorrow API is running...");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
});
app.use(cors({
    origin: ["https://hunger-free-tomorrow.netlify.app/"], // Replace with your Netlify URL
    credentials: true
}));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
