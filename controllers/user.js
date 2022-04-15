import { request } from "express";
import User from "../models/user.js";

export const getUserById = (req, res, next, id) => {
  let Id = id || req.body._id;
  User.findById(Id, (err, user) => {
    if (err || user == null) {
      return res.status(400).json({
        error: "Provided id of user deos not match",
      });
    }
    req.profile = user;
    next();
  });
};

export const getUserByusername = (req, res, next, username) => {
  User.findOne({ username }, (err, user) => {
    if (err || user == null) {
      console.log(err);
      return res.status(400).json({
        error: "Provided  username deos not exist",
      });
    }
    req.profile = user;
    next();
  })
    .populate("images")
    .lean();
};

export const checkUserName = (req, res) => {

  User.findOne(req.body, (error, user) => {
  
    if (user ===null) {
      return res.json({
        success: "User Name is available",
      });
    }
    res.status(400).json({
      error: "User Name is not availabe",
    });
  });
};

export const getUser = (req, res) => {
  // console.log(req.profile.followers.length)
  req.profile.numberOfFollowers = req.profile.followers.length;
  req.profile.numberOfFollowing = req.profile.following.length;
  req.profile.numberOfPost = req.profile.images.length;
  req.profile.salt = undefined;
  // req.profile.images=undefined
  req.profile.encryPassword = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  // req.profile.followers = undefined;
  // req.profile.follow = undefined;
  // console.log(req.profile)

  return res.json(req.profile);
};

export const getPost =  async (req, res) => {
  if (req.profile.following.length !== 0) {
    let posts = [];
 
    // console.log(typeof req.profile.following)

    for (const following  of req.profile.following) {
        const  user= await User.findById(following).populate("images").exec();
        if ( user == null) {
            return res.status(400).json({
              error: "Not able to find following in DB",
            });
          }
          let post = {
            user,
            posturl: user.images.url,
          };
          // console.log(JSON.stringify(post, null, 2));
          posts.push(post);
         
       
    }
   
 
    return res.send(posts);
  } else {
    res.json({
      error: "Follow People  to see the posts",
    });
  }
};

export const addFollowing = (req, res) => {
  if (req.profile._id == req.body.id) {
    return res.status(400).json({
      error: "You cannot follow yourself",
    });
  }
  console.log(req.profile._id);
  console.log(req.body.id);
  User.findByIdAndUpdate(
    req.profile._id,
    { $push: { following: req.body.id } },
    (error, user) => {
      if (error) {
        return res.status(400).json({
          error: "Not able to add in DB",
        });
      }
      // console.log(user);
      if(req.body.id){
        User.findByIdAndUpdate(
          req.body.id,
          { $push: { followers: req.profile._id } },
          (error, user) => {
            if (error) {
              return res.status(400).json({
                error: "Not able to add in DB",
              });
            }
            return res.json({
              success: "Everything goes successfully",
            });
          }
        );
      }else{
        return res.status(400).json({
          error: "Something is went wrong",
        });
      }
     
    }
  );
};


export const getUsernameList=(req,res)=>{
  // console.log(`Username is ${req.body.username}`)
  const regex= new RegExp(`^${req.body.username}`)
  if(!req.body.username){
    return res.status(400).json({error:"Username not provided in body"})
  }
  User.find({"username":{$regex:regex}},{usernmae:1,profileImage:1,username:1,fullname:1},(error,users) =>{
    if(error){
      return res.status(400).json({error:error})
    }
   
    
    return res.status(200).send(users)
  }).lean()
}


export const addProfileImage=(req,res)=>{
    User.findByIdAndUpdate(req.profile._id,{profileImage:req.body.profileImage},(error,user)=>{
      if(error){
        return res.status(400).json({error:"Something wrong with Database"})
      }
      return res.status(200).json(res)
    })
    
}

export const addUsername=(req,res)=>{

  // console.log(req.body)
  // // console.log(req.profile._id)
  // const username=JSON.parse(req.body)
  // console.log(username)


  User.findByIdAndUpdate(req.profile._id,req.body,{new:true},(error,user)=>{
    if(error){
      return res.status(400).json({error:"Something wrong with DAtabase"})
    }
    return res.status(200).json(user)
  })
  
}
