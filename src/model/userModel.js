const mongoose=require("mongoose")

const DataSchema=mongoose.Schema({
    email:{type:String,required:true,unique:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    mobile:{type:String},
    password:{type:String,required:true},
    photo:{type:String},
    createdDate:{type:Date,default:Date.now},
},{versionKey:false});

const UserModel=mongoose.model('users',DataSchema);
module.exports=UserModel;