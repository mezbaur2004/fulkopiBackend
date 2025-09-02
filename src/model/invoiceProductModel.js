const mongoose = require("mongoose");

const DataSchema = new mongoose.Schema({
    invoiceID: { type: mongoose.Schema.Types.ObjectId, required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: String,
    qty: Number,
    price: Number,
    subtotal: Number
},{timestamps: true,versionKey: false});

const InvoiceItemModel = mongoose.model("invoiceproducts", DataSchema);
module.exports = InvoiceItemModel;
