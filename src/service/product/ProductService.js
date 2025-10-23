const mongoose=require('mongoose');

const BrandListService=async (req, brandModel)=>{
    try {
        let page= Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 6;
        let skip=(page-1)*limit;
        const total=await brandModel.countDocuments({status:true});
        const data=await brandModel.aggregate([{$match:{status:true}},{$skip:skip},{$limit:limit}]);
        return {status:"success",data:data,
                pagination:{
                total,
                page,
                limit,
                totalPages:Math.ceil(total/limit)
            }};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}


const CategoryListService=async (req,categoryModel)=>{
    try {
        let page= Number(req.query.page) || 1;
        let limit=Number(req.query.limit) || 6;
        let skip=(page-1)*limit;
        const total=await categoryModel.countDocuments({status:true});
        const data=await categoryModel.aggregate([{$match:{status:true}},{$skip:skip},{$limit:limit}]);
        return {status:"success",data:data,
                pagination:{
                total,
                page,
                limit,
                totalPages:Math.ceil(total/limit)
            }
        };
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

const ProductListService = async (req, productModel) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 8;
        let skip = (page - 1) * limit;

        let data = await productModel.aggregate([
            { $match: { status: true } },
            {
                $lookup: {
                    from: "brands",
                    localField: "brandID",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            { $unwind: "$brand" },
            { $match: { "brand.status": true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryID",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
            { $match: { "category.status": true } },

            {
                $facet: {
                    total: [{ $count: "count" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                slug: 1,
                                price: 1,
                                discount: 1,
                                discountPrice: 1,
                                image: 1,
                                stock: 1,
                                remarks: 1,
                                brand: {
                                    brandName: "$brand.brandName",
                                    brandImg: "$brand.brandImg",
                                },
                                category: {
                                    categoryName: "$category.categoryName",
                                    categoryImg: "$category.categoryImg",
                                },
                            },
                        },
                    ],
                },
            },
        ]);

        const total = data[0]?.total[0]?.count || 0;
        return {
            status: "success",
            data: data[0].data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const ListByBrandService = async (req, BrandModel, productModel) => {
    try {
        const slug = req.params.slug;
        const brand = await BrandModel.findOne({ slug, status: true }).select("_id");
        if (!brand) {
            return { status: "fail", data: "Brand not found or inactive" };
        }

        const brandID = brand._id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const data = await productModel.aggregate([
            { $match: { brandID, status: true } },
            {
                $lookup: {
                    from: "brands",
                    localField: "brandID",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            { $unwind: "$brand" },
            { $match: { "brand.status": true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryID",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
            { $match: { "category.status": true } },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                slug: 1,
                                price: 1,
                                discount: 1,
                                discountPrice: 1,
                                image: 1,
                                stock: 1,
                                remarks: 1,
                                "brand.brandName": 1,
                                "brand.brandImg": 1,
                                "category.categoryName": 1,
                                "category.categoryImg": 1,
                            },
                        },
                    ],
                },
            },
        ]);

        const total = data[0]?.total[0]?.count || 0;

        return {
            status: "success",
            data: data[0].data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const ListByCategoryService = async (req, CategoryModel, productModel) => {
    try {
        const slug = req.params.slug;
        const category = await CategoryModel.findOne({ slug, status: true }).select("_id");
        if (!category) {
            return { status: "fail", data: "Category not found or inactive" };
        }

        const categoryID = category._id;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const data = await productModel.aggregate([
            { $match: { categoryID, status: true } },
            {
                $lookup: {
                    from: "brands",
                    localField: "brandID",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            { $unwind: "$brand" },
            { $match: { "brand.status": true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryID",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
            { $match: { "category.status": true } },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                slug: 1,
                                price: 1,
                                discount: 1,
                                discountPrice: 1,
                                image: 1,
                                stock: 1,
                                remarks: 1,
                                "brand.brandName": 1,
                                "brand.brandImg": 1,
                                "category.categoryName": 1,
                                "category.categoryImg": 1,
                            },
                        },
                    ],
                },
            },
        ]);

        const total = data[0]?.total[0]?.count || 0;

        return {
            status: "success",
            data: data[0].data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const ListByKeywordService = async (req, productModel) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 8;
        let skip = (page - 1) * limit;

        let SearchRegex = { $regex: req.params.keyword, $options: "i" };
        let SearchParams = [{ title: SearchRegex }, { des: SearchRegex }];

        let data = await productModel.aggregate([
            { $match: { status: true, $or: SearchParams } },
            {
                $lookup: {
                    from: "brands",
                    localField: "brandID",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            { $unwind: "$brand" },
            { $match: { "brand.status": true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryID",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
            { $match: { "category.status": true } },

            {
                $facet: {
                    total: [{ $count: "count" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                slug: 1,
                                price: 1,
                                discount: 1,
                                discountPrice: 1,
                                image: 1,
                                stock: 1,
                                remarks: 1,
                                brand: {
                                    brandName: "$brand.brandName",
                                    brandImg: "$brand.brandImg",
                                },
                                category: {
                                    categoryName: "$category.categoryName",
                                    categoryImg: "$category.categoryImg",
                                },
                            },
                        },
                    ],
                },
            },
        ]);

        const total = data[0]?.total[0]?.count || 0;

        return {
            status: "success",
            data: data[0].data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

const ListByRemarkService = async (req, productModel) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 8;
        let skip = (page - 1) * limit;
        let remarks = req.params.remarks;

        let data = await productModel.aggregate([
            {
                $match: {
                    status: true,
                    remarks: { $regex: `^${remarks}$`, $options: "i" }
                }
            },
            {
                $lookup: {
                    from: "brands",
                    localField: "brandID",
                    foreignField: "_id",
                    as: "brand",
                },
            },
            { $unwind: "$brand" },
            { $match: { "brand.status": true } },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryID",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
            { $match: { "category.status": true } },
            {
                $facet: {
                    total: [{ $count: "count" }],
                    data: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                title: 1,
                                slug: 1,
                                price: 1,
                                discount: 1,
                                discountPrice: 1,
                                image: 1,
                                stock: 1,
                                remarks: 1,
                                brand: {
                                    brandName: "$brand.brandName",
                                    brandImg: "$brand.brandImg",
                                },
                                category: {
                                    categoryName: "$category.categoryName",
                                    categoryImg: "$category.categoryImg",
                                },
                            },
                        },
                    ],
                },
            },
        ]);

        const total = data[0]?.total[0]?.count || 0;

        return {
            status: "success",
            data: data[0].data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


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