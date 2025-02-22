const mongoose=require('mongoose');
const connectToDB =async()=>
{
    try
    {
        await mongoose.connect('mongodb+srv://akshithaoleti:akshi%401408@cluster0.1auzo.mongodb.net/');

        console.log('database connection is established');
    }
    catch(e)
    {
        console.log("connection is failed",e.message);
        process.exit(1);
    }
};
module.exports=connectToDB;