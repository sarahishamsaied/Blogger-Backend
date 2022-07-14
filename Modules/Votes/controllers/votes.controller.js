const voteModel= require("../../../Database/Models/vote.model");
const blogModel= require("../../../Database/Models/blog.model");
const commentModel= require("../../../Database/Models/comment.model");
const upVoteComment = async(req,res)=>{
    const {referenceId} = req.params;
    const {author,type} = req.body;
    const voteInstance = new voteModel({
        type,
        referenceId,
        author
    });
    const upVote = await voteInstance.save();
    res.json({
        message:'success',
        vote:upVote,
        incrementedComment: incrementCommentUpVotes(referenceId)
    });
}
const incrementCommentUpVotes = async(referenceId)=>{
    console.log(referenceId)
    const user = await commentModel.findByIdAndUpdate(referenceId,{$inc:{nUpVotes:1}});
    console.log(user)
    return user;
}
const incrementCommentDownVotes = async(referenceId)=>{
    console.log(referenceId)
    const user = await commentModel.findByIdAndUpdate(referenceId,{$inc:{nDownVotes:1}});
    console.log(user)
    return user;
}
const downVoteComment = async(req,res)=>{
    const {referenceId} = req.params;
    const {author,type} = req.body;
    const voteInstance = new voteModel({
        type,
        author,
        referenceId
    })
    const downVote = await voteInstance.save();
    console.log(downVote)
    const incrementedComment = incrementCommentDownVotes(referenceId)
    res.json({
        message:'success',
        vote:downVote,
        incrementedComment
    })
}
const upVoteBlog = async(req,res)=>{
    const {referenceId} = req.params;
    const {author,type} = req.body;
    const voteInstance = new voteModel({
        type,
        author,
        referenceId
    })
    const upVoted = await voteInstance.save();
    console.log(upVoted)
    const incrementedComment = incrementBlogUpVotes(referenceId)
    res.json({
        message:'success',
        vote:upVoted,
        incrementedComment
    })
}
const incrementBlogUpVotes  =async (referenceId)=>{
    console.log(referenceId)
    const blog = await blogModel.findByIdAndUpdate(referenceId,{$inc:{nUpVotes:1}});
    return blog;
}
const incrementBlogDownVotes  =async (referenceId)=>{
    console.log(referenceId)
    const blog = await blogModel.findByIdAndUpdate(referenceId,{$inc:{nDownVotes:1}});
    return blog;
}
const decrementBlogDownVotes  =async (referenceId)=>{
    console.log(referenceId)
    const blog = await blogModel.findByIdAndUpdate(referenceId,{$inc:{nDownVotes:-1}});
    return blog;
}
const decrementBlogUpVotes  = async (referenceId)=>{
    console.log(referenceId)
    const blog = await blogModel.findByIdAndUpdate(referenceId,{$inc:{nUpVotes:-1}});
    return blog;
}
const decrementCommentUpVotes  = async (referenceId)=>{
    console.log(referenceId)
    const blog = await commentModel.findByIdAndUpdate(referenceId,{$inc:{nUpVotes:-1}});
    return blog;
}
const decrementCommentDownVotes  = async (referenceId)=>{
    console.log(referenceId)
    const blog = await commentModel.findByIdAndUpdate(referenceId,{$inc:{nDownVotes:-1}});
    return blog;
}
const downVoteBlog = async(req,res)=>{
    const {referenceId} = req.params;
    const {author,type} = req.body;
    const voteInstance = new voteModel({
        type,
        author,
        referenceId
    })
    const downVote = await voteInstance.save();
    console.log(downVote)
    const incrementedComment = incrementBlogDownVotes(referenceId)
    res.json({
        message:'success',
        vote:downVote,
        incrementedComment
    })
}
const getAllUpVotes = async(req,res)=>{
    const {referenceId} = req.params;
    const allUpVotes = await voteModel.find({type:'upVote',
    referenceId
    })
    res.json({
        data:allUpVotes
    })
}
const getAllDownVotes = async(req,res)=>{
    const {referenceId} = req.params;
    const allDownVotes = await voteModel.find({type:'downVote',
    referenceId
    })
    res.json({
        data:allDownVotes
    })
}
const undoDownVoteFromBlog = (referenceId)=>{
    const response = voteModel.findByIdAndDelete(referenceId);
    decrementBlogDownVotes(referenceId)
    res.json({
        message:'success',
        data:response
    })
}
const undoUpVoteFromBlog = (referenceId)=>{
    const response = voteModel.findByIdAndDelete(referenceId);
    decrementBlogUpVotes(referenceId)
    res.json({
        message:'success',
        data:response
    })
}
module.exports = {upVoteComment,downVoteComment,upVoteBlog,downVoteBlog,getAllUpVotes,getAllDownVotes}
