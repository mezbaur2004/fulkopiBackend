const userModel=require('../../model/userModel');
const UserCreateService=require('../../service/user/UserCreateService');
const UserLoginService=require('../../service/user/UserLoginService');
const UserDetailsService=require('../../service/user/UserDetailsService');
const UserUpdateService=require('../../service/user/UserUpdateService');

exports.Registration=async (req,res)=>{
    let result=await UserCreateService(req,userModel);
    res.status(200).json(result);
}

exports.Login=async (req,res)=>{
    let result=await UserLoginService(req,userModel);
    res.status(200).json(result);
}

exports.profileDetails=async (req,res)=>{
    let result=await UserDetailsService(req,userModel);
    res.status(200).json(result);
}

exports.updateProfile=async (req,res)=>{
    let result=await UserUpdateService(req,userModel);
    res.status(200).json(result);
}