const router = require("express").Router();
const {getAllBlogs,getAuthorBlogs,deleteBlog,editBlog,searchBlogs,getBlog,postBlog, filterBlogsByTags, getFeed,explore} = require("../Blogs/controllers/blogs.controller")
router.get("/getAllBlogs",getAllBlogs);
router.get("/getAuthorBlogs/:authId",getAuthorBlogs);
router.delete("/deleteBlog/:id",deleteBlog);
router.get("/getBlog/:id",getBlog);
router.put("/editBlog/:id",editBlog);
router.get("/searchBlogs/:title",searchBlogs);
router.post("/postBlog",postBlog);
router.get("/filterByTags/:tag",filterBlogsByTags);
router.get("/getFeed/:user",getFeed);
router.get("/explore",explore);
module.exports = router;