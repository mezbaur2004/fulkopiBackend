exports.CreateInvoice=async (req,res)=>{

    return res.status(200).json({total:"1000BDT",vat:"50BDT",payable:"1050BDT"});
}