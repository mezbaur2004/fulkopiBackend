const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtKey = process.env.JWT_KEY;

const CreateToken = (payload) => {
    return jwt.sign(payload, jwtKey, { expiresIn: "30d" });
};

module.exports=CreateToken;