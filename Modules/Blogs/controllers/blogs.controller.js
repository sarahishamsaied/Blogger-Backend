const blogModel = require("../../../Database/Models/blog.model");
const commentModel = require("../../../Database/Models/comment.model");
const userModel = require("../../../Database/Models/users.model");
const getAllBlogs = async(req,res)=>{
    try{
        const blogs = await blogModel.find({}).populate([{
            path:"author",
            select:"username firstName lastName email bio work education location interests"
        }])
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
const filterBlogsByTags = async(req,res)=>{
    const {tag} = req.params;
    const foundBlogs = await blogModel.find({
        tags:{$in:[tag]}
    }).populate("author");
    res.json({
        message:'success',
        data:foundBlogs
    })
};

const getAuthorBlogs = async(req,res)=>{
    try{
        const {authId} = req.params;
        const blogs = blogModel.find({
            author:authId
        }).populate([{
            path:'author',
            select:'username firstName lastName email bio work education location interests'
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
    }).populate("author comments.author")
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
// const getFeed = async(req,res)=>{
//     const {user} = req.params;
//     const blogs = await blogModel.find({
//         followers:{$in:[user]}
//     }).select("author").populate("author");
//     if(!blogs)
//     {
//         res.json({
//             message:'not found',
//             data:[]
//         });
//         return;
//     }
//     res.json({
//         message:'success',
//         data:blogs
//     })
// }
const getFeed = async (req,res)=>{
    const {user} = req.params;
    let test2 = []
    const foundUser = await userModel.findOne({
        _id:user
    }).select("following").populate("following following.blog");
    let {following} = foundUser;
    const foundBlogs = await Promise.all(following.map(function(follower){
        return Promise.all(follower.blogs.map(function(blog){
          return blogModel.findOne({_id:blog}).populate("author");
        }));
      }));
      console.log(test2.length)
        res.json(   
           foundBlogs
        );

}
const postBlog = async(req,res)=>{
    const {body,author,category,title,tags,blogImage} = req.body;
    try{
        const user = await userModel.findById(author);
        if(user)
        {
            const blogInstance = new blogModel({
                body,
                author,
                category,
                title,
                nVotes:0,
                nComments:0,
                tags,
                blogImage,
                comments:[],
                upVotes:[],
                downVotes:[]
            })
            const addedBlog = await blogInstance.save();
            user.blogs.push(addedBlog._id);
            const updatedUser = await userModel.findByIdAndUpdate(author,{
                blogs:user.blogs 
             }).populate("blogs");
            res.json({
            status:200,
            message:'success',
            data:addedBlog,
            updatedUser
        })
        }
        else{
            res.status(400).json({
                status:400,
                message:'Invalid user Id'
            })
        }
    }catch(err){
        console.log(err)
        res.json({
            message:"Error processing request",
            data:[]
        })
    }
}
const explore = async(req,res)=>{
    try{
        console.log("hi")
        let promises;
        console.log(req.query.interests);
        const interests = req.query.interests;
        if(interests)
        {
            promises = interests.map((interest)=>{
                return blogModel.find({tags:interest}).select("tags title")
               });
        }
        const arr = await Promise.all(promises)
        res.status(200).json({message:'success',data:arr})
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:"Server Error",
            status:500
        })
    }
   
}
//upvote
//downvote
module.exports = {getAllBlogs,getAllBlogs,deleteBlog,editBlog,searchBlogs,getAuthorBlogs,getBlog,postBlog,filterBlogsByTags,getFeed,explore}