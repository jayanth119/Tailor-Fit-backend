const crypto = require("crypto");
const axios = require("axios");
const Payment = require("../../models/Payment");

const verifypayment = async (req, res) => 
{
    try 
    {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        const razorpaySignature = req.headers["x-razorpay-signature"];

        if (expectedSignature !== razorpaySignature)
        {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const event = req.body.event;

        if (event === "payment.captured") 
        {
            const { order_id, payment_id, amount } = req.body.payload.payment.entity;

            // Update payment status
            const payment = await Payment.findOneAndUpdate(
                { razorpayOrderId: order_id },
                { razorpayPaymentId: payment_id, status: "completed", amount },
                { new: true }
            );

            if (payment) 
            {
    
                await axios.put(`http://localhost:3002/api/orders/updateorder/${payment.orderId}`, 
                {
                    status: "paid"
                });

                console.log("Payment Successful, Order Updated:", payment_id);
            }
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(500).json({ error: "Webhook handling failed" });
    }
};

module.exports = verifypayment;
