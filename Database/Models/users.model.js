const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
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
    work:String,
    isConfirmed:{
        type:Boolean,
        default:false
    }

},{timestamps:true});
userSchema.pre("save",function(next){
    this.password = bcrypt.hashSync(this.password,parseInt(process.env.saltRounds));
    this.confirmPassword = bcrypt.hashSync(this.confirmPassword,parseInt(process.env.saltRounds));
    console.log("password is")
    console.log(this.password)
    next();
});
const userModel = mongoose.model("users",userSchema);


module.exports = userModel