const {signUpValidation} = require("../Modules/Users/users.validator");
const headerData = ["body","params","query"];
const {StatusCodes} = require("http-status-codes")

const signUpValidator = (schema)=>{
    return(req,res,next)=>{
        let errorList = [];
        headerData.forEach((key)=>{
            if(schema[key])
            {
                const validationResult = schema[key].validate(req.body);
                if(validationResult.error){
                    errorList.push(validationResult.error)
                }
            }
        })
        if(errorList.length){
            res.status(StatusCodes.BAD_REQUEST).json({
                message:"Error",
                errorList
            });
        }
        else
        next();
    }
};
module.exports = {signUpValidator};