require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");

const RequiredItem = require("./models/RequiredItem");
const PurchasedItem = require("./models/PurchasedItem");
const ChoreItem = require("./models/ChoreItem");
const House = require("./models/House");
const User = require("./models/User");

const app = express();
app.use(express.json({ limit: "10mb" })); // Increase limit for potential base64 images
app.use(cors());

// In-memory fallback when MongoDB is not available
let useMemory = false;
const memory = {
    requiredItems: [],
    purchasedItems: [],
    chores: []
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

// Register Admin & House
app.post("/api/auth/register-admin", async (req, res) => {
    try {
        const { houseName, address, upiId, rent, adminName, adminEmail, adminPhone, adminPassword, roommates } = req.body;

        // Check if user exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) return res.status(400).json({ error: "Admin email already registered" });

        // 1. Create Admin
        const newAdmin = new User({
            role: "admin",
            name: adminName,
            email: adminEmail,
            phone: adminPhone,
            password: adminPassword, // Should be hashed in prod!
            color: "var(--amber)",
            avatarBg: "var(--amber-pale)"
        });
        const savedAdmin = await newAdmin.save();

        // 2. Create House
        const newHouse = new House({
            name: houseName,
            address,
            upiId,
            monthlyRent: rent,
            adminId: savedAdmin._id
        });
        const savedHouse = await newHouse.save();

        // Assign House ID to Admin
        savedAdmin.houseId = savedHouse._id;
        await savedAdmin.save();

        // 3. Create Roommates
        const roommateDocs = roommates.map(r => ({
            role: "roommate",
            name: r.name,
            email: r.email,
            phone: "0000000000", // placeholder
            password: "password123", // default password
            houseId: savedHouse._id,
            rentShare: r.rentShare,
            status: "invited",
            paymentStatus: "unpaid"
        }));

        if (roommateDocs.length > 0) {
            await User.insertMany(roommateDocs);
        }

        res.status(201).json({ message: "House & Admin registered successfully", admin: savedAdmin, house: savedHouse });
    } catch (e) {
        console.error("Registration Error", e);
        res.status(500).json({ error: "Server registration error", details: e.message });
    }
});

// Login User
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found" });
        if (user.password !== password) return res.status(401).json({ error: "Invalid credentials" });
        if (role && user.role !== role) return res.status(403).json({ error: `Account exists, but is not registered as a ${role}` });

        res.status(200).json({ message: "Login successful", user });
    } catch (e) {
        res.status(500).json({ error: "Server login error" });
    }
});

// Fetch full house dashboard data
app.get("/api/dashboard/:houseId", async (req, res) => {
    try {
        const houseId = req.params.houseId;

        const house = await House.findById(houseId).populate('adminId', 'name email phone');
        if (!house) return res.status(404).json({ error: "House not found" });

        const roommates = await User.find({ houseId, role: "roommate" });

        // Scope tasks to House level once models are fully fleshed out, for now return global records:
        const requiredItems = await RequiredItem.find().sort({ createdAt: -1 });
        const purchasedItems = await PurchasedItem.find().sort({ createdAt: -1 });
        const chores = await ChoreItem.find().sort({ createdAt: 1 });

        // Mock payments and messages based on roommates to seed initial dashboard view
        const mockPayments = roommates.map((r, i) => ({
            id: "p" + i, roommate: r.name, amount: r.rentShare, type: "Rent", date: null, status: r.paymentStatus === "paid" ? "approved" : "unpaid", proof: false
        }));

        res.json({
            house: {
                id: house._id,
                name: house.name,
                adminName: house.adminId.name,
                adminEmail: house.adminId.email,
                adminPhone: house.adminId.phone,
                address: house.address,
                upiId: house.upiId,
                monthlyRent: house.monthlyRent,
                status: house.status
            },
            roommates: roommates.map(r => ({
                id: r._id,
                name: r.name,
                email: r.email,
                phone: r.phone,
                rentShare: r.rentShare,
                deposit: r.deposit,
                status: r.status,
                paymentStatus: r.paymentStatus,
                vibe: r.vibe,
                avatarBg: r.avatarBg,
                color: r.color
            })),
            expenses: purchasedItems,
            requiredItems,
            purchasedItems,
            chores,
            payments: mockPayments,
            messages: []
        });

    } catch (e) {
        console.error("Dashboard Fetch Error", e);
        res.status(500).json({ error: "Server fetch error" });
    }
});


