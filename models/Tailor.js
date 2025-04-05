const mongoose = require("mongoose");

const TailorSchema = new mongoose.Schema({
  
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
      default:[]
    },
  ],
});

module.exports = mongoose.model("Tailor", TailorSchema);
