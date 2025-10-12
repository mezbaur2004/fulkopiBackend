const {body}=require('express-validator');
exports.CategoryValidator=[
    body("categoryName").notEmpty().withMessage("categoryName is required"),
    body("status").notEmpty().isBoolean().withMessage("status is required"),
    body("categoryImg").notEmpty().withMessage("categoryImg is required"),
]
