let jwt=require("jsonwebtoken");
require('dotenv').config();
const jwtKey=process.env.JWT_KEY;

module.exports=async (req,res,next)=>{
    let Token=req.headers['token'];
    jwt.verify(Token,jwtKey,function(err,decoded){
        if(err){
            res.status(401).json({status:"unauthorized",data:err.message});
        }else{
            let email=decoded.data.email;
            req.headers.email=email;
            next();
        }
    })
}
