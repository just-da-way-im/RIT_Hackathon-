require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const RequiredItem = require("./models/RequiredItem");
const PurchasedItem = require("./models/PurchasedItem");

const app = express();
app.use(express.json({ limit: "10mb" })); // Increase limit for potential base64 images
app.use(cors());

// In-memory fallback when MongoDB is not available
let useMemory = false;
const memory = {
    requiredItems: [],
    purchasedItems: []
};
function id() {
    return crypto.randomBytes(12).toString("hex");
}

// Connect to MongoDB (optional - fallback to in-memory)
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/coliving";
const dbReady = mongoose.connect(mongoUri)
    .then(() => {
        console.log("MongoDB Connected");
        return false; // useMemory stays false
    })
    .catch(err => {
        console.warn("MongoDB not available, using in-memory storage:", err.message);
        useMemory = true;
        return true;
    });

// --- API ROUTES --- //

// Fetch all required & purchased items
app.get("/api/data", async (req, res) => {
    try {
        if (useMemory) {
            return res.json({
                requiredItems: memory.requiredItems.slice().reverse(),
                purchasedItems: memory.purchasedItems.slice().reverse()
            });
        }
        const requiredItems = await RequiredItem.find().sort({ createdAt: -1 });
        const purchasedItems = await PurchasedItem.find().sort({ createdAt: -1 });
        res.json({ requiredItems, purchasedItems });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data", details: error.message });
    }
});

// Add a required item
app.post("/api/required-items", async (req, res) => {
    try {
        const body = req.body;
        if (!body.name || (body.quantity === undefined || body.quantity === null || String(body.quantity).trim() === "")) {
            return res.status(400).json({ error: "Name and quantity are required" });
        }
        if (useMemory) {
            const now = new Date().toISOString();
            const savedItem = {
                _id: id(),
                name: String(body.name).trim(),
                quantity: String(body.quantity).trim(),
                estimatedPrice: 0,
                addedBy: body.addedBy || "You",
                createdAt: now,
                updatedAt: now
            };
            memory.requiredItems.push(savedItem);
            return res.status(201).json(savedItem);
        }
        const newItem = new RequiredItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: "Failed to add required item", details: error.message });
    }
});

// Remove a required item (typically used when converting to a purchased item)
app.delete("/api/required-items/:id", async (req, res) => {
    try {
        if (useMemory) {
            const idx = memory.requiredItems.findIndex(r => r._id === req.params.id);
            if (idx !== -1) memory.requiredItems.splice(idx, 1);
            return res.json({ message: "Item removed" });
        }
        await RequiredItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Item removed" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete required item" });
    }
});

// Add a purchased item
app.post("/api/purchased-items", async (req, res) => {
    try {
        const body = req.body;
        if (!body.name || body.quantity == null || !body.totalPrice || !body.purchasedBy) {
            return res.status(400).json({ error: "Name, quantity, totalPrice and purchasedBy are required" });
        }
        if (useMemory) {
            const now = new Date().toISOString();
            const savedItem = {
                _id: id(),
                id: null, // set below
                name: body.name,
                quantity: String(body.quantity),
                totalPrice: Number(body.totalPrice),
                purchasedBy: body.purchasedBy,
                billPreview: body.billPreview || null,
                split: Array.isArray(body.split) ? body.split : [],
                createdAt: now,
                updatedAt: now
            };
            savedItem.id = savedItem._id;
            memory.purchasedItems.push(savedItem);
            return res.status(201).json(savedItem);
        }
        const newItem = new PurchasedItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: "Failed to add purchased item", details: error.message });
    }
});

// Update split status (Mark Share Paid)
app.put("/api/purchased-items/:expenseId/pay", async (req, res) => {
    try {
        const { userId } = req.body;
        if (useMemory) {
            const item = memory.purchasedItems.find(p => p._id === req.params.expenseId);
            if (!item) return res.status(404).json({ error: "Expense not found" });
            const split = item.split || [];
            const idx = split.findIndex(s => s.userId === userId);
            if (idx === -1) return res.status(404).json({ error: "User split not found" });
            split[idx].status = "Paid";
            return res.json(item);
        }
        const item = await PurchasedItem.findById(req.params.expenseId);
        if (!item) return res.status(404).json({ error: "Expense not found" });
        const splitIndex = item.split.findIndex(s => s.userId === userId);
        if (splitIndex !== -1) {
            item.split[splitIndex].status = "Paid";
            await item.save();
            res.json(item);
        } else {
            res.status(404).json({ error: "User split not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update status", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
dbReady.then(() => {
    app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
});
