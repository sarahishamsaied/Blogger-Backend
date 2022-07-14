const blogModel = require("../../../Database/Models/blog.model");
const commentModel = require("../../../Database/Models/comment.model")
const getComments = async(req,res)=>{
    const {blogId} = req.params;
    const comments = await commentModel.find({
        blogId
    });
    res.json({
        message:"success",
        comments
    })
}
const incrementBlogComments = async(referenceId)=>{
    console.log("ref id",referenceId)
    if (checkId(referenceId)) {
        const blog = await blogModel.findByIdAndUpdate("62cef3cdec5a1806af39a7c1",{
            $inc:{nComments:1}
        });
        return blog;
      }
      else
      res.json({
        message:"invalid Id"
      })
      return;
}
const checkId = (id)=>{
 return id.match(/^[0-9a-fA-F]{24}$/);
}
const decrementBlogComments = async(referenceId)=>{
    const blog = await blogModel.findByIdAndUpdate(referenceId,{
        $inc:{nComments:-1}
    })
    console.log(blog)
    return blog;
}
const postComment = async(req,res)=>{
    const {blogId} = req.params;
    console.log("blog id",blogId)
    const {body,author} = req.body;
    const commentInstance = new commentModel({
        body,
        author,
        nUpVotes:0,
        nDownVotes:0,
        blogId
    });
    const comment = await commentInstance.save();
    const blog = incrementBlogComments(blogId);
    res.json({
        message:'success',
        comment,
        blog
    });
}
const deleteComment = async(req,res)=>{
    const {id} = req.params;
    const response = await commentModel.findByIdAndDelete(id)
    res.json({
        message:'success',
        response,
        blog:decrementBlogComments(id)
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