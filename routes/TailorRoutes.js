const express = require("express");
const router = express.Router();

const {getAcceptedOrders,OrderAccept,OrderReject}=require("../controllers/TailorController");
router.post("/accept-order/:orderId", OrderAccept); 
router.post("/reject-order/:orderId", OrderReject);
router.get("/accepted-orders/:tailorId", getAcceptedOrders);

module.exports = router;
