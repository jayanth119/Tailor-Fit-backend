const express = require("express");
const { 
    placeOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrderStatus, 
    deleteOrder,
    confirmAndPayOrder
} = require("../controllers/OrderController");

 

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Order routes
router.get("/placeorder", placeOrder);
router.post("/confirmorder/:orderId", authMiddleware, confirmAndPayOrder);
router.get("/getorders", getAllOrders);
router.get("/getorderbyid/:id", authMiddleware, getOrderById);
router.put("/updateorder/:id", authMiddleware, updateOrderStatus);
router.delete("/delete/:id", authMiddleware, deleteOrder);

module.exports = router;
