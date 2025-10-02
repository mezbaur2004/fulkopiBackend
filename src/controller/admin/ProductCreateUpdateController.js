const productModel = require("../../model/productModel");
const brandModel=require("../../model/brandModel");
const categoryModel=require("../../model/categoryModel");
const {ProductListService, ProductCreateService, ProductUpdateService, BrandListService, BrandCreateService, BrandUpdateService, CategoryListService, CategoryCreateService,
    CategoryUpdateService,
    SingleProduct,
    SingleBrand,
    SingleCategory
} = require("../../service/admin/ProductCreateUpdateService");

exports.productList=async (req,res)=>{
    let result= await ProductListService(req,productModel);
    return res.status(200).send(result);
}

exports.singleProduct=async (req,res)=>{
    let result = await SingleProduct(req,productModel);
    return res.status(200).send(result);
}

exports.productCreate=async (req,res)=>{
    let result= await ProductCreateService(req,productModel);
    return res.status(200).send(result);
}

exports.productUpdate=async (req,res)=>{
    let result= await ProductUpdateService(req,productModel);
    return res.status(200).send(result);
}

exports.brandList=async (req,res)=>{
    let result= await BrandListService(req,brandModel);
    return res.status(200).send(result);
}


exports.singleBrand=async (req,res)=>{
    let result = await SingleBrand(req,brandModel);
    return res.status(200).send(result);
}

exports.brandCreate=async (req,res)=>{
    let result= await BrandCreateService(req,brandModel);
    return res.status(200).send(result);
}

exports.brandUpdate=async (req,res)=>{
    let result= await BrandUpdateService(req,brandModel);
    return res.status(200).send(result);
}

exports.categoryList=async (req,res)=>{
    let result= await CategoryListService(req,categoryModel);
    return res.status(200).send(result);
}


exports.singleCategory=async (req,res)=>{
    let result = await SingleCategory(req,categoryModel);
    return res.status(200).send(result);
}

exports.categoryCreate=async (req,res)=>{
    let result= await CategoryCreateService(req,categoryModel);
    return res.status(200).send(result);
}

exports.categoryUpdate=async (req,res)=>{
    let result= await CategoryUpdateService(req,categoryModel);
    return res.status(200).send(result);
}
