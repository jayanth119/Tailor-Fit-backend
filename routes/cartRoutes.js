const express = require("express");
const { addToCart, removeFromCart, clearCart, getCart } = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add/:productId",authMiddleware, addToCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);
router.delete("/clear/:userId", authMiddleware, clearCart);
router.get("/getcart/:userId", getCart);


module.exports = router;