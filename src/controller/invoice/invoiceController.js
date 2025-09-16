const {CreateInvoiceService, PaymentSuccessService, PaymentCancelService, PaymentFailService, PaymentIPNService,
    InvoiceListService, InvoiceProductListService
}=require('../../service/invoice/InvoiceService')

exports.CreateInvoice=async (req,res)=>{
    let result=await CreateInvoiceService(req);
    return res.status(200).json(result)
}

exports.PaymentSuccess=async (req,res)=>{
    let result=await PaymentSuccessService(req);
    return res.redirect("http://localhost:5173/orders");

}

exports.PaymentCancel=async (req,res)=>{
    let result=await PaymentCancelService(req);
    return res.redirect("http://localhost:5173/orders");
}

exports.PaymentFail=async (req,res)=>{
    let result=await PaymentFailService(req);
    return res.redirect("http://localhost:5173/orders");
}

exports.paymentIPN=async (req,res)=>{
    let result=await PaymentIPNService(req);
    return res.redirect("http://localhost:5173/orders");
}

exports.invoiceList=async (req,res)=>{
    let result=await InvoiceListService(req);
    return res.status(200).json(result);
}

exports.invoiceProductList=async (req,res)=>{
    let result=await InvoiceProductListService(req);
    return res.status(200).json(result);
}