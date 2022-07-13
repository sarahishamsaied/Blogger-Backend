const router = require("express").Router();
const { signUpValidator } = require("../../Middlewares/validation");
const {signUp, signIn, getUserByUsername, getAllUsers} = require("../Users/controllers/users.controller");
const { signUpValidation } = require("./users.validator");
router.post("/signUp",signUpValidator(signUpValidation),signUp)
router.post("/signIn",signIn)
router.get("/getAllUsers",getAllUsers)
router.get("/users/:username",getUserByUsername)
module.exports = router