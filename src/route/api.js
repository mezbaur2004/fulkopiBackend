const express=require('express');
const AuthMiddlewere=require('../middleware/AuthMiddlewere');
const userController=require('../controller/user/userController');
const productController=require('../controller/product/productController');
const wishListController=require('../controller/wish/wishListController');
const cartListController=require('../controller/cart/cartListController');
const invoiceController=require('../controller/invoice/invoiceController');

const router=express.Router();

//User
router.post("/registration",userController.Registration);
router.post("/login",userController.Login);
router.get("/profileDetails",AuthMiddlewere,userController.profileDetails);
router.put("/profileUpdate",AuthMiddlewere,userController.updateProfile);

//Product
router.get("/brandList",productController.brandList);
router.get("/categoryList",productController.categoryList);
router.get("/productList",productController.productList);
router.get('/listByBrand/:brandID',productController.listByBrand);
router.get('/listByCategory/:categoryID',productController.listByCategory);
router.get('/listByKeyword/:keyword',productController.listByKeyword);
router.get('/listByRemark/:remarks',productController.listByRemark);
router.get('/productDetails/:id',productController.productDetails);

//Wish
router.post('/addWishList',AuthMiddlewere,wishListController.AddWishList);
router.get('/wishList',AuthMiddlewere,wishListController.WishList);
router.delete('/removeWish',AuthMiddlewere,wishListController.RemoveWishList);

//Cart
router.post('/addToCart',AuthMiddlewere,cartListController.AddCartList);
router.get('/cartList',AuthMiddlewere,cartListController.CartList);
router.put('/updateCart/:cartID',AuthMiddlewere,cartListController.UpdateCartList)
router.delete('/removeCart',AuthMiddlewere,cartListController.RemoveCartList);

//Invoice
router.post('/createInvoice',AuthMiddlewere,invoiceController.CreateInvoice);

router.post('/PaymentSuccess',invoiceController.PaymentSuccess);
router.post('/PaymentCancel',invoiceController.PaymentCancel);
router.post('/PaymentFail',invoiceController.PaymentFail);
router.post('/PaymentIPN',invoiceController.paymentIPN);

router.get('/InvoiceList',AuthMiddlewere,invoiceController.invoiceList);
router.get('/InvoiceProductList/:invoice_id',AuthMiddlewere,invoiceController.invoiceProductList);
module.exports=router;