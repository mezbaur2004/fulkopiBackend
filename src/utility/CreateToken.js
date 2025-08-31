const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtKey = process.env.JWT_KEY;

const CreateToken = (data) => {
    return jwt.sign({ data }, jwtKey, { expiresIn: "10d" });
};

module.exports=CreateToken;