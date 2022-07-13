const router = require("express").Router();
const {getComments,postComment,deleteComment, editComment} = require("../Comments/controllers/comments.controller")
router.get("/getComments/:blogId",getComments);
router.post("/postComment/:blogId",postComment);
router.delete("/deleteComment/:id",deleteComment);
router.patch("/editComment/:id",editComment);
module.exports = router