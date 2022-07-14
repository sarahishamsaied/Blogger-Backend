const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    author:{type:mongoose.Types.ObjectId,required:true},
    blogId:String,
    body:{
        required:true,
        type:String
    },
    nUpVotes:Number,
    nDownVotes:Number
},{timestamps:true});
const commentModel = mongoose.model("comments",commentSchema);
module.exports = commentModel;