const mongoose = require('mongoose')
const CartListService=async (req,cartModel)=>{
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
        let ProjectionStage={$project:{
                'userID':0,'product._id':0,
                'product.categoryID':0,'product.brandID':0,
                'brand._id':0,'category._id':0,
                "product.createdAt": 0,
                "product.updatedAt": 0,
                "brand.createdAt": 0,
                "category.createdAt": 0,
            }}

        let data=await cartModel.aggregate([MatchStage,JoinWithProductStage,UnwindProduct,ProductStatusCheck,JoinWithBrandStage,UnwindBrandStage,BrandStatusCheck,JoinWithCategoryStage,UnwindCategoryStage,CategoryStatusCheck,ProjectionStage]);
        return {status:"success",data:data};
    }catch (error){
        return {status:"failed", data:error.toString()}
    }
}

const AddCartListService = async (req, cartModel) => {
    try {
        let user_id = req.headers.user_id;
        let { productID, qty } = req.body;

        // Ensure qty is at least 1
        qty = qty && qty > 0 ? qty : 1;

        // Check if product already exists in cart
        let existingCartItem = await cartModel.findOne({ userID: user_id, productID });

        if (existingCartItem) {
            // If exists, increment qty
            existingCartItem.qty += qty;
            await existingCartItem.save();
            return { status: "success", message: "Product quantity updated in cart" };
        } else {
            // Else, create new item
            await cartModel.create({ userID: user_id, productID, qty });
            return { status: "success", message: "Product added to cart" };
        }
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const UpdateCartListService=async (req,cartModel)=>{
    try{
        let user_id=req.headers.user_id
        let {qty}=req.body
        let cartID=req.params.cartID
        let result=await cartModel.updateOne({_id:cartID,userID:user_id},{$set:{qty}});
        if (result.modifiedCount === 0) {
            return { status: "failed", data: "No changes made or cart item not found" };
        }

        return { status: "success", message: "Cart updated successfully" };
    }catch (error){
        return {status:"failed", data:error.toString()}
    }
}

const RemoveCartListService=async (req,cartModel)=>{
    try{
        let user_id=req.headers.user_id
        let reqBody=req.body
        reqBody.userID=user_id;
        await cartModel.deleteOne(reqBody);
        return {status:"success",message:"Cart removed successfully"};
    }catch (error){
        return {status:"failed", data:error.toString()}
    }
}

module.exports={CartListService,AddCartListService,UpdateCartListService,RemoveCartListService};