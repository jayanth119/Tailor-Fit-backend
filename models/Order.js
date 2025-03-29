const mongoose=require("mongoose");

const OrderSchema=new mongoose.Schema({
    userId:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    items:
    [
        {
            productId: { type: mongoose.Schema.Types.ObjectId,  required: true },
            quantity: { type: Number, required: true },
        },
    ],

    totalAmount:
    {
        type:Number,
        required:true
    },
    status:
    {
        type: String,
        enum:["Processing","Shipped","Delivered"],
        default:"Processing"
    }


});
module.exports=mongoose.model("Order",OrderSchema);

