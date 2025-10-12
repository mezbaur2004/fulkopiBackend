const {body}=require('express-validator');
exports.BrandValidator=[
    body("brandName").notEmpty().withMessage("brandName is required"),
    body("status").notEmpty().isBoolean().withMessage("status is required"),
    body("brandImg").notEmpty().withMessage("brandImg is required"),
]
