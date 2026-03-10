require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const RequiredItem = require("./models/RequiredItem");
const PurchasedItem = require("./models/PurchasedItem");

const app = express();
app.use(express.json({ limit: "10mb" })); // Increase limit for potential base64 images
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// --- API ROUTES --- //

// Fetch all required & purchased items
app.get("/api/data", async (req, res) => {
    try {
        console.log("Fetching data API called, connection state:", mongoose.connection.readyState);
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
        const newItem = new RequiredItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: "Failed to add required item", details: error });
    }
});

// Remove a required item (typically used when converting to a purchased item)
app.delete("/api/required-items/:id", async (req, res) => {
    try {
        await RequiredItem.findByIdAndDelete(req.params.id);
        res.json({ message: "Item removed" });
    } catch (error) {
        res.status(400).json({ error: "Failed to delete required item" });
    }
});

// Add a purchased item
app.post("/api/purchased-items", async (req, res) => {
    try {
        const newItem = new PurchasedItem(req.body);
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ error: "Failed to add purchased item", details: error });
    }
});

// Update split status (Mark Share Paid)
app.put("/api/purchased-items/:expenseId/pay", async (req, res) => {
    try {
        const { userId } = req.body;
        const item = await PurchasedItem.findById(req.params.expenseId);
        if (!item) return res.status(404).json({ error: "Expense not found" });

        // Find the specific split and mark it Paid
        const splitIndex = item.split.findIndex(s => s.userId === userId);
        if (splitIndex !== -1) {
            item.split[splitIndex].status = "Paid";
            await item.save();
            res.json(item);
        } else {
            res.status(404).json({ error: "User split not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update status", details: error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
