const axios = require("axios"); 
const Cart = require("../models/Cart");
const mongoose = require("mongoose");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
    try {
      const userId = "67f0e33ec34207c80c80f63a";
    
      const productId = req.params.productId; 
      console.log(productId);
      
      const { quantity, tailorId } = req.body;
  
      // Validate request body values
      if (typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({ message: "Invalid or missing quantity" });
      }
      if (!tailorId) {
        return res.status(400).json({ message: "Invalid or missing tailorId" });
      }
  
      let product;
      try {
        product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
      } catch (error) {
        return res.status(400).json({
          message: "Invalid product ID or Product Service is unavailable",
        });
      }
  
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [], totalPrice: 0 });
      }
      console.log(cart);
  
      const itemIndex = cart.items.findIndex((item) =>
        item.productId.toString() === productId.toString()
      );
  
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          price: product.price,
          tailorId,
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
      console.error("Add to cart error:", error);
      res.status(500).json({ error });
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
        // const  userId = req.params.userId;
        const userId = "67f0e33ec34207c80c80f63a";
        await Cart.findOneAndDelete({ userId });

        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        console.error("Clear cart error:", error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
};



const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Retrieve the cart without population
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty", items: [] });
    }

    // Extract all productIds from the cart
    const productIds = cart.items.map(item => item.productId);
    
    // Fetch products using $in query
    const products = await Product.find({ _id: { $in: productIds } }).select("name");
    
    // Create a mapping from productId to product name
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product.name;
    });
    
    // Append product name to each cart item
    const itemsWithName = cart.items.map(item => ({
      ...item.toObject(),
      name: productMap[item.productId.toString()] || "Unknown Product"
    }));
    
    // Return the cart with updated items array including product names
    return res.status(200).json({ ...cart.toObject(), items: itemsWithName });
  } catch (error) {
    console.error("Get cart error:", error.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


module.exports = { addToCart, removeFromCart, clearCart, getCart };
