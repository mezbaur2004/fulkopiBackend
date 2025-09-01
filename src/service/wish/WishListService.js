const mongoose = require('mongoose')
const WishListService=async (req,wishModel)=>{
    try{
        let user_id=new mongoose.Types.ObjectId(req.headers.user_id);
        let MatchStage={$match:{userID:user_id}}
        let JoinWithProductStage={$lookup:{from:'products', localField:'productID',foreignField:'_id', as: 'product'}}
        let UnwindProduct={$unwind:'$product'};
        let ProductStatusCheck={$match:{"product.status":true}}
        let JoinWithBrandStage={$lookup: {from:"brands",localField:'product.brandID',foreignField:'_id', as: 'brand'}}
        let UnwindBrandStage={$unwind:'$brand'}
        let BrandStatusCheck={$match:{"brand.status":true}}
        let JoinWithCategoryStage={$lookup:{from:"categories", localField:'product.categoryID',foreignField:'_id', as: 'category'}}
        let UnwindCategoryStage={$unwind:'$category'}
        let CategoryStatusCheck={$match:{"category.status":true}}

        let data=await wishModel.aggregate([MatchStage,JoinWithProductStage,UnwindProduct,ProductStatusCheck,JoinWithBrandStage,UnwindBrandStage,BrandStatusCheck,JoinWithCategoryStage,UnwindCategoryStage,CategoryStatusCheck]);
        return {status:"success",data:data};
    }catch (error){
        return {status:"failed", data:error.toString()}
    }
}

const AddWishListService=async (req,wishModel)=>{
    try{
        let user_id= req.headers.user_id
        let reqBody=req.body
        reqBody.userID=user_id
        //updateOne with upsert actually creates one. But if already exists, it updates it
        await wishModel.updateOne(reqBody,{$set:reqBody},{upsert:true})
        return {status:"success",message:"Wish List Save Success"}
    }catch (error){
        return {status:"failed", data:error.toString()}
    }
}

const RemoveWishListService=async (req,wishModel)=>{
    try{
        let user_id= req.headers.user_id
        let reqBody=req.body
        reqBody.userID=user_id
        await wishModel.deleteOne(reqBody)
        return {status:"success",message:"Wish List Remove Success"}
    }catch (error){
        return {status:"failed", data:error.toString()}
    }
}

module.exports={WishListService,AddWishListService,RemoveWishListService};