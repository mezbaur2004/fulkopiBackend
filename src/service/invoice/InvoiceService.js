const mongoose=require('mongoose')
const qs=require('qs')
const axios=require("axios");
const invoiceModel=require('../../model/invoiceModel')
const invoiceProductModel=require('../../model/invoiceProductModel')
const cartModel=require('../../model/cartModel')
const productModel=require('../../model/productModel')
const brandModel=require('../../model/brandModel')
const categoryModel=require('../../model/categoryModel')
require('dotenv').config();
const PORT=process.env.PORT;
const generateTranId = () => "INV_" + Date.now();

const CreateInvoiceService=async (req,res)=>{
    try{
        const user_id=new mongoose.Types.ObjectId(req.headers.user_id)
        const cus_email=req.headers.email
        const { cus_name, cus_location, cus_city, cus_phone, cus_postcode } = req.body;

        if (!cus_name) {
            return { status: "fail", message: "Customer name is required" };
        }
        if (!cus_location) {
            return { status: "fail", message: "Customer location is required" };
        }
        if (!cus_city) {
            return { status: "fail", message: "Customer city is required" };
        }
        if (!cus_phone) {
            return { status: "fail", message: "Customer phone is required" };
        }
        if (!cus_postcode) {
            return { status: "fail", message: "Customer postcode is required" };
        }

        const deliveryCharge=110;
        const cartItems=await cartModel.find({userID:user_id});
        if(!cartItems.length){
            return {status:"failed", data:"Cart is empty"};
        }
        let total=0;
        let validItems=[];
        for(const item of cartItems){
            let product=await productModel.findOne({_id:item.productID, status:true, stock:true})
            if(!product){
                continue
            }
            let brand=await brandModel.findOne({_id:product.brandID, status:true});
            if(!brand){
                continue
            }
            let category=await categoryModel.findOne({_id:product.categoryID, status:true});
            if(!category){
                continue
            }
            let price;
            if(!product.discount===true){
                price=product.price;
            }else{
                price=product.discountPrice;
            }
            let subtotal=price*item.qty;
            //._doc converts mongoose document into plain JavaScript object
            validItems.push({
                ...item._doc,
                title:product.title,
                price:price,
                subtotal:subtotal,
            })
            total+=subtotal;
        }
        total=total+deliveryCharge;
        const invoice=await invoiceModel.create({
            userID: user_id,
            customerName: cus_name,
            location: cus_location,
            deliveryCharge:deliveryCharge,
            tran_id:generateTranId(),
            total: total,
            paymentStatus: "pending"
        })
        const invoiceItemsData=validItems.map(item=>({
            invoiceID:invoice._id,
            productID:item.productID,
            title:item.title,
            qty:item.qty,
            price:item.price,
            subtotal:item.subtotal
        }))

        await invoiceProductModel.insertMany(invoiceItemsData);

        const paymentData = {
            store_id: process.env.STORE_ID,
            store_passwd: process.env.STORE_PASSWORD,
            total_amount: invoice.total,
            currency: "BDT",
            tran_id: invoice.tran_id,
            success_url: `http://localhost:${PORT}/api/paymentSuccess`,
            fail_url: `http://localhost:${PORT}/api/paymentFail`,
            cancel_url: `http://localhost:${PORT}/api/paymentCancel`,
            product_name:"raw food",
            product_category: "grocery",
            product_profile:"general",
            emi_option:0,
            cus_name: invoice.customerName,
            cus_email: cus_email,
            cus_phone: cus_phone,
            shipping_method: "NO",
            num_of_item:1,
            weight_of_items:5,
            logistic_pickup_id:"11233fulkopiaddressblahblah",
            logistic_delivery_type:"COD",
            cus_add1: invoice.location,
            cus_city: cus_city,
            cus_postcode:cus_postcode,
            cus_country: "Bangladesh"
        };
        const sslResponse = await axios.post(
            "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
            qs.stringify(paymentData),{headers:{ "Content-Type": "application/x-www-form-urlencoded" }}
        );
        await cartModel.deleteMany({ userID: user_id });
        return sslResponse.data;
    }catch(error){
        return {status:"failed", data:error.toString()}
    }

}


const PaymentFailService=async(req)=>{
    try{
        let {tran_id}=req.body
        await invoiceModel.updateOne({tran_id:tran_id},{paymentStatus:"fail"});

        return {status:"fail"}
    }catch(error){
        return {status:"failed", data:error.toString()}
    }
}

const PaymentCancelService=async(req)=>{
    try{
        let {tran_id}=req.body
        await invoiceModel.updateOne({tran_id:tran_id},{paymentStatus:"cancel"});

        return {status:"cancel"}
    }catch(error){
        return {status:"failed", data:error.toString()}
    }
}

const PaymentIPNService=async(req)=>{
    try{
        let {tran_id}=req.body;
        let {status}=req.body;
        await invoiceModel.updateOne({tran_id:tran_id},{paymentStatus:status});
        return {status:"success"}
    }catch (e){
        return {status:"fail", message:"Something went wrong"};
    }
}

const PaymentSuccessService=async(req)=>{
    try{
        let {tran_id}=req.body
        await invoiceModel.updateOne({tran_id:tran_id},{paymentStatus:"success"});

        return {status:"success"}
    }catch(error){
        return {status:"failed", data:error.toString()}
    }
}

const InvoiceListService=async(req)=>{
    try{
        const user_id=new mongoose.Types.ObjectId(req.headers.user_id);
        let result=await invoiceModel.find({userID:user_id});
        return {status:"success", data:result};
    }catch (error){
        return {status:"failed", data:error.toString()}
    }
}

const InvoiceProductListService=async(req)=>{
    try{
        //const user_id=new mongoose.Types.ObjectId(req.headers.user_id);
        const invoice_id=new mongoose.Types.ObjectId(req.params.invoice_id);
        let MatchStage={$match:{invoiceID:invoice_id}}
        let JoinWithProductStage={$lookup:{from:"products", localField:"productID",foreignField:"_id",as:"product"}};
        let UnwindStage={$unwind:"$product"}
        //console.log(user_id,invoice_id);
        let data=await invoiceProductModel.aggregate([MatchStage,JoinWithProductStage,UnwindStage]);

        return {status:"success", data:data};
    }catch (error){
        return {status:"failed", data:error.toString()}
    }
}

module.exports = {CreateInvoiceService, PaymentFailService, PaymentCancelService, PaymentSuccessService, PaymentIPNService, InvoiceListService, InvoiceProductListService};