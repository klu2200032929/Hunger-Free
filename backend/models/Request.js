const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
    {
        // Reference to the User who made the request
        beneficiary: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Food item requested
        foodItem: { 
            type: String, 
            required: true, 
            trim: true // Removes extra spaces 
        },

        // Quantity needed (must be at least 1)
        quantityNeeded: { 
            type: Number, 
            required: true, 
            min: 1 
        },

        // Request status (default: 'pending')
        status: {
            type: String,
            enum: ['pending', 'completed', 'rejected'], // Added 'canceled' as an option
            default: 'pending',
        },
    },
    { timestamps: true } // Auto-generates createdAt & updatedAt
);

// Creating the model
const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
