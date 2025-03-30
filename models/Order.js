const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, 
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", 
          required: true,
        },
        quantity: 
        {
          type: Number,
          required: true,
          min: 1, 
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0, 
    },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Out for Delivery"],
      default: "Processing",
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model("Order", OrderSchema);
