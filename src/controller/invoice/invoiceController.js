const {CreateInvoiceService, PaymentSuccessService, PaymentCancelService, PaymentFailService}=require('../../service/invoice/InvoiceService')

exports.CreateInvoice=async (req,res)=>{
    let result=await CreateInvoiceService(req);
    return res.status(200).json(result)
}

exports.PaymentSuccess=async (req,res)=>{
    let result=await PaymentSuccessService(req);
    return res.status(200).json(result)
}

exports.PaymentCancel=async (req,res)=>{
    let result=await PaymentCancelService(req);
    return res.status(200).json(result)
}

exports.PaymentFail=async (req,res)=>{
    let result=await PaymentFailService(req);
    return res.status(200).json(result)
}