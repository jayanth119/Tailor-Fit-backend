const Order = require("../models/Order");
const axios = require("axios");

const placeOrder = async (req, res) => 
{
    try 
    {
        const userId = req.user.userId;
        const token = req.headers.authorization;

        const cartResponse = await axios.get(
            `http://localhost:8000/api/cart/getcart/${userId}`,
            { headers: { Authorization: token } }
        );

        const cart = cartResponse.data;
        //console.log(cart);
        const tailorId=cart.tailorId;

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Your cart is empty" });
        }

        const totalAmount = cart.totalPrice;
        const orderProducts = cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
        }));

        const order = new Order({
            userId,
            tailorId,
            items: orderProducts,
            totalAmount,
            status: "Processing",
            accepted:"false"

        });

        console.log(order);
        
        await order.save();  

        
        res.status(200).json({
            orderId: order._id,
            tailorId,
            success: true,
            message: "Please confirm to proceed with payment.",
            amount: totalAmount,
            cartItems: cart.items
        });
        

    } catch (error) {
        //console.error(error);  
        res.status(500).json({ error: error.message });
    }
};


const confirmAndPayOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const token = req.headers.authorization;
        console.log(orderId);
        console.log(token);
        const paymentResponse = await axios.post(
            `http://localhost:8000/api/payment/create/${orderId}`,
            {}, 
            { headers: { Authorization: token } }
        );
        

        const { status, error } = paymentResponse.data;

        if (status !== "completed") 
        {
            return res.status(400).json({ 
                message: "Payment failed. Order not confirmed.", 
                reason: error || "Unknown error"
            });
        }

        
        await axios.delete(
            `http://localhost:8000/api/cart/clear/${userId}`,
            { headers: { Authorization: token } }
        );

        res.status(200).json({
            success: true,
            message: "Order confirmed and payment successful",
            order
        });

    } catch (error) {
       console.error(error.message); 
        res.status(500).json({ error: error.message });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { page = 1, limit = 5 } = req.query;

        const totalOrders = await Order.countDocuments({ userId });


       // console.log(totalOrders);
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

        console.log(orders);

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


const getOrderById = async (req, res) =>
 {
    try {
        const orderId  = req.params.id;

        const order = await Order.findById(orderId)
             .populate({
                 path: "items.productId",
                 select: "name price image description"
             });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

    res.status(200).json({ success: true, order});

    } 
    catch (error) 
    {
        console.error("Error fetching order products:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
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