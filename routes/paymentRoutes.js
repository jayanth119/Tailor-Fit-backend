const express = require("express");
const { createPayment } = require("../controllers/paymentController");
const handleWebhook = require("../routes/webhook/razorpayWebhook");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create/:orderId", authMiddleware, createPayment);
router.post("/webhook", handleWebhook);

module.exports = router;
