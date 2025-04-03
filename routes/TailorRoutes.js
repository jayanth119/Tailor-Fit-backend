const express = require("express");
const router = express.Router();

const {getAcceptedOrders,OrderAccept,OrderReject,totalOrders,completedOrders,pendingOrders,markAsCompleted}=require("../controllers/TailorController");
router.post("/accept-order/:orderId", OrderAccept); 
router.post("/reject-order/:orderId", OrderReject);
router.get("/accepted-orders/:tailorId", getAcceptedOrders);
router.get("/total-orders/:tailorId", totalOrders);
router.get("/completed-orders/:tailorId", completedOrders);
router.get("/pending-orders/:tailorId", pendingOrders);
router.get("/mark-as-completed/:orderId", markAsCompleted);

module.exports = router;
