const router = require("express").Router();
const { signUpValidator } = require("../../Middlewares/validation");
const {signUp, signIn, getUserByUsername, getAllUsers, confirmEmail, signInWithGoogle,resendConfirmation, getUserByID,getFollowing, follow, editProfilePhoto, unfollow,addToReadingList} = require("../Users/controllers/users.controller");
const { signUpValidation } = require("./users.validator");
router.post("/signUp",signUpValidator(signUpValidation),signUp)
router.post("/signIn",signIn)
router.post("/signInWithGoogle",signInWithGoogle)
router.get("/getAllUsers",getAllUsers)
router.get("/users/:username",getUserByUsername)
router.get("/confirm/:token",confirmEmail)
router.get("/reconfirm/:token",resendConfirmation)
router.get("/getUserById/:id",getUserByID)
router.get("/getFollowing/:id",getFollowing)
router.post("/followUser/:sender/:receiver",follow)
router.post("/unfollowUser/:sender/:receiver",unfollow)
router.patch("/user/uploadPhoto",editProfilePhoto)
router.patch("/addToReadingList/:id/:blogId",addToReadingList)
module.exports = router