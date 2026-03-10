const mongoose = require("mongoose");

const splitSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    status: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    amount: { type: Number, required: true }
});

const purchasedItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    purchasedBy: { type: String, required: true },
    billPreview: { type: String }, // Can store a base64 string or URL
    split: [splitSchema],
}, { timestamps: true });

module.exports = mongoose.model("PurchasedItem", purchasedItemSchema);
