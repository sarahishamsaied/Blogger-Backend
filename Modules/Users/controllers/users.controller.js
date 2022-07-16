const userModel = require("../../../Database/Models/users.model");
const {StatusCodes} = require("http-status-codes");
const nodeMailer = require("nodemailer");
const verifyEmail = require("../../../Middlewares/emailVerification");
const jwt = require("jsonwebtoken")
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
        const isFound = await userModel.find({
            email
        });
        console.log(isFound)
        if(isFound.length>0){
         res.status(400).json({
            message:"User already exists"
        });  
        return;
        }
        else
        {
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
            let token = jwt.sign({id:user._id},process.env.JWT_KEY,{expiresIn:60*60});
            let message = `<h1 style = "color:#7403fd">Welcome to blogger, ${username} </h1>
            <br/>
            <p>Note: this link will expire in one hour</p>
            <br/>
            <a href = http://localhost:5000/confirm/${token}>verify your email here</a>`
            verifyEmail(email,message);
            console.log(token)
            res.json({
                message:"success",
                data:user
            });
            }catch(e){
                res.json({
                    message:e.message
                })
            }
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
};
const confirmEmail = async(req,res) =>{
  try{
    const {token} = req.params;
    const {id} = jwt.verify(token,process.env.JWT_KEY);
    const user = await userModel.findOne({_id:id,isConfirmed:false});
    console.log(user)
    if(user){
        const updatedUser = await userModel.findByIdAndUpdate(id,{
            isConfirmed:true
        },{new:true});
        res.status(200).json({
            message:'success',
            data:updatedUser
        })
    }
    else{
        res.status(400).json({
            message:'User not found'
        })
    }
  }
  catch(error){
    console.log(error.message)
    res.status(500).json({
        message:'server error'
    })
  }
}
module.exports = {signUp,signIn,getUserByUsername,getAllUsers,confirmEmail}
