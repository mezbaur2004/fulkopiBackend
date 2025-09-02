const app=require("./app")
require('dotenv').config();
const PORT=process.env.PORT
app.listen(PORT,function (){
    console.log("Running at port",PORT)
})