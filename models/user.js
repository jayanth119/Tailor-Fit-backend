const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // Store the hashed password
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "seller","buyer"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash the password before saving to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Avoid hashing if password is not modified
  this.password = await bcrypt.hash(this.password, 10); // Hash the password with bcrypt
  next();
});

// Compare the plain-text password with the hashed password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Compare using bcrypt
};

module.exports = mongoose.model("User", userSchema);
