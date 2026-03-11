const mongoose = require("mongoose");

const choreSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    icon: { type: String, default: "🧹" },
    assignedTo: { type: String, required: true },
    frequency: { type: String, default: "Daily" },
    nextDue: { type: String, default: "Today" },
    status: { type: String, default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChoreItem", choreSchema);
