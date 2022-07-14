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
    profilePic:String,
    following:[{type:mongoose.Types.ObjectId,ref:"users"}],
    followers:[{type:mongoose.Types.ObjectId,ref:"users"}],
    bio:String,
    location:String,
    interests:[String],
    readingList:[{type:mongoose.Types.ObjectId,ref:"blogs"}],
    education:String,
    work:String

},{timestamps:true})
const userModel = mongoose.model("users",userSchema)
module.exports = userModel