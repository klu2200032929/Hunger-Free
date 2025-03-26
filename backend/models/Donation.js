const mongoose = require('mongoose');

const donationSchema = mongoose.Schema(
    {
        donor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        foodItem: { type: String, required: true },
        quantity: { type: Number, required: true },
        pickupLocation: { type: String, required: true },
        status: {
            type: String,
            enum: ['available', 'assigned', 'delivered'],
            default: 'available',
        },
    },
    { timestamps: true }
);

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
