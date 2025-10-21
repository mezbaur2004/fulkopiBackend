const jwt = require("jsonwebtoken");
require('dotenv').config();
const {validationResult}=require('express-validator');
const rateLimit = require("express-rate-limit");
const jwtKey = process.env.JWT_KEY;

// User authentication middleware
const Middlewares=(req, res, next)=> {
    const token = req.headers['token'];
    if (!token) {
        return res.status(401).json({ status: "unauthorized", data: "No token provided" });
    }

    jwt.verify(token, jwtKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: "unauthorized", data: err.message });
        }

        // Attach user info to headers
        req.headers.email = decoded.email;
        req.headers.user_id = decoded.user_id;
        req.headers.role = decoded.role; // optional

        next();
    });
}

// Admin authentication middleware
const AdminMiddleware=(req, res, next)=> {
    if (req.headers.role !== "admin") {
        return res.status(403).json({ status: "forbidden", data: "Admin access required" });
    }
    next();
}

const ValidationMiddleware=(req, res, next)=> {
    const errors=validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            status: "failed",
            error: errors.array().map(e => e.msg),
        });
    }
    next();
}

const rateLimitMiddleware=rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: "Too many login attempts. Try again later."
})

module.exports = {AuthMiddleware: Middlewares,AdminMiddleware,ValidationMiddleware,rateLimitMiddleware};
