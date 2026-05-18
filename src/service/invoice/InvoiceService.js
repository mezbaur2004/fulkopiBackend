const mongoose = require('mongoose');
const qs = require('qs');
const axios = require("axios");
const invoiceModel = require('../../model/invoiceModel');
const invoiceProductModel = require('../../model/invoiceProductModel');
const cartModel = require('../../model/cartModel');
const productModel = require('../../model/productModel');
const brandModel = require('../../model/brandModel');
const categoryModel = require('../../model/categoryModel');
require('dotenv').config();

const generateTranId = () => "INV_" + Date.now();

const SSL_BASE = "https://sandbox.sslcommerz.com";
const BACKEND_URL = "https://fulkopi-backend.onrender.com";

// ─────────────────────────────────────────────
// HELPER: Validate a payment with SSLCommerz
// ─────────────────────────────────────────────
const validateSSLPayment = async (val_id, expectedAmount, expectedTranId) => {
    try {
        const res = await axios.get(`${SSL_BASE}/validator/api/validationserverAPI.php`, {
            params: {
                val_id,
                store_id: process.env.STORE_ID,
                store_passwd: process.env.STORE_PASSWORD,
                v: 1,
                format: "json"
            },
            timeout: 20000
        });

        const v = res.data;

        if (!v || (v.status !== "VALID" && v.status !== "VALIDATED")) {
            console.error("SSL VALIDATE: bad status →", v?.status);
            return false;
        }

        const sslAmount = Number(v.amount);

        
        if (!Number.isFinite(sslAmount) || Math.abs(sslAmount - expectedAmount) > 0.01) {
            console.error("SSL VALIDATE: amount mismatch →", { sslAmount, expectedAmount });
            return false;
        }

        if (!v.tran_id || !v.bank_tran_id) {
            console.error("SSL VALIDATE: missing tran_id or bank_tran_id");
            return false;
        }

        if (v.tran_id !== expectedTranId) {
            console.error("SSL VALIDATE: tran_id mismatch →", { sslTranId: v.tran_id, expectedTranId });
            return false;
        }

        return true;
    } catch (err) {
        console.error("SSL VALIDATION ERROR:", err.response?.data || err.message);
        return false;
    }
};


