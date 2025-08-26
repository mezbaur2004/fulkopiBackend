const express=require('express');
const InvoiceController=require('../controller/InvoiceController')


const router=express.Router();

// Invoice & Payment
router.get('/CreateInvoice',InvoiceController.CreateInvoice)

//User



module.exports=router;