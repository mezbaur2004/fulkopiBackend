const CreateToken = require("../../utility/CreateToken");

const UserLoginService=async (req,userModel)=>{
    try{
        let user=await userModel.findOne({email:req.body.email});
        if(!user){
            return{status:401,message:"User does not exist"};
            }
        if(user.password !== req.body.password){
            return{status:401,message:"Incorrect password"};
        }
        let token=CreateToken({email:user.email});

        return {status:200,token:token, data:user};
    }catch(error){
        return {status:500,data:error.toString()};
    }
}
module.exports=UserLoginService;