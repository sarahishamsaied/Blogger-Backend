const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    author:String,
    blogId:String,
    body:{
        required:true,
        type:String
    },
    nVotes:Number
},{timestamps:true});
const commentModel = mongoose.model("comments",commentSchema);
module.exports = commentModel;