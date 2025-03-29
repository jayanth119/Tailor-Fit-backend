const express=require('express');
const router=express.Router();
const {createProduct,getAllProducts,getProductById,updateProduct,deleteProduct,searchProductsByName}=require('../controllers/productController');

router.post('/add',createProduct);
router.get('/getproducts',getAllProducts);
router.get('/getproduct/:id',getProductById);
router.put('/updateproduct/:id',updateProduct);
router.delete('/deleteproduct/:id',deleteProduct);
router.get('/getproductbyname',searchProductsByName);
module.exports=router;