// ─────────────────────────────────────────────
// 1. CREATE INVOICE + INIT SSL SESSION
// ─────────────────────────────────────────────
const CreateInvoiceService = async (req, res) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.headers.user_id);
        const cus_email = req.headers.email;
        const { cus_name, cus_location, cus_city, cus_phone, cus_postcode } = req.body;

        if (!cus_name)     return { status: "fail", message: "Customer name is required" };
        if (!cus_location) return { status: "fail", message: "Customer location is required" };
        if (!cus_city)     return { status: "fail", message: "Customer city is required" };
        if (!cus_phone)    return { status: "fail", message: "Customer phone is required" };
        if (!cus_postcode) return { status: "fail", message: "Customer postcode is required" };

        const deliveryCharge = 110;
        const cartItems = await cartModel.find({ userID: user_id });

        if (!cartItems.length) return { status: "failed", data: "Cart is empty" };

        let total = 0;
        let validItems = [];

        for (const item of cartItems) {
            const product = await productModel.findOne({ _id: item.productID, status: true, stock: true });
            if (!product) continue;

            const brand = await brandModel.findOne({ _id: product.brandID, status: true });
            if (!brand) continue;

            const category = await categoryModel.findOne({ _id: product.categoryID, status: true });
            if (!category) continue;

            const price = product.discount === true && product.discountPrice
                ? product.discountPrice
                : product.price;

            const subtotal = price * item.qty;

            // ._doc converts mongoose document into plain JavaScript object
            validItems.push({ ...item._doc, title: product.title, price, subtotal });
            total += subtotal;
        }

        total = total + deliveryCharge;

        const invoice = await invoiceModel.create({
            userID: user_id,
            customerName: cus_name,
            location: cus_location,
            deliveryCharge,
            tran_id: generateTranId(),
            total,
            paymentStatus: "pending"
        });

        const invoiceItemsData = validItems.map(item => ({
            invoiceID: invoice._id,
            productID: item.productID,
            title: item.title,
            qty: item.qty,
            price: item.price,
            subtotal: item.subtotal
        }));

        await invoiceProductModel.insertMany(invoiceItemsData);

        // ── Fixed SSLCommerz payload ──────────────────────────────
        const paymentData = {
            store_id: process.env.STORE_ID,
            store_passwd: process.env.STORE_PASSWORD,

            total_amount: Number(invoice.total).toFixed(2),  // decimal string e.g. "1610.00"
            currency: "BDT",
            tran_id: invoice.tran_id,

            success_url: `${BACKEND_URL}/api/paymentSuccess/`,
            fail_url:    `${BACKEND_URL}/api/paymentFail/`,
            cancel_url:  `${BACKEND_URL}/api/paymentCancel/`,
            ipn_url:     `${BACKEND_URL}/api/paymentIPN/`,      // ← ADDED: required for server-to-server notification

            product_name: "raw food",
            product_category: "grocery",
            product_profile: "general",
            emi_option: "0",                                    // ← FIXED: string, not integer

            cus_name: invoice.customerName,
            cus_email: cus_email,
            cus_phone: cus_phone,
            cus_add1: invoice.location,
            cus_city: cus_city,
            cus_postcode: cus_postcode,
            cus_country: "Bangladesh",

            shipping_method: "NO",
            num_of_item: "1",
            weight_of_items: "5.00",                            // ← FIXED: decimal string, not integer 5
        };

        const sslResponse = await axios.post(
            `${SSL_BASE}/gwprocess/v4/api.php`,
            qs.stringify(paymentData),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        await cartModel.deleteMany({ userID: user_id });

        return sslResponse.data;
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


// ─────────────────────────────────────────────
// 2. IPN — Server-to-server notification
//    SSLCommerz POSTs here directly (no user session).
//    This is the only trustworthy update path.
// ─────────────────────────────────────────────
const PaymentIPNService = async (req) => {
    try {
        const { tran_id, val_id, status, amount } = req.body;

        // Step 1: Ignore anything that isn't a VALID/VALIDATED notification
        if (status !== "VALID" && status !== "VALIDATED") {
            // Still update to whatever terminal status was sent (FAILED, CANCELLED, etc.)
            await invoiceModel.updateOne({ tran_id }, { paymentStatus: status.toLowerCase() });
            return { status: "received" };
        }

        // Step 2: Fetch the invoice so we can verify the expected amount
        const invoice = await invoiceModel.findOne({ tran_id });
        if (!invoice) {
            console.error("IPN: invoice not found for tran_id →", tran_id);
            return { status: "fail", message: "Invoice not found" };
        }

        // Step 3: Call SSLCommerz validation API to confirm authenticity
        const isValid = await validateSSLPayment(val_id, invoice.total, tran_id);

        if (!isValid) {
            // Do NOT mark as success — log and leave as pending for manual review
            console.error("IPN: validation failed for tran_id →", tran_id);
            await invoiceModel.updateOne({ tran_id }, { paymentStatus: "validation_failed" });
            return { status: "fail", message: "Payment validation failed" };
        }

        // Step 4: All checks passed — mark as success
        await invoiceModel.updateOne({ tran_id }, { paymentStatus: "success" });
        console.log("IPN: payment confirmed for tran_id →", tran_id);

        return { status: "success" };
    } catch (error) {
        console.error("IPN ERROR:", error.toString());
        return { status: "fail", message: "Something went wrong" };
    }
};


// ─────────────────────────────────────────────
// 3. SUCCESS redirect — user lands here after paying.
//    Do NOT trust this for DB updates; IPN already handled it.
//    Just read the invoice and confirm to the user.
// ─────────────────────────────────────────────
const PaymentSuccessService = async (req) => {
    try {
        const { tran_id } = req.body;
        // IPN already marked it success. We just confirm it exists.
        const invoice = await invoiceModel.findOne({ tran_id });
        if (!invoice) return { status: "fail", message: "Invoice not found" };

        return { status: "success", paymentStatus: invoice.paymentStatus };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


// ─────────────────────────────────────────────
// 4. FAIL redirect
// ─────────────────────────────────────────────
const PaymentFailService = async (req) => {
    try {
        const { tran_id } = req.body;
        await invoiceModel.updateOne({ tran_id }, { paymentStatus: "fail" });
        return { status: "fail" };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


// ─────────────────────────────────────────────
// 5. CANCEL redirect
// ─────────────────────────────────────────────
const PaymentCancelService = async (req) => {
    try {
        const { tran_id } = req.body;
        await invoiceModel.updateOne({ tran_id }, { paymentStatus: "cancel" });
        return { status: "cancel" };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


// ─────────────────────────────────────────────
// 6. LIST INVOICES
// ─────────────────────────────────────────────
const InvoiceListService = async (req) => {
    try {
        const user_id = new mongoose.Types.ObjectId(req.headers.user_id);
        const result = await invoiceModel.find({ userID: user_id }).sort({ createdAt: -1 });
        return { status: "success", data: result };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


// ─────────────────────────────────────────────
// 7. INVOICE PRODUCT LIST
// ─────────────────────────────────────────────
const InvoiceProductListService = async (req) => {
    try {
        const invoice_id = new mongoose.Types.ObjectId(req.params.invoice_id);
        const MatchStage = { $match: { invoiceID: invoice_id } };
        const JoinWithProductStage = { $lookup: { from: "products", localField: "productID", foreignField: "_id", as: "product" } };
        const UnwindStage = { $unwind: "$product" };
        const data = await invoiceProductModel.aggregate([MatchStage, JoinWithProductStage, UnwindStage]);
        return { status: "success", data };
    } catch (error) {
        return { status: "failed", data: error.toString() };
    }
};


module.exports = {
    CreateInvoiceService,
    PaymentIPNService,
    PaymentSuccessService,
    PaymentFailService,
    PaymentCancelService,
    InvoiceListService,
    InvoiceProductListService
};
