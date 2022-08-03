const blogModel = require("../../../Database/Models/blog.model");
const commentModel = require("../../../Database/Models/comment.model");
const getComments = async(req,res)=>{
    const {blogId} = req.params;
    const foundBlog = await blogModel.findOne({
        _id:blogId
    }).select("comments").populate("comments.author")
    const {comments} = foundBlog;
    res.json({
        message:"success",
        data:comments
    })
}
const postComment = async (req,res)=>{
    const {blogId} = req.params;
    const {body,author} = req.body;
    const blog = await blogModel.findById(blogId);
    console.log(blog)
    if(blog){
        blog.comments.push({
            body,
            author,
            upVotes:[],
            downVotes:[]
        });
        const updatedBlog = await blogModel.findByIdAndUpdate(blog._id,{comments:blog.comments},{new:true});
        res.json({
            message:'success',
            data:updatedBlog
        });
    }
    else
    res.status(400).json({
        message:'Blog not found'
    })
}
const deleteComment = async(req,res)=>{
    const {id} = req.params;
    const {author,blogId} = req.body;
    let currentIndex;
    const foundBlog = await blogModel.findById(blogId);
    if(foundBlog){
        const foundComment = foundBlog.comments.find((comment,index)=>{
            console.log(comment._id)
            console.log(id)
            if(comment._id == id)
            {
                
                if(comment.author == author)
                {
                    currentIndex = index;
                    return comment;
                }
                res.status(403).json({
                    message:'Forbidden access'
                })
            }
        });
        if(foundComment){
            foundBlog.comments.splice(currentIndex,1);
            const deletedComment = await blogModel.findByIdAndUpdate(blogId,{comments:foundBlog.comments},{new:true})
            res.json({
                message:'success',
                data:deletedComment
            });
        }
        else{
            res.status(400).json({
                message:'Comment not found'
            })
        }
    }
    else{
        res.status(400).json({
            message:'Blog Id not found'
        })
    }
}
const editComment = async(req,res)=>{
  const {id} = req.params;
  const {body,author,blogId} = req.body;
  const foundBlog = await blogModel.findById(blogId);
  let currentComment;
  if(foundBlog)
  {
   let foundComment = foundBlog.comments.find((comment,index)=> {
    if(comment._id == id)
    {
            if(comment.author == author)
            {
                currentComment = index;
                console.log("found");
                return comment;
            }
            else
            {
                res.status(403).json({
                    message:'Forbidden access'
                });
            }

    }
  });
  console.log(foundComment)
  if(foundComment)
  {
    console.log(currentComment);
    foundBlog.comments[currentComment].body = body;
    console.log(foundBlog.comments[currentComment])
    const updatedComment = await blogModel.findByIdAndUpdate(blogId,{
        comments:foundBlog.comments
      },{new:true});
      res.json({
        message:'success',
        data:updatedComment
      })
  }
  else{
    res.status(400).json({
        message:'comment not found'
    });
  }
  }
  else
  res.status(400).json({
    message:'blog not found',
    data:[]
  });
}

module.exports = {getComments,postComment,deleteComment,editComment}