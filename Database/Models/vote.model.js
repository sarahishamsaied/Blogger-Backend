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
const voteModel = mongoose.model("likes",voteSchema);
module.exports = voteModel
