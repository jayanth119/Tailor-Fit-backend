const Clothes = require("../models/productModel");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");


const getAllclothes = async (req, res) => {
    try {
        const gender = req.query.gender;

        if (gender !== "male" && gender !== "female") {
            return res.status(400).json({ message: "Invalid gender. Use 'male' or 'female'." });
        }

        // Fetch clothes based on gender
        const clothes = await Clothes.find({ gender });

        // Fetch user details using JWT user ID
        let userProfile = {};
        // if (req.user && req.user.id) {
            const user = await User.findById("67ed1b8cc3530ee4a7f936b8");
            if (user) {
                userProfile = {
                    photo: user.profile?.photo || null,
                    gltfFile: user.profile?.gltfFile || null
                };
            }
        // }

        res.json({
            clothes,
            user: userProfile
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Set storage engine for images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype.startsWith("image/")) {
            cb(null, "uploads/photos/");
        } else if (file.mimetype === "model/gltf+json") {
            cb(null, "uploads/gltf/");
        } else {
            cb(new Error("Invalid file type"), null);
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "model/gltf+json") {
        cb(null, true);
    } else {
        cb(new Error("Only images and GLTF files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });


module.exports = { getAllclothes , upload  };
