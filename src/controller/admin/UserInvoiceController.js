const {UserListService,UserInvoiceListService, InvoiceProductListService, OneUserInvoiceService}=require('../../service/admin/UserInvoiceService');
const userModel=require('../../model/userModel');
const invoiceModel=require('../../model/invoiceModel');
const invoiceProductModel  =  require('../../model/invoiceProductModel');

exports.userList=async (req,res)=>{
    let result= await UserListService(req,userModel);
    return res.status(200).send(result);
}

exports.oneUserInvoiceList=async (req,res)=>{
    let result=await OneUserInvoiceService(req,invoiceModel);
    return res.status(200).send(result);
}

exports.userInvoiceList=async (req,res)=>{
    let result= await UserInvoiceListService(req,invoiceModel);
    return res.status(200).send(result);
}

exports.invoiceProductList=async (req,res)=>{
    let result= await InvoiceProductListService(req,invoiceProductModel);
    return res.status(200).send(result);
}