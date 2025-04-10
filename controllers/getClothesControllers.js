const fs = require("fs");
const path = require("path");
// const user = require("../models/user");

const getClothesbyId = async (req, res) => {
    try {
        const userId = req.userId;
        // const userId = "67f0e0c0b0034e0d9b34b1f3"

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Define the directory path based on userId
        const directoryPath = path.join(__dirname, "../uploads/photos", userId);

        // Check if the directory exists
        if (!fs.existsSync(directoryPath)) {
            return res.status(404).json({ message: "No clothes found for this user" });
        }

        // Read the directory and get all file names
        const files = fs.readdirSync(directoryPath);

        // Send the file names as a response
        res.status(200).json({ clothes: files });
    } catch (error) {
        console.error("Error fetching clothes:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getClothesbyId
};