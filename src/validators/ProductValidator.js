const { body } = require("express-validator");

exports.ProductValidator = [
    body("title").notEmpty().withMessage("Title is required"),
    body("des").notEmpty().withMessage("Description is required"),
    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isNumeric()
        .withMessage("Price must be a number"),
    body("status").notEmpty().isBoolean().withMessage("Status is required"),
    body("image").notEmpty().withMessage("Image URL is required"),
    body("stock").notEmpty().isBoolean().withMessage("Stock status is required"),
    body("remarks").notEmpty().withMessage("Remarks are required"),
    body("categoryID").notEmpty().withMessage("Category ID is required"),
    body("brandID").notEmpty().withMessage("Brand ID is required"),
    body("discount")
        .optional()
        .isBoolean()
        .withMessage("Discount must be a boolean"),
    body("discountPrice")
        .optional()
        .custom((value, { req }) => {
            if (req.body.discount && (value === undefined || value === null || value === "")) {
                throw new Error("Discount price required when discount is true");
            }
            return true;
        }),
];
