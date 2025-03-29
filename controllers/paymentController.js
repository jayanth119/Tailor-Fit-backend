const Payment = require("../models/Payment");
const razorpay = require("../config/razorpay");
const axios = require("axios");

const createPayment = async (req, res) => {
    try {
        const userId = req.user.id; 
        const  orderId  = req.params.orderId;

        if (!orderId) 
        {
            return res.status(400).json({ message: "Order ID is required" });
        }

        
        const orderResponse = await axios.get(`http://localhost:3002/api/orders/getorderbyid/${orderId}`);
        const order = orderResponse.data.data;

        if (!order) 
        {
            return res.status(404).json({ message: "Order not found" });
        }

        const amount = order.totalAmount;

        const options = {
            amount: amount * 100, 
            currency: "INR",
            receipt: `receipt_${orderId}`,
            payment_capture: 1
        };

        const razorpayOrder = await razorpay.orders.create(options);

        const payment = new Payment({
            userId,
            orderId,
            razorpayOrderId: razorpayOrder.id,
            amount,
            status: "pending"
        });

        await payment.save();

        res.status(201).json({ message: "Payment initiated", order: razorpayOrder });
    } 
    catch (error) 
    {
        console.error("Payment Error:", error);
        res.status(500).json({ message: "Payment failed", error: error.message });
    }
};

module.exports = { createPayment };