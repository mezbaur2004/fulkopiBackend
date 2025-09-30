const UserListService = async (UserModel) => {
    try {
        const users = await UserModel.find({}, "-password") // don’t send passwords
            .sort({ createdAt: -1 }); // newest first

        return { status: "success", data: users };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

// services/InvoiceListService.js
const UserInvoiceListService = async (InvoiceModel, UserModel) => {
    try {
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
            { $sort: { createdAt: -1 } } // newest first
        ]);

        return { status: "success", data };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

module.exports = {UserListService, UserInvoiceListService};

