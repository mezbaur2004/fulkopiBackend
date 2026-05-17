const express =require('express');
const app= new express();
app.set('trust proxy', 1);
const router =require('./src/route/api');
require('dotenv').config();

const rateLimit =require('express-rate-limit');
const helmet =require('helmet');
const hpp =require('hpp');
const cors =require('cors');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const cookieParser = require('cookie-parser');
const mongoose=require('mongoose');

app.use(cookieParser());

const origins=process.env.ORIGIN.split(",").map(o => o.trim().replace(/\/$/, "")) ?? [];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const cleanOrigin = origin.replace(/\/$/, "");

        if (origins.includes(cleanOrigin) || origin.includes("sslcommerz.com")) {
            return callback(null, true);
        }

        return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token"], // <-- FIX
    credentials: false
};

app.use(cors(corsOptions));


// Handle preflight for all routes
app.options(/^(.*)$/, cors(corsOptions));

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(express.urlencoded({ limit: '1mb', extended: true }));
app.use(express.json({ limit: '1mb' }));

const limiter= rateLimit({windowMs:60*1000,max:200, message:"Too many requests. Try again later"})
app.use((req, res, next) => {
    if (req.path.includes("payment")) return next();
    limiter(req, res, next);
});

let URL=process.env.URL;
let option={user:'',pass:"",autoIndex:true};
mongoose.connect(URL,option).then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log("DB connection failed",err)
})

app.set('etag', false);

app.use("/api",router)

//undefined route implement
app.use("*",(req,res)=>{
    res.status(404).json({status:"fail",data:"not found(wrong route)"})
});


module.exports=app;
