const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
    author:String,
    title:{
        type:String,
        required:true
    },
    nComments:Number,
    nVotes:Number,
    category:String
});
const blogModel = mongoose.model(blogSchema,"blogs");
module.exports = blogModel