const userModel = require("../../../Database/Models/users.model");
const {StatusCodes} = require("http-status-codes");
const nodeMailer = require("nodemailer");
const verifyEmail = require("../../../Middlewares/emailVerification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {OAuth2Client} = require("google-auth-library");
const { findOne } = require("../../../Database/Models/blog.model");
const client = new OAuth2Client(process.env.CLIENT_ID);
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
                    receiver:[],
                    senders:[]
                })
            const user = await userInstance.save();
            let token = jwt.sign({id:user._id},process.env.JWT_KEY);
            let refreshToken = jwt.sign({id:user.id},process.env.JWT_KEY);
            let message = `<h1 style = "color:#7403fd">Welcome to blogger, ${username} </h1>
            <br/>
            <p>Note: this link will expire in one hour</p>
            <br/>
            <a href = http://localhost:5000/confirm/${token}>verify your email here</a>
            <br/>
            <a href = http://localhost:5000/reconfirm/${refreshToken}>resend confirmation</a>`
            verifyEmail(email,message);
            console.log(token)
            res.json({
                message:"success",
                token
            });
            }catch(e){
                console.log(e)
                res.json({
                    message:e.message
                })
            }
        }

}

const resendConfirmation = (req,res)=>{
    const {token} = req.params;
    const data = jwt.verify(token,process.env.JWT_KEY);
    res.json({
        data
    })
}
const signInWithGoogle = (req,res)=>{
    const {firstName,lastName,profilePic,idToken}  = req.body;
    client.verifyIdToken({idToken,audience:process.env.CLIENT_ID}).then(async(response)=>{
        const {email_verified,email} = response.payload;
        if(email_verified)
        {
            const user = await userModel.findOne({
                email 
             });
             if(user)
             {
                const token = jwt.sign({id:user._id,isLoggedIn:true},process.env.JWT_KEY,{expiresIn:'7d'});
                res.status(200).json({
                    data:token,
                    message:'success',
                    status:200
                });
             }
             else
             {
                const newUser = await userModel.insertMany({
                    username:email.split("").slice(0,email.indexOf("@")).join(""),
                    firstName,
                    lastName,
                    email,
                    profilePic,
                    senders:[],
                    receiver:[],
                    interests:[],
                    readingList:[],
                    isConfirmed:true
                });
                const token = jwt.sign({id:newUser._id,isLoggedIn:true},process.env.JWT_KEY,{expiresIn:'7d'});
                res.status(200).json({
                    message:'success',
                    data:token,
                    status:200
                })
             }
          
        }  
        else
        res.json({
            message:"Invalid google account",
            status:400
        })  

    })
}
const signIn = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({
            email
        });
        if(user)
        {

            bcrypt.compare(password,user.password,function(err,result){
                if(!result)
                res.status(StatusCodes.BAD_REQUEST).json({
                    message:'Incorrect password',
                    status:400
                });
                else
                {
                    console.log(result,err)
                    const token = jwt.sign({id:user._id,isLoggedIn:true},process.env.JWT_KEY)
                    res.json({
                        message:'success',
                        token,
                        status:200
                    });
                }
            })
           

        }
        else
        res.status(StatusCodes.BAD_REQUEST).json({
            message:'User not found',
            data:user
        })
        
    }catch(e){
        console.log(e)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message:'Error processing your request'
        })
    }

}

const getUserByUsername = async(req,res)=>{
    const {username} = req.params
    const user = await userModel.findOne({
        username
    }).select("-password -confirmPassword").populate("blogs followers following");
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
    const users = await userModel.find({}).select("-password -confirmPassword");
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
const getUserByID = async(req,res)=>{
    const {id} = req.params;
    const foundUser = await userModel.findById(id).select("-password -confirmPassword").populate("blogs following followers");
    if(foundUser)
    res.json({
        data:foundUser,
        message:"success",
        status:200
    });
    else
    res.status(400).json({
        data:[],
        message:"Invalid Id",
        status:400
    })
}
const followingBlogs = ()=>{

}
const getFollowing = async(req,res)=>{
    try{
        const {id} = req.params;
        const following = await userModel.findOne({_id:id}).select("").populate("following blogs")
        if(following){        
                res.json({
                    message:"Found user",
                    response:following,
                    status:200
                })
        }
        else{
            res.status(400).json({
                message:'User not found',
                status:400,
                following:[]
            })
        }
    }
    catch(e){
        console.log(e)
        res.status(400).json({
            message:'Internal server error',
            status:400
        })
    }
}
const follow = async(req,res)=>{
    const {sender,receiver} = req.params;
    console.log(sender,receiver)
    if(sender === receiver)
    {
        res.json({
            message:'no change'
        })
        return
    }
    const senderModel = await userModel.findOne({
        _id:sender
    })
    console.log(senderModel)
    const receiverModel = await userModel.findOne({
        _id:receiver
    })
    console.log(receiverModel)
    if(senderModel && receiverModel)
    {
        if(senderModel.following.includes(receiver))
        {
            res.json({
                message:'User is already followed'
            });
            return;
        }
        senderModel.following.push(receiverModel);
        receiverModel.followers.push(senderModel);
        const updatedSender = await userModel.findOneAndUpdate({
            _id:sender
        },{
            following:senderModel.following
        },{new:true}).populate("following");
        const updatedReceiver = await userModel.findOneAndUpdate({
            _id:receiver
        },{
            followers:receiverModel.followers
        },{new:true}).populate("followers");
       res.json({
        message:'success',
        updatedSender,
        updatedReceiver,
        status:200
       })
    }
    else
        res.status(400).json({
            status:400,
            message:'Cannot find user'
        })
}
const unfollow = async(req,res)=>{
    const {sender,receiver} = req.params;
    const foundSender = await userModel.findOne({_id:sender});
    const foundReceiver = await userModel.findOne({_id:receiver});
    if(sender === receiver)
    {
        re.status(400).json({
            message:'Sender and receiver cannot be the same',
            data:[]
        });
        return;
    }
    if(foundSender && foundReceiver){
        temp1 = foundSender.following.filter((element)=>{
            return element!=receiver
        });
        if(temp1 === foundSender.following){
            res.json({
                message:"Sender doesn't follow the receiver",
                data:[]
            });
            return;
        }
        temp2 = foundReceiver.followers.filter((element)=>{
            return element!=sender
        });
        const updatedReceiver = await userModel.findByIdAndUpdate(receiver,{followers:temp2},{new:true});
        const updatedSender = await userModel.findByIdAndUpdate(sender,{following:temp1},{new:true});
        res.json({updatedReceiver,updatedSender})
    }
    else
    res.status(400).json({
        message:'sender or receiver not found',
        data:[]
    })
}
const editProfilePhoto = (req,res)=>{
    try {
        console.log(req.files)
        res.end()
    } catch (error) {
        res.status(500).json({
            message:'Internal Server Error'
        })
    }
}
const addToReadingList = async(req,res)=>{
    const {id,blogId} = req.params;
    console.log("readingList is",readingList)
    const user = userModel.findOne({_id:id})
    if(user)
    {
        user.readingList = [...user.readingList,blogId]
        const updatedUser = await userModel.findByIdAndUpdate(id,{
        readingList:user.readingList
    });
    res.json({
        message:'success',
    });}
    else
    res.status(400).json({
        message:'User not found',
        data:[]
    });
  

}
module.exports = {signUp,signIn,getUserByUsername,getAllUsers,confirmEmail,signInWithGoogle,resendConfirmation,getUserByID,getFollowing,follow,editProfilePhoto,unfollow,addToReadingList}
