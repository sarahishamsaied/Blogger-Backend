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
    nVotes:Number,
    category:String,
    body:String
},{timestamps:true});
const blogModel = mongoose.model("blogs",blogSchema);
module.exports = blogModel