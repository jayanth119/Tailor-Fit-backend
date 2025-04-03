const axios = require("axios"); 
const Cart = require("../models/Cart");
const mongone = require("mongoose");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
    try {
      // Simulated user id (replace with real auth logic)
      const userId = "67ed1b8cc3530ee4a7f936b8";
      const productId = req.params.productId;
      let { quantity, tailorName } = req.body;
  
      // Validate and set defaults for quantity and tailorName
      quantity = typeof quantity === "number" && quantity > 0 ? quantity : 1;
      tailorName = tailorName ? tailorName : "Default Tailor";
  
      // Fetch the product
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Fetch or initialize the cart for the user
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [], totalPrice: 0 });
      }
  
      // Check if the product (with the same tailorName) already exists in the cart
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.tailorName === tailorName
      );
  
      if (itemIndex > -1) {
        // Update the existing item's quantity (ensuring quantity is a number)
        cart.items[itemIndex].quantity =
          (typeof cart.items[itemIndex].quantity === "number"
            ? cart.items[itemIndex].quantity
            : 0) + quantity;
      } else {
        // Add new product to cart with validated fields
        cart.items.push({
          productId,
          quantity,
          price: product.price, // Assumes product.price is a valid number
          tailorName,
        });
      }
  
      // Recalculate the total price safely by checking each item
      cart.totalPrice = cart.items.reduce((sum, item) => {
        const itemQuantity =
          typeof item.quantity === "number" && item.quantity > 0 ? item.quantity : 0;
        const itemPrice =
          typeof item.price === "number" && item.price > 0 ? item.price : 0;
        return sum + itemQuantity * itemPrice;
      }, 0);
  
      await cart.save();
      res.status(200).json({ message: "Item added to cart", cart });
    } catch (error) {
      console.error("Add to cart error:", error.message);
      res.status(500).json({ error: "Something went wrong" });
    }
  };
  






// Remove from Cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const  productId  = req.params.productId; 

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        
        const initialItemCount = cart.items.length;
        cart.items = cart.items.filter(item => 
            !(item.productId.toString() === productId.toString())
        );

        if (cart.items.length === initialItemCount) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        await cart.save();

        res.status(200).json({ message: "Item removed", cart });
    } catch (error) {
        console.error("Remove from cart error:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Clear Cart
const clearCart = async (req, res) => {
    try 
    {
        const  userId = req.params.userId;
        await Cart.findOneAndDelete({ userId });

        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        console.error("Clear cart error:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};

// Get Cart
const getCart = async (req, res) => {
    try {
        const  userId  = req.params.userId;
        
        const cart = await Cart.findOne({ userId });
        //console.log("cart",cart);
        if (!cart) return res.status(404).json({ message: "Cart is empty" });

        res.status(200).json(cart);
    }
    catch (error) 
    {
        console.error("Get cart error:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = { addToCart, removeFromCart, clearCart, getCart };
