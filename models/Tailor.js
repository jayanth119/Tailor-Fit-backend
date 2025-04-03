const mongoose = require("mongoose");

const TailorSchema = new mongoose.Schema({
  name: 
  {
    type: String,
    required: true,
  },
  
  tailorId: {
    type: mongoose.Schema.Types.ObjectId, 
    default: () => new mongoose.Types.ObjectId(),
    unique: true,
  },
  acceptedOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = mongoose.model("Tailor", TailorSchema);