// Fetch all required & purchased items
app.get("/api/data", async (req, res) => {
    try {
        if (useMemory) {
            return res.json({
                requiredItems: memory.requiredItems.slice().reverse(),
                purchasedItems: memory.purchasedItems.slice().reverse(),
                chores: memory.chores
            });
        }
        const requiredItems = await RequiredItem.find().sort({ createdAt: -1 });
        const purchasedItems = await PurchasedItem.find().sort({ createdAt: -1 });
        const chores = await ChoreItem.find().sort({ createdAt: 1 });
        res.json({ requiredItems, purchasedItems, chores });
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

// Bulk update chores (Rotate Board)
app.put("/api/chores/bulk-update", async (req, res) => {
    try {
        const { chores } = req.body;
        if (!Array.isArray(chores)) {
            return res.status(400).json({ error: "Invalid payload, Expected an array of chores" });
        }

        if (useMemory) {
            chores.forEach(update => {
                const choreIdx = memory.chores.findIndex(c => c._id === update.id || c.id === update.id);
                if (choreIdx !== -1) {
                    memory.chores[choreIdx].assignedTo = update.assignedTo;
                }
            });
            return res.json({ message: "Chores updated successfully" });
        }

        const bulkOps = chores.map(update => ({
            updateOne: {
                filter: { _id: update.id },
                update: { $set: { assignedTo: update.assignedTo } }
            }
        }));

        await ChoreItem.bulkWrite(bulkOps);
        res.json({ message: "Chores rotated successfully" });

    } catch (error) {
        console.error("Error bulk updating chores:", error);
        res.status(500).json({ error: "Failed to rotate chores" });
    }
});

// Update single chore status (Toggle Done)
app.put("/api/chores/:id", async (req, res) => {
    try {
        const { status } = req.body;

        if (useMemory) {
            const choreIdx = memory.chores.findIndex(c => c._id === req.params.id || c.id === req.params.id);
            if (choreIdx !== -1) {
                memory.chores[choreIdx].status = status;
                return res.json(memory.chores[choreIdx]);
            }
            return res.status(404).json({ error: "Chore not found" });
        }

        const updatedChore = await ChoreItem.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedChore) {
            return res.status(404).json({ error: "Chore not found" });
        }
        res.json(updatedChore);
    } catch (error) {
        console.error("Error updating chore:", error);
        res.status(500).json({ error: "Failed to update chore status" });
    }
});

// Create new chore (if needed later)
app.post("/api/chores", async (req, res) => {
    try {
        const newChore = new ChoreItem(req.body);
        const savedChore = await newChore.save();
        res.status(201).json(savedChore);
    } catch (error) {
        res.status(400).json({ error: "Failed to create chore", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// Initialize missing chores
async function initChores() {
    if (useMemory) {
        // Init memory chores
        if (memory.chores.length === 0) {
            memory.chores = [
                { id: "c1", _id: "c1", name: "Kitchen Cleaning", icon: "🍳", assignedTo: "Arjun Mehta", frequency: "Daily", nextDue: "Today", status: "pending" },
                { id: "c2", _id: "c2", name: "Bathroom", icon: "🚿", assignedTo: "Sneha Patel", frequency: "Every 2 days", nextDue: "Tomorrow", status: "done" },
                { id: "c3", _id: "c3", name: "Sweeping", icon: "🧹", assignedTo: "Rohan Das", frequency: "Daily", nextDue: "Today", status: "pending" },
                { id: "c4", _id: "c4", name: "Trash", icon: "🗑️", assignedTo: "Priya Sharma", frequency: "Weekly", nextDue: "Sun", status: "pending" },
                { id: "c5", _id: "c5", name: "Laundry Room", icon: "👕", assignedTo: "Arjun Mehta", frequency: "Weekly", nextDue: "Sat", status: "done" }
            ];
        }
        return;
    }

    try {
        const choreCount = await ChoreItem.countDocuments();
        if (choreCount === 0) {
            const initialChores = [
                { name: "Kitchen Cleaning", icon: "🍳", assignedTo: "Arjun Mehta", frequency: "Daily", nextDue: "Today", status: "pending" },
                { name: "Bathroom", icon: "🚿", assignedTo: "Sneha Patel", frequency: "Every 2 days", nextDue: "Tomorrow", status: "done" },
                { name: "Sweeping", icon: "🧹", assignedTo: "Rohan Das", frequency: "Daily", nextDue: "Today", status: "pending" },
                { name: "Trash", icon: "🗑️", assignedTo: "Priya Sharma", frequency: "Weekly", nextDue: "Sun", status: "pending" },
                { name: "Laundry Room", icon: "👕", assignedTo: "Arjun Mehta", frequency: "Weekly", nextDue: "Sat", status: "done" }
            ];
            await ChoreItem.insertMany(initialChores);
            console.log("Database initialized with default chores.");
        }
    } catch (e) {
        console.error("Failed to initialize chores", e);
    }
}

dbReady.then(async () => {
    await initChores();
    app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
});
