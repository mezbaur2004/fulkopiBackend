const mongoose = require("mongoose");
const DataSchema=mongoose.Schema({
    productID:{type:mongoose.Schema.Types.ObjectId, required:true},
    userID:{type:mongoose.Schema.Types.ObjectId, required:true},
    qty:{type:Number,required:true}
},{timestamps:true,versionKey:false});

const cartModel=mongoose.model('carts',DataSchema);
module.exports = cartModel;