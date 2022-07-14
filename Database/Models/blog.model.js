const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    author:{
        type:mongoose.Types.ObjectId,
        ref:"users",
    },
    title:{
        type:String,
        required:true
    },
    nComments:Number,
    nUpVotes:Number,
    nDownVotes:Number,
    category:String,
    body:String,
    tags:[String],
    blogImage:String
},{timestamps:true});
const blogModel = mongoose.model("blogs",blogSchema);
module.exports = blogModel