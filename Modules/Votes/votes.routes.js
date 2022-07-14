const { upVoteComment, downVoteBlog, downVoteComment } = require("./controllers/votes.controller");

const route = require("express").Router();
route.post("/upVoteComment/:referenceId",upVoteComment);
route.post("/downVoteComment/:referenceId",downVoteComment);
route.post("/upVoteBlog/:referenceId",upVoteComment);
route.post("/downVoteBlog/:referenceId",upVoteComment);
route.delete("/undoUpVoteFromComment/:referenceId",upVoteComment);
route.delete("/undoUpVoteFromBlog/:referenceId",upVoteComment);
route.delete("/undoDownVoteFromComment/:referenceId",upVoteComment);
route.delete("/undoDownVoteFromBlog/:referenceId",upVoteComment);
route.get("/getBlogUpVotes/:referenceId",upVoteComment);
route.get("/getBlogDownVotes/:referenceId",upVoteComment);
route.get("/getCommentDownVotes/:referenceId",upVoteComment);
route.get("/getCommentUpVotes/:referenceId",upVoteComment);
module.exports = route;