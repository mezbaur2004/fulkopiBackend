const express=require('express');
const userController=require('../controller/user/userController');
const productController=require('../controller/product/productController');
const wishListController=require('../controller/wish/wishListController');
const cartListController=require('../controller/cart/cartListController');
const invoiceController=require('../controller/invoice/invoiceController');
const productCreateUpdateController=require('../controller/admin/ProductCreateUpdateController')
const productUpdateUpdateController = require("../controller/admin/ProductCreateUpdateController");
const userInvoiceController=require('../controller/admin/UserInvoiceController');
const {AuthMiddleware, AdminMiddleware} = require("../middleware/AuthMiddleware");


const router=express.Router();

//User
router.post("/registration",userController.Registration);
router.post("/login",userController.Login);
router.get("/profileDetails",AuthMiddleware,userController.profileDetails);
router.put("/profileUpdate",AuthMiddleware,userController.updateProfile);
router.post("/google",userController.googleUser);

//Product
router.get("/brandList",productController.brandList);
router.get("/categoryList",productController.categoryList);
router.get("/productList",productController.productList);
router.get('/listByBrand/:brandID',productController.listByBrand);
router.get('/listByCategory/:categoryID',productController.listByCategory);
router.get('/listByKeyword/:keyword',productController.listByKeyword);
router.get('/listByRemark/:remarks',productController.listByRemark);
router.get('/productDetails/:slug',productController.productDetails);

//Wish
router.post('/addWishList',AuthMiddleware,wishListController.AddWishList);
router.get('/wishList',AuthMiddleware,wishListController.WishList);
router.delete('/removeWish',AuthMiddleware,wishListController.RemoveWishList);

//Cart
router.post('/addToCart',AuthMiddleware,cartListController.AddCartList);
router.get('/cartList',AuthMiddleware,cartListController.CartList);
router.put('/updateCart/:cartID',AuthMiddleware,cartListController.UpdateCartList)
router.delete('/removeCart',AuthMiddleware,cartListController.RemoveCartList);

//Invoice
router.post('/createInvoice',AuthMiddleware,invoiceController.CreateInvoice);

router.post('/PaymentSuccess',invoiceController.PaymentSuccess);
router.post('/PaymentCancel',invoiceController.PaymentCancel);
router.post('/PaymentFail',invoiceController.PaymentFail);
router.post('/PaymentIPN',invoiceController.paymentIPN);

router.get('/InvoiceList',AuthMiddleware,invoiceController.invoiceList);
router.get('/InvoiceProductList/:invoice_id',AuthMiddleware,invoiceController.invoiceProductList);

router.post('/productCreate',AuthMiddleware,AdminMiddleware,productCreateUpdateController.productCreate);
router.put('/productUpdate/:id',AuthMiddleware,AdminMiddleware,productUpdateUpdateController.productUpdate);

//Admin Dashboard

router.post('/BrandCreate',AuthMiddleware,AdminMiddleware,productCreateUpdateController.brandCreate);
router.put('/BrandUpdate/:id',AuthMiddleware,AdminMiddleware,productUpdateUpdateController.brandUpdate);

router.post('/CategoryCreate',AuthMiddleware,AdminMiddleware,productCreateUpdateController.categoryCreate);
router.put('/CategoryUpdate/:id',AuthMiddleware,AdminMiddleware,productUpdateUpdateController.categoryUpdate);

router.get('/userList',AuthMiddleware,AdminMiddleware,userInvoiceController.userList);
router.get('/userInvoiceList',AuthMiddleware,AdminMiddleware,userInvoiceController.userInvoiceList);

module.exports=router;