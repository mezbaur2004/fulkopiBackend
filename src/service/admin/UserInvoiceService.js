const mongoose = require("mongoose");

const UserListService = async (req,UserModel) => {
    try {
        let limit=Number(req.query.limit) ||10;
        let page=Number(req.query.page) ||1;
        let skip=(page-1)*limit;
        let total=await UserModel.countDocuments();
        const users = await UserModel.aggregate([
            { $project: { password: 0 } },     // exclude password
            { $sort: { createdAt: -1 } },      // newest first
            { $skip: skip },                    // skip for pagination
            { $limit: limit }                   // limit for pagination
        ]);
        return { status: "success", data: users,
        pagination:{
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit),
        }
        };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


const OneUserInvoiceService = async (req, InvoiceModel) => {
    try {
        const { id } = req.params;
        const invoices = await InvoiceModel.find({ userID: id }).sort({ createdAt: -1 });
        return { status: "success", data: invoices };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
}

const UserInvoiceListService = async (req,InvoiceModel) => {
    try {
        let limit=Number(req.query.limit) ||10;
        let page=Number(req.query.page) ||1;
        let skip=(page-1)*limit;
        let total=await InvoiceModel.countDocuments();

        let data = await InvoiceModel.aggregate([
            {
                $lookup: {
                    from: "users", // must match collection name of UserModel
                    localField: "userID",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user" // flatten the user array
            },
            {
                $project: {
                    _id: 1,
                    customerName: 1,
                    location: 1,
                    deliveryCharge: 1,
                    tran_id: 1,
                    total: 1,
                    paymentStatus: 1,
                    createdAt: 1,
                    "user._id": 1,
                    "user.email": 1,
                    "user.role": 1
                }
            },
            { $sort: { createdAt: -1 } }, // newest first
            {$skip: skip},
            { $limit: limit }
        ]);

        return { status: "success", data,
        pagination:{
        total,
        page,
        limit,
        totalPages: Math.ceil(total/limit)}
        };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

const InvoiceProductListService = async (req, InvoiceProductModel) => {
    try {
        const { id } = req.params;

        //Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { status: "failed", data: "Invalid invoice_id" };
        }

        const data = await InvoiceProductModel.aggregate([
            {
                $match: { invoiceID: new mongoose.Types.ObjectId(id) }
            },
            {
                $lookup: {
                    from: "products", // collection name in db
                    localField: "productID",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" } // flatten the product array
        ]);

        return { status: "success", data: data };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


module.exports = {UserListService, OneUserInvoiceService, UserInvoiceListService, InvoiceProductListService};

