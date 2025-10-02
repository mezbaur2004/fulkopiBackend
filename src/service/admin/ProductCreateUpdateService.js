// services/ProductService.js
const slugify = require("slugify");
const mongoose = require("mongoose"); // install this: npm i slugify

const ProductListService = async (req, productModel) => {
    try {
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
            { $sort: { createdAt: -1 } } // newest first

        ]);

        return { status: "success", data: data };
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


        if (
            title === undefined || title === null ||
            des === undefined || des === null ||
            price === undefined || price === null ||
            status === undefined || status === null ||
            image === undefined || image === null ||
            stock === undefined || stock === null ||
            remarks === undefined || remarks === null ||
            categoryID === undefined || categoryID === null ||
            brandID === undefined || brandID === null
        ) {
            return { status: "failed", data: "All required fields must be provided" };
        }

        // If discount is true, discountPrice should exist
        if (discount && (discountPrice === undefined || discountPrice === null)) {
            return { status: "failed", data: "Discount price required when discount is true" };
        }

        // Generate slug from title
        const slug = slugify(title, { lower: true, strict: true });

        // Check for duplicate slug (optional)
        const exists = await ProductModel.findOne({ slug });
        if (exists) {
            return { status: "failed", data: "Product with this title already exists" };
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
        const updateData = req.body;

        if (updateData.discount && (updateData.discountPrice === undefined || updateData.discountPrice === null)) {
            return { status: "failed", data: "Discount price required when discount is true" };
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

        if (!brandName || !brandImg || status === undefined) {
            return { status: "fail", data: "All fields are required" };
        }

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

        if (!brandName && status === undefined && !brandImg) {
            return { status: "fail", data: "At least one field required to update" };
        }

        const updateData = {};
        if (brandName) {
            updateData.brandName = brandName;
            updateData.slug = slugify(brandName, { lower: true, strict: true });
        }
        if (status !== undefined) updateData.status = status;
        if (brandImg) updateData.brandImg = brandImg;

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

        if (!categoryName || !categoryImg || status === undefined) {
            return { status: "fail", data: "All fields are required" };
        }

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

        if (!categoryName && status === undefined && !categoryImg) {
            return { status: "fail", data: "At least one field required to update" };
        }

        const updateData = {};
        if (categoryName) {
            updateData.categoryName = categoryName;
            updateData.slug = slugify(categoryName, { lower: true, strict: true });
        }
        if (status !== undefined) updateData.status = status;
        if (categoryImg) updateData.categoryImg = categoryImg;

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
