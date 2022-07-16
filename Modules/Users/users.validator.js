const Joi = require("joi");
const signUpValidation = {
    body:Joi.object().required().keys({
        firstName:Joi.string().required().messages({
            "string.empty":"First name is not allowed to be empty"
        }),
        lastName:Joi.string().required().messages({
            "string.empty":"Last name is not allowed to be empty"
        }),
        password:Joi.string().required().pattern(new RegExp("^[0-9a-z-A-Z]{8,100}$")).messages({
            "string.pattern.base":"Password must be at least 8 characters",
        }),
        confirmPassword:Joi.ref("password"),
        username:Joi.string().required().pattern(new RegExp("[^-\s]")),
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}).messages({
            "string.empty":'Email is not allowed to be empty',
            "string.email":'Invalid email format'
        }),
        bio:Joi.string(),
        location:Joi.string(),
        work:Joi.string(),
        education:Joi.string(),
        interests:Joi.array()
    })
}
module.exports = {signUpValidation}