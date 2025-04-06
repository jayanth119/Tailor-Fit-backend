const express = require("express");
const router = express.Router();

const {showAllOrders,getAcceptedOrders,OrderAccept,OrderReject,totalOrders,completedOrders,pendingOrders,markAsCompleted , getOrderSummary} =require("../controllers/TailorController");

router.get("/getallorders/:tailorId", showAllOrders);

router.put('/accept-order/:orderId/:tailorId', OrderAccept); 
router.put("/reject-order/:orderId/:tailorId", OrderReject);

router.get("/accepted-orders/:orderId/:tailorId", getAcceptedOrders);
router.get("/order-summary/:tailorId", getOrderSummary);
// router.get("/total-orders/:tailorId", totalOrders);
// router.get("/completed-orders/:tailorId", completedOrders);
// router.get("/pending-orders/:tailorId", pendingOrders);

router.get("/mark-as-completed/:orderId", markAsCompleted);

module.exports = router;
