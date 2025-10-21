const express=require('express');
const userController=require('../controller/user/userController');
const productController=require('../controller/product/productController');
const wishListController=require('../controller/wish/wishListController');
const cartListController=require('../controller/cart/cartListController');
const invoiceController=require('../controller/invoice/invoiceController');
const productCreateUpdateController=require('../controller/admin/ProductCreateUpdateController')
const productUpdateUpdateController = require("../controller/admin/ProductCreateUpdateController");
const userInvoiceController=require('../controller/admin/UserInvoiceController');
const {AuthMiddleware, AdminMiddleware, ValidationMiddleware, rateLimitMiddleware} = require("../middleware/Middlewares");
const {ProductValidator} = require("../validators/ProductValidator");
const {BrandValidator} = require("../validators/BrandValidator");
const {CategoryValidator} = require("../validators/CategoryValidator");
const {RegistrationValidator} = require("../validators/RegistrationValidator");


const router=express.Router();

//User
router.post("/registration",rateLimitMiddleware,RegistrationValidator,ValidationMiddleware,userController.Registration);
router.post("/login",rateLimitMiddleware,userController.Login);
router.get("/profileDetails",AuthMiddleware,userController.profileDetails);
router.post("/google",userController.googleUser);

//Product
router.get("/brandList",productController.brandList);
router.get("/categoryList",productController.categoryList);
router.get("/productList",productController.productList);
router.get('/listByBrand/:slug',productController.listByBrand);
router.get('/listByCategory/:slug',productController.listByCategory);
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


//Admin Dashboard---------------------------------------------------------------------------------------------------------------------------------------



router.get('/adminProductList',AuthMiddleware,AdminMiddleware,productCreateUpdateController.productList);
router.get('/adminProductDetails/:id',AuthMiddleware,AdminMiddleware,productUpdateUpdateController.singleProduct);
router.post('/productCreate',AuthMiddleware,AdminMiddleware,ProductValidator,ValidationMiddleware,productCreateUpdateController.productCreate);
router.put('/productUpdate/:id',AuthMiddleware,AdminMiddleware,ProductValidator,ValidationMiddleware,productUpdateUpdateController.productUpdate);

router.get('/adminBrandList',AuthMiddleware,AdminMiddleware,productCreateUpdateController.brandList);
router.get('/adminBrandDetails/:id',AuthMiddleware,AdminMiddleware,productUpdateUpdateController.singleBrand);
router.post('/BrandCreate',AuthMiddleware,AdminMiddleware,BrandValidator,ValidationMiddleware,productCreateUpdateController.brandCreate);
router.put('/BrandUpdate/:id',AuthMiddleware,AdminMiddleware,BrandValidator,ValidationMiddleware,productUpdateUpdateController.brandUpdate);

router.get('/adminCategoryList',AuthMiddleware,AdminMiddleware,productCreateUpdateController.categoryList);
router.get('/adminCategoryDetails/:id',AuthMiddleware,AdminMiddleware,productUpdateUpdateController.singleCategory);
router.post('/CategoryCreate',AuthMiddleware,AdminMiddleware,CategoryValidator,ValidationMiddleware,productCreateUpdateController.categoryCreate);
router.put('/CategoryUpdate/:id',AuthMiddleware,AdminMiddleware,CategoryValidator,ValidationMiddleware,productUpdateUpdateController.categoryUpdate);

router.get('/userList',AuthMiddleware,AdminMiddleware,userInvoiceController.userList);
//router.put("/profileUpdate/:id",RegistrationValidator,ValidationMiddleware,AuthMiddleware,AdminMiddleware,userController.updateProfile);
router.get('/oneUserInvoiceList/:id',AuthMiddleware,AdminMiddleware,userInvoiceController.oneUserInvoiceList);

router.get('/userInvoiceList',AuthMiddleware,AdminMiddleware,userInvoiceController.userInvoiceList);
router.get('/invoiceProducts/:id',AuthMiddleware,AdminMiddleware,userInvoiceController.invoiceProductList);

module.exports=router;

