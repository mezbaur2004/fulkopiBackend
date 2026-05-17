const mongoose = require("mongoose");
const axios = require("axios");

const invoiceModel = require("../../model/invoiceModel");
const invoiceProductModel = require("../../model/invoiceProductModel");
const cartModel = require("../../model/cartModel");
const productModel = require("../../model/productModel");
const brandModel = require("../../model/brandModel");
const categoryModel = require("../../model/categoryModel");

require("dotenv").config();

const generateTranId = () => "INV_" + Date.now();

const CreateInvoiceService = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.headers.user_id);
        const cus_email = req.headers.email;
        const { cus_name, cus_location, cus_city, cus_phone, cus_postcode } = req.body;

        if (!cus_name) return { status: "fail", message: "Customer name is required" };
        if (!cus_location) return { status: "fail", message: "Customer location is required" };
        if (!cus_city) return { status: "fail", message: "Customer city is required" };
        if (!cus_phone) return { status: "fail", message: "Customer phone is required" };
        if (!cus_postcode) return { status: "fail", message: "Customer postcode is required" };

        const deliveryCharge = 110;
        const cartItems = await cartModel.find({ userID: user_id });

        if (!cartItems.length) {
            return { status: "failed", data: "Cart is empty" };
        }

        let total = 0;
        const validItems = [];

        for (const item of cartItems) {
            const product = await productModel.findOne({
                _id: item.productID,
                status: true,
                stock: true
            });

            if (!product) continue;

            const brand = await brandModel.findOne({ _id: product.brandID, status: true });
            if (!brand) continue;

            const category = await categoryModel.findOne({ _id: product.categoryID, status: true });
            if (!category) continue;

            let price;
            if (product.discount === true && product.discountPrice != null) {
                price = Number(product.discountPrice);
            } else {
                price = Number(product.price);
            }

            const qty = Number(item.qty);
            const subtotal = price * qty;

            validItems.push({
                ...item._doc,
                title: product.title,
                price,
                subtotal
            });

            total += subtotal;
        }

        total += deliveryCharge;

        const invoice = await invoiceModel.create({
            userID: user_id,
            customerName: cus_name,
            location: cus_location,
            deliveryCharge,
            tran_id: generateTranId(),
            total,
            paymentStatus: "pending"
        });

        const invoiceItemsData = validItems.map((item) => ({
            invoiceID: invoice._id,
            productID: item.productID,
            title: item.title,
            qty: item.qty,
            price: item.price,
            subtotal: item.subtotal
        }));

        await invoiceProductModel.insertMany(invoiceItemsData);

        const paymentData = {
            store_id: process.env.STORE_ID,
            store_passwd: process.env.STORE_PASSWORD,

            total_amount: Number(invoice.total).toFixed(2),
            currency: "BDT",
            tran_id: invoice.tran_id,

            value_a: "FULKOPI",
            value_b: invoice.tran_id,
            value_c: "GROCERY",
            value_d: cus_email || "noemail@example.com",

            success_url: "https://fulkopi-backend.onrender.com/api/paymentSuccess/",
            fail_url: "https://fulkopi-backend.onrender.com/api/paymentFail/",
            cancel_url: "https://fulkopi-backend.onrender.com/api/paymentCancel/",
            ipn_url: "https://fulkopi-backend.onrender.com/api/paymentIPN/",

            cus_name: cus_name,
            cus_email: cus_email,
            cus_phone: cus_phone,
            cus_add1: cus_location,
            cus_city: cus_city,
            cus_postcode: cus_postcode,
            cus_country: "Bangladesh",

            shipping_method: "NO",
            num_of_item: 1,
            weight_of_items: "0.00",
            emi_option: 0,
            product_name: "raw food",
            product_category: "grocery",
            product_profile: "general"
        };

        const params = new URLSearchParams();
        Object.entries(paymentData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });

        const sslResponse = await axios.post(
            "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 15000
            }
        );

        if (!sslResponse.data || sslResponse.data.status !== "SUCCESS") {
            return {
                status: "failed",
                data: sslResponse.data || "Empty SSL response"
            };
        }

        await cartModel.deleteMany({ userID: user_id });

        return {
            status: "success",
            data: sslResponse.data
        };
    } catch (error) {
        return {
            status: "failed",
            data: error.toString()
        };
    }
};

const PaymentFailService = async (req) => {
    try {
        const tran_id = req.body?.tran_id || req.query?.tran_id;
        if (!tran_id) {
            return { status: "failed", data: "tran_id not found" };
        }

        await invoiceModel.updateOne(
            { tran_id },
            { paymentStatus: "fail" }
        );

        return { status: "fail" };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

const PaymentCancelService = async (req) => {
    try {
        const tran_id = req.body?.tran_id || req.query?.tran_id;
        if (!tran_id) {
            return { status: "failed", data: "tran_id not found" };
        }

        await invoiceModel.updateOne(
            { tran_id },
            { paymentStatus: "cancel" }
        );

        return { status: "cancel" };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

const PaymentIPNService = async (req) => {
    try {
        const tran_id = req.body?.tran_id || req.query?.tran_id;
        const status = req.body?.status || req.query?.status;

        if (!tran_id) {
            return { status: "failed", message: "tran_id not found" };
        }

        if (status) {
            await invoiceModel.updateOne(
                { tran_id },
                { paymentStatus: status }
            );
        }

        return { status: "success" };
    } catch (error) {
        return { status: "fail", message: "Something went wrong" };
    }
};

const PaymentSuccessService = async (req) => {
    try {
        const tran_id = req.body?.tran_id || req.query?.tran_id;
        if (!tran_id) {
            return { status: "failed", data: "tran_id not found" };
        }

        await invoiceModel.updateOne(
            { tran_id },
            { paymentStatus: "success" }
        );

        return { status: "success" };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

const InvoiceListService = async (req) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.headers.user_id);
        const result = await invoiceModel.find({ userID: user_id }).sort({ createdAt: -1 });
        return { status: "success", data: result };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

const InvoiceProductListService = async (req) => {
    try {
        const invoice_id = new mongoose.Types.ObjectId(req.params.invoice_id);
        const MatchStage = { $match: { invoiceID: invoice_id } };
        const JoinWithProductStage = {
            $lookup: {
                from: "products",
                localField: "productID",
                foreignField: "_id",
                as: "product"
            }
        };
        const UnwindStage = { $unwind: "$product" };

        const data = await invoiceProductModel.aggregate([
            MatchStage,
            JoinWithProductStage,
            UnwindStage
        ]);

        return { status: "success", data };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};

module.exports = {
    CreateInvoiceService,
    PaymentFailService,
    PaymentCancelService,
    PaymentSuccessService,
    PaymentIPNService,
    InvoiceListService,
    InvoiceProductListService
};
