const express = require("express"); 

const { getClothesbyId } = require("../controllers/getClothesControllers");
const router = express.Router();


router.get("/getclothesforuser" , getClothesbyId  )

module.exports = router ; 

