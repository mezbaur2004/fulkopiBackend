const express=require('express');
const AuthMiddlewere=require('../middleware/AuthMiddlewere');
const userController=require('../controller/user/userController');
const productController=require('../controller/product/productController');

const router=express.Router();

//User
router.post("/registration",userController.Registration);
router.get("/login",userController.Login);
router.get("/profileDetails",AuthMiddlewere,userController.profileDetails);
router.post("/profileUpdate",AuthMiddlewere,userController.updateProfile);

//Product
router.get("/brandList",productController.brandList);
router.get("/categoryList",productController.categoryList);
router.get("/productList",productController.productList);
router.get('/listByBrand/:brandID',productController.listByBrand);
router.get('/listByCategory/:categoryID',productController.listByCategory);
router.get('/listByKeyword/:keyword',productController.listByKeyword);
router.get('/listByRemark/:remarks',productController.listByRemark);
router.get('/productDetails/:id',productController.productDetails);






module.exports=router;