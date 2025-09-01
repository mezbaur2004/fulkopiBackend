const {CartListService, AddCartListService, UpdateCartListService,RemoveCartListService} = require('../../service/cart/CartListService');
const cartModel = require('../../model/cartModel');

exports.CartList=async(req,res)=>{
    let result=await CartListService(req,cartModel)
    return res.status(200).send(result);
}

exports.AddCartList=async(req,res)=>{
    let result=await AddCartListService(req,cartModel)
    return res.status(200).send(result);
}

exports.UpdateCartList=async(req,res)=>{
    let result=await UpdateCartListService(req,cartModel)
    return res.status(200).send(result);
}

exports.RemoveCartList=async(req,res)=>{
    let result=await RemoveCartListService(req,cartModel)
    return res.status(200).send(result);
}