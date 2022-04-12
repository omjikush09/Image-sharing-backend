// import User from  "./../models/user";
// const User =require("../models/user")
import User from "../models/user.js"
import jwt from "jsonwebtoken"
import expressjwt from "express-jwt"
import user from "../models/user.js"
import {OAuth2Client} from "google-auth-library"

export const client= new OAuth2Client(process.env.CLIENT_ID) 
export const signup =(req,res)=>{ 
    User.where({email:req.body.email}).findOne((error,userfound)=>{
        
        const isgooglelogin=req.originalUrl==="/api/googlelogin"

        if(userfound && !isgooglelogin){
            return res.status(400).json({
                error:"User already exist"
            })
        }
        if(userfound && isgooglelogin){
            console.log(userfound)
            return res.status(200).json(userfound)
        }
        
        const user =new User(req.body);
        user.save((error,user)=>{
            if(error){
                 return res.status(400).json({
                     error:error
            })
            }
            user.encryPassword=undefined
            res.json( user)
    })
    })
}

export const signin=(req,res)=>{
    User.findOne({email:req.body.email},(error,user)=>{
        if(error){
            return res.status(400).json({
                error:"Not able to find user "
            })
        }
        if(user){
        const auth=user.authenticate(req.body.password);
        if(!auth){
            return res.status(400).json({
                error:"Email and password deos not match"
            })
        }
        var token = jwt.sign({_id:user._id},process.env.SECRET,{expiresIn:'1h'})
        res.cookie("token",token,{expire:new Date() + 1})
        const {fullname,email,_id,username}=user
        res.json({token,user:{fullname,email,_id,username}})
        }else{
            return res.status(400).json({
                error:"Not able to find user "
            })
        }
    })
}

export const signout =(req,res)=>{
    res.clearCookie("token", { path: '/' })
    res.status(200).json({
        success:"Signout Successful"
    })
}


//Protected Routes 
export const isSignIn = async (req,res,next)=>{
    const token= req.headers.authorization.split(" ")[1];
    // console.log(token)
    const user=jwt.decode(token)
    // console.log(JSON.stringify(user,null,2))
    // console.log(user +" hahahaf")
    if(user.email){  //
        try {
            
            const ticket=await client.verifyIdToken({idToken:token,audience:process.env.CLIENT_ID})
            req.auth=ticket.getPayload();
        } catch (error) {
            return res.status(401).json({error:"You are not authorized Login Again"})
        } 
        // console.log("google")
        // console.log(req.auth)
        next()
    }else if(user._id){
        // console.log("expressJWT")
        expressjwt({
            secret:process.env.SECRET,
            algorithms: ['HS256'],
             userProperty: 'auth' 
            })
    }else{
        return res.status(401).json({error:"You are not authorized"})
    }
}

//Middleware
export const isAuthenticated =(req,res,next)=>{
    let googleChecker=false
    let checker=false
    try {
       googleChecker=req.profile && req.auth && (req.profile.id==req.auth.sub)

    //    console.log(req.profile.id +"  profile")
    //    console.log(req.auth.sub +"  auth")
    //    console.log(googleChecker)
    } catch (error) {        
    }
    try {
        
         checker = req.profile && req.auth && req.auth._id &&( req.profile._id == req.auth._id || req.body._id==req.auth._id);
         if(!req.auth._id){
             checker=false
         }
        //  console.log(checker)
    } catch (error) {
        
    }
    if(!checker && !googleChecker){
        return res.status(403).json({
            error:"ACCESS DENIED"
        })
    }
    next();
}

export const isAdmin =(req,res,next)=>{
    if(req.profile.role!==1){
        return res.status(403).json({
            error:"You are not admin"
        })
    }
    next();
}


    




