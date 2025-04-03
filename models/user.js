const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    firebaseUid: { type: String, unique: true }, 
    isVerified: { type: Boolean, default: false }, 
    profile: {
        name: { type: String },
        phoneNumber: { type: String },
        address: { type: String },
        photo: { type: String },
        gltfFile: { type: String }, 
        dob: { type: Date },
        gender: { type: String }
    }
});

module.exports = mongoose.model('User', UserSchema);
