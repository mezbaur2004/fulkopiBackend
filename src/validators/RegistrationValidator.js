const {body}=require('express-validator');
exports.RegistrationValidator=[
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Valid Email is required"),
    body("firstName").trim().notEmpty().withMessage("First Name is Required"),
    body("lastName").trim().notEmpty().withMessage("Last Name is Required"),
    body("mobile").trim().notEmpty().withMessage("Mobile is Required").matches(/^(?:\+88|0088)?01[3-9]\d{8}$/).withMessage("Invalid Bangladeshi mobile number format"),
    body('password').trim().notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Za-z]/).withMessage('Password must contain at least one letter')
        .matches(/^\S*$/).withMessage("Password must not contain spaces")
        //.matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('confirmPassword').trim()
        .custom((value, { req }) => {
            if (value.trim() !== req.body.password.trim()) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    body("photo").trim().notEmpty().withMessage('image url is required'),

]
