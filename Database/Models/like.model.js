const mongoose = require("mongoose");
const voteSchema = new mongoose.Schema({
    author:String,
    referenceId:String
});
const voteModel = mongoose.model("likes",voteSchema);
module.exports = voteModel
