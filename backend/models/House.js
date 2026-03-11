const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    upiId: { type: String, required: true },
    monthlyRent: { type: Number, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });

module.exports = mongoose.model("House", houseSchema);
