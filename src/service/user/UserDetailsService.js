const UserDetailsService=async (req,userModel)=>{
    try{
        let data= await userModel.aggregate([{$match:{email:req.headers['email']}},{$project:{password:0,_id:0}}]);
        return {status:"success",data:data};
    }catch(error){
        return {status:"fail",message:error.toString()};
    }
}

module.exports=UserDetailsService;