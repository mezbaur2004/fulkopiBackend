const mongoose=require('mongoose');

const DataSchema=mongoose.Schema({
    brandName:{type:String,unique:true,required:true},
    slug:{type:String,unique:true,required:true},
    status:{type:Boolean,required:true},
    brandImg:{type:String,required:true}
},{timestamps:true,versionKey:false})

const BrandModel=mongoose.model('brands',DataSchema);
module.exports=BrandModel;