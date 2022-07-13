const commentModel = require("../../../Database/Models/comment.model")
const getComments = async(req,res)=>{
    const {blogId} = req.params;
    const comments = commentModel.find({
        blogId
    });
    res.json({
        message:"success",
        comments
    })
}
const postComment = async(req,res)=>{
    const {blogId} = req.params;
    const {body,author,nVotes} = req.params;
    const commentInstance = new commentModel({
        body,
        author,
        nVotes:0,
        blogId
    });
    const comment = await commentInstance.save();
    res.json({
        message:'success',
        comment
    })
}
const deleteComment = async(req,res)=>{
    const {id} = req.params;
    const response = await commentModel.findByIdAndDelete({
        id
    })
    res.json({
        message:'success',
        response
    })
}
const editComment = async(req,res)=>{
    const {id} = req.params;
    const response = commentModel.findByIdAndUpdate({
        id
    })
    res.json({
        message:'success',
        response
    })
}

module.exports = {getComments,postComment,deleteComment,editComment}