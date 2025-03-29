const Order = require("../models/Order");
const axios = require("axios");


const placeOrder = async (req, res) => 
{
    try {
        const userId = req.user.userId;
        const token = req.headers.authorization; 

        
        const cartResponse = await axios.get(
            `http://localhost:3001/api/cart/getcart/${userId}`,
            { headers: { Authorization: token } }
        );

        //console.log(cartResponse);
        const cart = cartResponse.data;
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }
        

        const totalAmount = cart.totalPrice;
        //console.log(totalAmount);

        res.status(200).json({
            success: true,
            message: "Please confirm to proceed with payment.",
            Amount:totalAmount,
            cartItems: cart.items
        });

    } catch (error) 
    {
        console.error(error);
        res.status(500).json({ error: "Something went wrong while fetching the bill" });
    }
};


const confirmAndPayOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const token = req.headers.authorization;

    
        const cartResponse = await axios.get(
            `http://localhost:3001/api/cart/getcart/${userId}`,
            { headers: { Authorization: token } }
        );

        const cart = cartResponse.data;
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        const totalAmount = cart.total_price;

        
        const orderProducts = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            tailorName: item.tailorName,
            price: item.price,
        }));

        
        const order = new Order({
            userId,
            products: orderProducts,
            totalAmount,
            status: "Pending"
        });

        await order.save();
        const orderId = order._id;

        
        const paymentResponse = await axios.post(
            `http://localhost:3002/api/payment/createPayment/${orderId}`,
            { headers: { Authorization: token } }
        );

        const { status} = paymentResponse.data;

        
        if (status !== "completed") {
            return res.status(400).json({ message: "Payment failed. Order not confirmed." });
        }

        
        order.status = "Completed";
        await order.save();

        
        await axios.delete(
            `http://localhost:3001/api/cart/clear/${userId}`,
            { headers: { Authorization: token } }
        );

        res.status(200).json({
            success: true,
            message: "Order confirmed and payment successful",
            order
        });

    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong while confirming and paying for the order" });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 5 } = req.query;

        const totalOrders = await Order.countDocuments({ userId });


        
        if (totalOrders === 0) {
            return res.status(200).json({
                success: true,
                totalPages: 0,
                currentPage: 0, 
                totalOrders: 0,
                data: []
            });
        }

        const orders = await Order.find({ userId })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit))
            .populate("products.productId", "name price image")
            .populate("userId", "email name");

        res.status(200).json({
            success: true,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: Number(page),
            totalOrders,
            data: orders
        });

    } catch (error) {
        res.status(500).json({ error: "Something went wrong while fetching orders" });
    }
};


const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ success: true, data: order });
    } 
    catch (error) 
    {
        res.status(500).json({ error: "Something went wrong while fetching order" });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong while updating order status" });
    }
};


const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Something went wrong while deleting order" });
    }
};


module.exports = 
{
    placeOrder,
    confirmAndPayOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};