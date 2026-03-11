const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    role: { type: String, enum: ["admin", "roommate"], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    color: { type: String, default: "var(--teal)" },
    avatarBg: { type: String, default: "#dbeafe" },
    vibe: { type: String, default: "free" },

    // Admin & Roommate
    houseId: { type: mongoose.Schema.Types.ObjectId, ref: 'House' }, // Setup in AdminRegistration, referenced by Roommates

    // Roommate Specific
    rentShare: { type: Number },
    deposit: { type: Number },
    address: { type: String }, // Permanent Address
    status: { type: String, enum: ["active", "invited", "inactive"], default: "active" },
    paymentStatus: { type: String, enum: ["paid", "pending", "unpaid"], default: "unpaid" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
