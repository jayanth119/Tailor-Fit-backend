const mongoose = require("mongoose");

const TailorSchema = new mongoose.Schema({
  name: 
  {
    type: String,
    required: true,
  },

  tailorId: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, 
  },

  acceptedOrders: 
  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = mongoose.model("Tailor", TailorSchema);
