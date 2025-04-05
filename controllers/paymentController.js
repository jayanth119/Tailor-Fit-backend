const Payment = require("../models/Payment");
const razorpay = require('../config/razorpay');
const axios = require("axios");
const path = require('path');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

const createPayment = async (req, res) => 
{
    try 
    {
        const userId = "67ed1b8cc3530ee4a7f936b8";
        const orderId = req.params.orderId;
        const token = req.headers.authorization;
        if (!orderId) 
        {
            return res.status(400).json({ message: "Order ID is required" });
        }

        // Fetch order details
        const orderResponse = await axios.get(`http://localhost:8000/api/orders/getorderbyid/${orderId}`,
            {headers: { Authorization: token }}
        );
        const order = orderResponse.data;

        if (!order) 
        {
            return res.status(404).json({ message: "Order not found" });
        }


       const amount = order.order.totalAmount; 
       await order.save();
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${orderId}`,
            notes: { userId, orderId }
        };

        if(order.accepted==="true")
        {
            const razorpayOrder = await razorpay.orders.create(options);
            console.log(razorpayOrder);
        
            const payment = new Payment({
                userId,
                orderId,
                razorpayOrderId: razorpayOrder.id,
                amount,
                status: "pending"
            });
            console.log(payment);
            await payment.save();

            res.status(201).json({
                success: true,
                message: "Payment initiated",
                razorpayOrder
            });
    }

    else
    {
        console.log("Order not accepted yet");
        res.status(400).json({ message: "Order not accepted yet" });
    }
}
    
   catch (error) 
    {
        res.status(500).json({ message: "Error creating payment", error: error.message });
    }
};

const verifyPayment = async(req, res) => 
{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = Razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
  
    try 
    {
        const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
        if (isValidSignature) 
        {
            // Update the order/payment details in your database as needed.
            // (For example, you might find the payment record by razorpayOrderId and update it.)
            res.status(200).json({ status: 'ok' });
            console.log("Payment verification successful");
        } 
        
        const event = req.body.event;
        if (event === "payment.captured") 
        {
            const { order_id, payment_id, amount } = req.body.payload.payment.entity;

            const order=await Order.findById(order_id);
            if (!order) 
            {
                return res.status(404).json({ message: "Order not found" });
            }

            order.status="pending";
            await order.save();
            // Update payment status
            const payment = await Payment.findOneAndUpdate(
                { razorpayOrderId: order_id },
                { razorpayPaymentId: payment_id, status: "completed", amount },
                { new: true }
            );

            if (payment) 
            {
    
                await axios.put(`http://localhost:8000/api/orders/updateorder/${payment.orderId}`, 
                {
                    status: "paid"
                });

                console.log("Payment Successful, Order Updated:", payment_id);
            }
        }
        
        else
        {
            res.status(400).json({ status: 'verification_failed' });
            console.log("Payment verification failed");
        }

    } 
    
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Error verifying payment' });
    }
};

const success = (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'success.html'));
};

module.exports = { createPayment, verifyPayment, success };
