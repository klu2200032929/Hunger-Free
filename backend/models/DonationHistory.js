const mongoose = require("mongoose");

const donationHistorySchema = mongoose.Schema(
    {
        donor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        foodItem: { type: String, required: true },
        quantity: { type: Number, required: true },
        pickupLocation: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: ['available', 'assigned', 'delivered'],
            default: 'available',
        },
    },
    { timestamps: true }
);

const DonationHistory = mongoose.model("DonationHistory", donationHistorySchema);
module.exports = DonationHistory;
