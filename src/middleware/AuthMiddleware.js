const jwt = require("jsonwebtoken");
require('dotenv').config();
const jwtKey = process.env.JWT_KEY;

// User authentication middleware
const AuthMiddleware=(req, res, next)=> {
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
        console.log(req.headers.role);
        return res.status(403).json({ status: "forbidden", data: "Admin access required" });
    }
    next();
}

module.exports = {AuthMiddleware,AdminMiddleware};
