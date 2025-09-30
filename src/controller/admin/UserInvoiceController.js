const {UserListService,UserInvoiceListService}=require('../../service/admin/UserInvoiceService');
const userModel=require('../../model/userModel');
const invoiceModel=require('../../model/invoiceModel');

exports.userList=async (req,res)=>{
    let result= await UserListService(userModel);
    return res.status(200).send(result);
}

exports.userInvoiceList=async (req,res)=>{
    let result= await UserInvoiceListService(invoiceModel,userModel);
    return res.status(200).send(result);
}
