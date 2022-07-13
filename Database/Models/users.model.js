const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    username:{
        required:true,
        unique:true,
        type:String
    },
    firstName:String,
    lastName:String,
    email:{
        unique:true,
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    confirmPassword:String,
    profilePic:String
})
const userModel = mongoose.model("users",userSchema)
module.exports = userModel