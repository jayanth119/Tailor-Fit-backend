const Payment = require("../models/Payment");
const Razorpay = require('../config/razorpay');
const axios = require("axios");
const path = require('path');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

const createPayment  = async (req, res) => {
    try {
        const userId = req.user.id; 
        const orderId = req.params.orderId;
        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }
        
        // Fetch order details from orders service
        const orderResponse = await axios.get(`http://localhost:3000/api/orders/getorderbyid/${orderId}`);
        const order = orderResponse.data.data;
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        
        // Example: using order.totalAmount as the amount (ensure you have a valid amount)
        const amount = order.totalAmount;

        const options = {
            amount: amount * 100, // Convert amount to paise
            currency: 'INR',
            receipt: `receipt_${orderId}`,
            // Optional: you can include additional notes if needed
            // notes: { orderId }
        };

        const razorpayOrder = await Razorpay.orders.create(options);
        const payment = new Payment({
            userId,
            orderId,
            razorpayOrderId: razorpayOrder.id,
            amount,
            status: "pending"
        });
        await payment.save();
        res.status(201).json({ message: "Payment initiated", order: razorpayOrder });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
};

const verifyPayment = (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = Razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
  
    try {
        const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
        if (isValidSignature) {
            // Update the order/payment details in your database as needed.
            // (For example, you might find the payment record by razorpayOrderId and update it.)
            res.status(200).json({ status: 'ok' });
            console.log("Payment verification successful");
        } else {
            res.status(400).json({ status: 'verification_failed' });
            console.log("Payment verification failed");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error verifying payment' });
    }
};

const success = (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'success.html'));
};

module.exports = { createPayment, verifyPayment, success };
