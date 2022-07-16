const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    type:String,
    author:{
        type:mongoose.Types.ObjectId,
        ref:"users"
    },
    referenceId:{
        type:mongoose.Types.ObjectId,
        ref:"blogs"
    },
},{timestamps:true});
const commentSchema = new mongoose.Schema({
    author:{type:mongoose.Types.ObjectId,required:true},
    blogId:String,
    body:{
        required:true,
        type:String
    },
    nUpVotes:Number,
    nDownVotes:Number,
    upVotes:[voteSchema],
    downVotes:[voteSchema]
},{timestamps:true});
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
    blogImage:String,
    comments:[commentSchema],
    upVotes:[voteSchema],
    downVotes:[voteSchema]
},{timestamps:true});
const blogModel = mongoose.model("blogs",blogSchema);
module.exports = blogModel