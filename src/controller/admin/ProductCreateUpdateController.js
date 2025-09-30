const productModel = require("../../model/productModel");
const brandModel=require("../../model/brandModel");
const categoryModel=require("../../model/categoryModel");
const {ProductCreateService, ProductUpdateService, BrandCreateService, BrandUpdateService, CategoryCreateService,
    CategoryUpdateService
} = require("../../service/admin/ProductCreateUpdateService");

exports.productCreate=async (req,res)=>{
    let result= await ProductCreateService(req,productModel);
    return res.status(200).send(result);
}

exports.productUpdate=async (req,res)=>{
    let result= await ProductUpdateService(req,productModel);
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

exports.categoryCreate=async (req,res)=>{
    let result= await CategoryCreateService(req,categoryModel);
    return res.status(200).send(result);
}

exports.categoryUpdate=async (req,res)=>{
    let result= await CategoryUpdateService(req,categoryModel);
    return res.status(200).send(result);
}
