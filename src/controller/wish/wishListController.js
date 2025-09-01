const {WishListService, AddWishListService,RemoveWishListService} = require('../../service/wish/WishListService');
const wishModel = require('../../model/wishModel');

exports.WishList=async(req,res)=>{
    let result=await WishListService(req,wishModel)
    return res.status(200).send(result);
}

exports.AddWishList=async(req,res)=>{
    let result=await AddWishListService(req,wishModel)
    return res.status(200).send(result);
}

exports.RemoveWishList=async(req,res)=>{
    let result=await RemoveWishListService(req,wishModel)
    return res.status(200).send(result);
}