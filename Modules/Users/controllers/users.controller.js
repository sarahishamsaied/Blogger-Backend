const userModel = require("../../../Database/Models/users.model");
const {StatusCodes} = require("http-status-codes")
const signUp = async(req,res)=>{
    const { 
        firstName,
        lastName,
        email,
        username,
        password,
        confirmPassword,
        bio,
        location,
        interests,
        education,
        work } = req.body;
        try{
            const userInstance = new userModel({
                firstName,
                lastName,
                username,
                email,
                password,
                confirmPassword,
                bio,
                location,
                interests,
                education,
                work,
                following:[],
                followers:[]
            })
        const user = await userInstance.save();
        res.json({
            message:"success",
            data:user
        });
        }catch(e){
            console.log(e)
            res.json({
                message:e.message
            })
        }
}
const signIn = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({
            email
        });
        if(user)
        {
            const {firstName, lastName, email, username, location, interests, education, work , followers , following} = user; 
            const userData = {
                firstName,
                lastName,
                email,
                username,
                location,
                interests,
                education,
                work,
                followers, 
                following
            }
            if(user.password === password)
            res.json({
                message:'success',
                data:userData
            });
            else
            res.status(StatusCodes.BAD_REQUEST).json({
                message:'Incorrect password'
            })
        }
        else
        res.status(StatusCodes.BAD_REQUEST).json({
            message:'User not found',
            data:user
        })
        
    }catch(e){
        console.log(e.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:'Error processing your request'
        })
    }

}

const getUserByUsername = async(req,res)=>{
    const {username} = req.params
    const user = await userModel.findOne({
        username
    }).select("username email firstName lastName work bio education interests location followers following");
    if(user)
    res.json({
        message:'success',
        data:user
    })
    else
    res.status(StatusCodes.BAD_REQUEST).json({
        message:'User not found'
    })
}
const getAllUsers = async(req,res)=>{
    const users = await userModel.find({}).select("username email firstName lastName work bio education interests location followers following");
    console.log(users)
    if(users.length)
    res.json({
        message:'success',
        data:users
    });
    else
    res.json({
        message:'No users found',
        data:users
    })
}
module.exports = {signUp,signIn,getUserByUsername,getAllUsers}
