const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    customerName: { type: String, required: true },
    location: { type: String, required: true },
    deliveryCharge: { type: Number, required: true },
    tran_id: { type: String, required: true },
    total: { type: Number, required: true },
    paymentStatus: { type: String, required:true } // pending / paid / failed
}, {timestamps: true, versionKey: false});

const InvoiceModel = mongoose.model("invoices", DataSchema);
module.exports = InvoiceModel;