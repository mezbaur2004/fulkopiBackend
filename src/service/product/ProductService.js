const mongoose=require('mongoose');

const BrandListService=async (req, brandModel)=>{
    try {
        let data=await brandModel.find({status:true});
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}


const CategoryListService=async (req,categoryModel)=>{
    try {
        let data=await categoryModel.find({status:true});
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

const ProductListService=async (req,productModel)=>{
    try {
        let data=await productModel.aggregate([
            {$match:{status:true}},
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brandID',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            {$unwind: '$brand'},
            {$match:{"brand.status":true}},
            {$lookup: {
                from: 'categories',
                localField: 'categoryID',
                foreignField: '_id',
                as: 'category'
                }
            },
            {$unwind: '$category'},
            {$match:{"category.status":true}},
            {
                $project: {
                    _id:1,
                    title: 1,
                    slug: 1,
                    price: 1,
                    discount: 1,
                    discountPrice: 1,
                    image: 1,
                    stock: 1,
                    remarks: 1,
                    brand: { brandName: 1, brandImg: 1 },
                    category: { categoryName: 1, categoryImg: 1 }
                }
            }
            ])
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

const ListByBrandService=async (req,productModel)=>{
    try{
        let brandID=new mongoose.Types.ObjectId(req.params.brandID)
        let MatchStage={$match:{brandID:brandID, status:true}}
        let JoinWithBrandStage={$lookup:{from: 'brands',localField: 'brandID',foreignField: '_id', as:"brand"}}
        let JoinWithCategoryStage={$lookup:{from:'categories',localField: 'categoryID',foreignField: '_id', as:"category"}}
        let UnwindBrandStage={$unwind:'$brand'}
        let BrandStatusCheck={$match:{"brand.status":true}}
        let UnwindCategoryStage={$unwind:'$category'}
        let CategoryStatusCheck={$match:{"category.status":true}}
        let ProjectionStage={$project:{categoryID: 0,brandID:0, 'brand._id':0,'category._id':0}}
        let data= await productModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage,BrandStatusCheck,UnwindCategoryStage, CategoryStatusCheck,ProjectionStage
        ])
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

const ListByCategoryService=async (req,productModel)=>{
    try{
        let categoryID=new mongoose.Types.ObjectId(req.params.categoryID)
        let MatchStage={$match:{categoryID:categoryID, status:true}}
        let JoinWithBrandStage={$lookup:{from: 'brands',localField: 'brandID',foreignField: '_id', as:"brand"}}
        let JoinWithCategoryStage={$lookup:{from:'categories',localField: 'categoryID',foreignField: '_id', as:"category"}}
        let UnwindBrandStage={$unwind:'$brand'}
        let BrandStatusCheck={$match:{"brand.status":true}}
        let UnwindCategoryStage={$unwind:'$category'}
        let CategoryStatusCheck={$match:{"category.status":true}}
        let ProjectionStage={$project:{categoryID: 0,brandID:0, 'brand._id':0,'category._id':0}}
        let data= await productModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage, BrandStatusCheck,UnwindCategoryStage, CategoryStatusCheck,ProjectionStage
        ])
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

const ListByKeywordService=async (req,productModel)=>{
    try {
        let SearchRegex={"$regex":req.params.keyword,"$options":"i"};
        let SearchParams=[{title:SearchRegex},{des:SearchRegex}];
        let MatchStage={$match:{status:true, $or:SearchParams}};
        let JoinWithBrandStage={$lookup:{from: 'brands',localField: 'brandID',foreignField: '_id', as:"brand"}}
        let JoinWithCategoryStage={$lookup:{from:'categories',localField: 'categoryID',foreignField: '_id', as:"category"}}
        let UnwindBrandStage={$unwind:'$brand'}
        let BrandStatusCheck={$match:{"brand.status":true}}
        let UnwindCategoryStage={$unwind:'$category'}
        let CategoryStatusCheck={$match:{"category.status":true}}
        let ProjectionStage={$project:{categoryID: 0,brandID:0, 'brand._id':0,'category._id':0}}
        let data= await productModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage,BrandStatusCheck,UnwindCategoryStage,CategoryStatusCheck,ProjectionStage
        ])
        return {status:"success",data:data};

    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

const ListByRemarkService=async (req,productModel)=>{
    try{
        let remarks=req.params.remarks;
        let MatchStage={$match:{remarks:remarks, status:true}};
        let JoinWithBrandStage={$lookup:{from:'brands', localField:'brandID',foreignField: '_id', as:"brand"}}
        let JoinWithCategoryStage={$lookup:{from:'categories',localField: 'categoryID',foreignField: '_id', as:"category"}}
        let UnwindBrandStage={$unwind:'$brand'}
        let BrandStatusCheck={$match:{"brand.status":true}}
        let UnwindCategoryStage={$unwind:'$category'}
        let CategoryStatusCheck={$match:{"category.status":true}}
        let ProjectionStage={$project:{brandID:0,categoryID:0,'brand._id':0,'category._id':0}}
        let data= await productModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage, BrandStatusCheck,UnwindCategoryStage, CategoryStatusCheck,ProjectionStage
        ])
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

const ProductDetailsService=async (req,productModel)=>{
    try {
        let {slug}=req.params;
        let MatchStage={$match:{slug:slug,status:true}};
        let JoinWithBrandStage={$lookup:{from:'brands', localField:'brandID',foreignField: '_id', as:"brand"}}
        let JoinWithCategoryStage={$lookup:{from:'categories',localField: 'categoryID',foreignField: '_id', as:"category"}}
        let UnwindBrandStage={$unwind:'$brand'}
        let BrandStatusCheck={$match:{"brand.status":true}}
        let UnwindCategoryStage={$unwind:'$category'}
        let CategoryStatusCheck={$match:{"category.status":true}}
        let ProjectionStage={$project:{'brand._id':0,'category._id':0}}
        let data= await productModel.aggregate([
            MatchStage,JoinWithBrandStage,JoinWithCategoryStage,UnwindBrandStage, BrandStatusCheck,UnwindCategoryStage, CategoryStatusCheck, ProjectionStage
        ])
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

module.exports={BrandListService, CategoryListService, ProductListService, ListByBrandService, ListByCategoryService, ListByKeywordService, ListByRemarkService, ProductDetailsService};