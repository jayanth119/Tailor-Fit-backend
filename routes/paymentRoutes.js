const express = require("express");
const router = express.Router();
const { createPayment, verifyPayment, success } = require("../controllers/paymentController");
const authMiddleware = require('../middleware/authMiddleware');

router.post("/create/:orderId", createPayment);


router.post("/verify", verifyPayment);

router.get("/success", success);

module.exports = router;
