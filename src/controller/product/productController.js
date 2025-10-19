const productModel=require('../../model/productModel.js');
const brandModel=require('../../model/brandModel.js');
const categoryModel=require('../../model/categoryModel.js');

const {BrandListService, CategoryListService, ProductListService, ListByBrandService, ListByCategoryService, ListByKeywordService, ListByRemarkService, ProductDetailsService}=require('../../service/product/ProductService');

exports.brandList=async (req,res)=>{
    let result=await BrandListService(req,brandModel);
    return res.status(200).send(result);
}

exports.categoryList=async (req,res)=>{
    let result =await CategoryListService(req,categoryModel);
    return res.status(200).send(result);
}

exports.productList=async (req,res)=>{
    let result =await ProductListService(req,productModel);
    return res.status(200).send(result);
}

exports.listByBrand=async (req,res)=>{
    let result=await ListByBrandService(req,brandModel,productModel);
    return res.status(200).send(result);
}

exports.listByCategory=async (req,res)=>{
    let result= await ListByCategoryService(req,categoryModel,productModel);
    return res.status(200).send(result);
}

exports.listByKeyword=async (req,res)=>{
    let result= await ListByKeywordService(req,productModel);
    return res.status(200).send(result);
}

exports.listByRemark=async (req,res)=>{
    let result= await ListByRemarkService(req,productModel);
    return res.status(200).send(result);
}

exports.productDetails=async (req,res)=>{
    let result= await ProductDetailsService(req,productModel);
    return res.status(200).send(result);
}

