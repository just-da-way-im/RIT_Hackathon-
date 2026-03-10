const mongoose = require("mongoose");
console.log("Starting test-mongo.js...");

mongoose.connect("mongodb://127.0.0.1:27017/coliving")
    .then(() => {
        console.log("MongoDB Connected Successfully");
        process.exit(0);
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });
