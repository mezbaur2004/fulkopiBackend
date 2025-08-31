const userUpdateService=async (req,userModel)=>{
    try{
        const {email,mobile}=req.body;
        const EmailRegx = /\S+@\S+\.\S+/;
        const MobileRegx = /^(?:\+88|0088)?01[3-9]\d{8}$/;
        if(!EmailRegx.test(email)){
            return{status:"fail",data:"Invalid email format"};
        }
        if(!MobileRegx.test(mobile)){
            return{status:"fail",data:"Invalid mobile number"};
        }
        let data = await userModel.findOneAndUpdate(
            { email: req.headers['email'] },
            req.body,
            { new: true } // returns updated document
        );

        return {status:"success",data:data};
    }catch(error){
        return {status:"fail",data:error.toString()};
    }
}
module.exports=userUpdateService;