const slugify = require("slugify");
const mongoose = require("mongoose");


const ProductListService = async (req, productModel) => {
    try {
        let limit=Number(req.query.limit) ||10;
        let page=Number(req.query.page) ||1;
        let skip=(page-1)*limit;
        let total= await productModel.countDocuments();
        let data = await productModel.aggregate([
            {
                $lookup: {
                    from: 'brands',
                    localField: 'brandID',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            { $unwind: '$brand' },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'categoryID',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            { $sort: { createdAt: -1 }
            }, // newest first
            {$skip:skip},
            {$limit:limit},

        ]);
        // let loop=[] //performance test-1
        // for (let i = 0; i < 10000; i++) {
        //     loop[i]=data;
        // }

        return { status: "success", data: data,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
}


const SingleProduct = async (req, productModel) => {
    try {
        const id=new mongoose.Types.ObjectId(req.params.id);
        let MatchStage={$match:{_id:id}}
        let JoinWithBrand={$lookup:{from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand'}};
        let UnwindBrandStage={$unwind:'$brand'};
        let JoinWithCategory={$lookup:{from:'categories', localField: 'categoryID', foreignField: '_id', as: 'category'}};
        let UnwindCategoryStage={$unwind:'$brand'};
        let data = await productModel.aggregate([MatchStage, JoinWithBrand, UnwindBrandStage, JoinWithCategory, UnwindCategoryStage]);
        return { status: "success", data: data };
    }catch (error) {
        return { status: "failed", data: error.toString() };
    }
}


const ProductCreateService = async (req, ProductModel) => {
    try {
        const {
            title,
            des,
            price,
            discount,
            discountPrice,
            status,
            image,
            stock,
            remarks,
            categoryID,
            brandID,
        } = req.body;


        // Generate slug from title
        const slug = slugify(title, { lower: true, strict: true });

        // Check for duplicate slug (optional)
        const exists = await ProductModel.findOne({ slug });
        if (exists) {
            return { status: "fail", data: "Product with this title already exists" };
        }

        const product = await ProductModel.create({
            title,
            slug,
            des,
            price,
            discount,
            discountPrice,
            status,
            image,
            stock,
            remarks,
            categoryID,
            brandID
        });

        return { status: "success", data: product };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const ProductUpdateService = async (req, ProductModel) => {
    try {
        const { id } = req.params;
        let updateData = req.body;
        const slug = slugify(updateData.title, { lower: true, strict: true });
        updateData.slug = slug;
        const existing = await ProductModel.findOne({ slug, _id: { $ne: id } });
        if (existing) {
            return { status: "fail", data: "Slug already exists for another product" };
        }
        const product = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return { status: "failed", data: "Product not found" };
        }
        return { status: "success", data: product };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const BrandListService=async (req, brandModel)=>{
    try {
        let data=await brandModel.find().sort({ createdAt: -1 });
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}

const SingleBrand = async (req, brandModel) => {
    try {
        const {id}=req.params;
        let data = await brandModel.findOne({_id:id});
        return { status: "success", data: data };
    }catch (error) {
        return { status: "failed", data: error.toString() };
    }
}

const BrandCreateService = async (req, BrandModel) => {
    try {
        const { brandName, status, brandImg } = req.body;

        const slug = slugify(brandName, { lower: true, strict: true });

        // Check if brand already exists
        const exists = await BrandModel.findOne({ slug });
        if (exists) {
            return { status: "fail", data: "Brand already exists" };
        }

        const brand = await BrandModel.create({ brandName, slug, status, brandImg });
        return { status: "success", data: brand };

    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const BrandUpdateService = async (req, BrandModel) => {
    try {
        const { id } = req.params;
        const { brandName, status, brandImg } = req.body;

        const updateData = {};

        if (brandName) {
            const slug = slugify(brandName, { lower: true, strict: true });
            const existing = await BrandModel.findOne({ slug, _id: { $ne: id } });
            if (existing) {
                return { status: "fail", data: "Slug already exists for another brand" };
            }
            updateData.brandName = brandName;
            updateData.slug = slug;
        }

        if (status !== undefined) updateData.status = status;
        if (brandImg) updateData.brandImg = brandImg;

        if (Object.keys(updateData).length === 0) {
            return { status: "fail", data: "No valid fields provided to update" };
        }

        const updatedBrand = await BrandModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedBrand) return { status: "fail", data: "Brand not found" };

        return { status: "success", data: updatedBrand };

    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const CategoryListService=async (req,categoryModel)=>{
    try {
        let data=await categoryModel.find().sort({ createdAt: -1 });
        return {status:"success",data:data};
    }catch (error) {
        return {status:"failed", data:error.toString()};
    }
}


const SingleCategory = async (req, categoryModel) => {
    try {
        const {id}=req.params;
        let data = await categoryModel.findOne({_id:id});
        return { status: "success", data: data };
    }catch (error) {
        return { status: "failed", data: error.toString() };
    }
}

const CategoryCreateService = async (req, CategoryModel) => {
    try {
        const { categoryName, status, categoryImg } = req.body;

        const slug = slugify(categoryName, { lower: true, strict: true });

        // Check if cat already exists
        const exists = await CategoryModel.findOne({ slug });
        if (exists) {
            return { status: "fail", data: "Category already exists" };
        }

        const category = await CategoryModel.create({ categoryName, slug, status, categoryImg });
        return { status: "success", data: category };

    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

// ===== UPDATE cat =====
const CategoryUpdateService = async (req, CategoryModel) => {
    try {
        const { id } = req.params;
        const { categoryName, status, categoryImg } = req.body;

        const updateData = {};

        if (categoryName) {
            const slug = slugify(categoryName, { lower: true, strict: true });
            const existing = await CategoryModel.findOne({ slug, _id: { $ne: id } });
            if (existing) {
                return { status: "fail", data: "Slug already exists for another category" };
            }
            updateData.categoryName = categoryName;
            updateData.slug = slug;
        }

        if (status !== undefined) updateData.status = status;
        if (categoryImg) updateData.categoryImg = categoryImg;

        if (Object.keys(updateData).length === 0) {
            return { status: "fail", data: "No valid fields provided to update" };
        }

        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedCategory) return { status: "fail", data: "Category not found" };

        return { status: "success", data: updatedCategory };

    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


module.exports = {
    ProductListService, SingleProduct, ProductCreateService, ProductUpdateService, BrandListService, SingleBrand, BrandCreateService, BrandUpdateService, CategoryListService, SingleCategory, CategoryCreateService, CategoryUpdateService
};
