const app=require("./app")
const PORT=process.env.PORT || 3030;
app.listen(PORT,function (){
    console.log("Running at port",PORT)
})