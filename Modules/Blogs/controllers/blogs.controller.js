const blogModel = require("../../../Database/Models/blog.model")
const getAllBlogs = async(req,res)=>{
    try{
        const blogs = await blogModel.find({}).populate([{
            path:"author",
            select:"username firstName lastName email"
        }]);
        res.json({
            message:'success',
            data:blogs
        })
    }
    catch(e){
        console.log(e.message);
        res.json({
            message:'Cannot process your request'
        })
    }
};
const getAuthorBlogs = async(req,res)=>{
    try{
        const {authId} = req.params;
        const blogs = await blogModel.find({
            author:authId
        }).populate([{
            path:'author',
            select:'username email firstName lastName'
        }])
        res.json({
            message:'success',
            data:blogs
        })
    }catch(e){
        console.log(e.message);
        res.json({
            message:"error",
        })
    }

}
const deleteBlog = async(req,res)=>{
    const {id} = req.params;
    const deletedBlog  = await blogModel.findByIdAndDelete({
        _id:id
    });
    console.log(deletedBlog);
    res.json({
        message:'success',
        data:deletedBlog
    })
}
const getBlog = async(req,res)=>{
    const {id} = req.params;
    console.log(id)
    const blog = await blogModel.findOne({
        _id:id
    })
    res.json({
        message:'success',
        data:blog
    })
}
const editBlog = async(req,res)=>{
        const {id} = req.params;
        console.log(id)
        const {body,author,category,title,tags} = req.body;
        console.log(body,author,category,title)
        const editedBlog = await blogModel.findByIdAndUpdate(id,{
            body,
            author,
            category,
            title,
            tags
        },{new:true});
        console.log(editedBlog)
        res.json({
            message:'success',
            data:editedBlog
        })
  
}
const searchBlogs = async(req,res)=>{

}
const postBlog = async(req,res)=>{
    const {body,author,category,title,tags,blogImage} = req.body;
    try{
        const blogInstance = new blogModel({
            body,
            author,
            category,
            title,
            nVotes:0,
            nComments:0,
            tags,
            blogImage
        })
        const addedBlog = await blogInstance.save();
        res.json({
            message:'success',
            data:addedBlog
        })
    }catch(err){
        console.log(err)
        res.json({
            message:"Error processing request",
            data:[]
        })
    }
}
module.exports = {getAllBlogs,getAllBlogs,deleteBlog,editBlog,searchBlogs,getAuthorBlogs,getBlog,postBlog}