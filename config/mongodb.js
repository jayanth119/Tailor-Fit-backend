const mongoose=require('mongoose');
const connectToDB =async()=>
{
    try
    {
        await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.3');

        console.log('database connection is established');
    }
    catch(e)
    {
        console.log("connection is failed",e.message);
        process.exit(1);
    }
};
module.exports=connectToDB;