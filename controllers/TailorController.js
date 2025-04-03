const Tailor = require("../models/Tailor");
const Order = require("../models/Order");


const getAcceptedOrders = async (req, res) => 
{
  try {
    const { tailorId } = req.params.tailorId;
    if (!tailorId) return res.status(400).json({ message: "Tailor ID is required" });

    const tailor = await Tailor.findById(tailorId).populate(" acceptedOrders");

    if (!tailor) return res.status(404).json({ message: "Tailor orders not found" });

    res.status(200).json({ acceptedOrders: tailor.acceptedOrders });
  } 

  catch (error) 
  {
    res.status(500).json({ message: error.message});
  }
};


const OrderAccept = async (req, res) => 
{
  try 
  {
    const  orderId  = req.params.orderId; 

    if (!orderId) 
    {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) 
    {
      return res.status(404).json({ message: "Order not found" });
    }

    const tailorId=order.tailorId;

    const tailor = await Tailor.findOne({tailorId});
    if (!tailor) 
    {
      return res.status(404).json({ message: "Tailor not found" });
    }


    order.accepted = "true";
    await order.save();

    if (!tailor.acceptedOrders.includes(orderId)) {
      tailor.acceptedOrders.push(orderId);
      await tailor.save();
    }

    res.status(200).json({ message: "Order accepted by tailor", order, tailor });
  } 
  
  catch (error) 
  {
    res.status(500).json({ message: error.message });
  }
};



const OrderReject = async (req, res) => {
    try {
      const  orderId  = req.params.orderId; 
  
      if (!orderId) 
      {
        return res.status(400).json({ message: "Order ID is required" });
      }
  
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      
      const tailorId=order.tailorId;
      const tailor = await Tailor.findOne({tailorId});
      if (!tailor) 
    {
        return res.status(404).json({ message: "Tailor not found for this user" });
      }
  
  
      order.accepted = "false";
      await order.save();
  
      if (!tailor.acceptedOrders.includes(orderId)) {
        tailor.acceptedOrders.push(orderId);
        await tailor.save();
      }
  
      res.status(200).json({ message: "Order not accepted by tailor", order, tailor });
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports={getAcceptedOrders,OrderAccept,OrderReject};
