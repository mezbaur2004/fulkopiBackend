const mongoose=require('mongoose');

const DataSchema=mongoose.Schema({
    title:{type:String,required:true},
    slug:{type:String,unique:true,required:true},
    des:{type:String,required:true},
    price:{type:Number,required:true},
    discount:{type:Boolean,required:true},
    discountPrice: {
        type: Number,
        default: null,
        set: function (value) {
            // If discount is false, always force null
            return this.discount ? value : null;
        }
    },
    status:{type:Boolean,required:true},
    image:{type:String,required:true},
    stock:{type:Boolean,required:true},
    remarks:{type:String,required:true},
    categoryID:{type:mongoose.Schema.Types.ObjectId,required:true},
    brandID:{type:mongoose.Schema.Types.ObjectId,required:true}
},{timestamps:true,versionKey:false});

const ProductModel=mongoose.model('products',DataSchema);
module.exports=ProductModel;