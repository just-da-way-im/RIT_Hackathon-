const mongoose = require("mongoose");

const requiredItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    estimatedPrice: { type: Number, default: 0 },
    addedBy: { type: String, default: "System" },
}, { timestamps: true });

module.exports = mongoose.model("RequiredItem", requiredItemSchema);
