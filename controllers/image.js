import User from "../models/user.js"
import Images from "./../models/image.js"

export const uploadImage=(req,res)=>{
    req.body.uploadedBy=req.profile._id
    const image =new Images(req.body)
    image.save((error,image)=>{
        if(error){
            return res.status(400).json({
                error:"Not able to save image in DB"
            })
        }else if(image){
            //updating user with image id
            User.findByIdAndUpdate(req.profile._id,{$push:{images:image._id}},{new:true},(err,user)=>{
                if(err){
                    return res.status(400).json({
                        error:"Not to add image to user profile"
                    })
                }
                res.json(image)
            })
        }else{
            return res.json({
                error:"Not able to connect DB"
            })
        }
        
    })
}

export const getImageById=(req,res,id,next)=>{
    Images.findById(id,(err,image)=>{
        if(err){
            return res.status(400).json({
                error:"Provided id in pram is not valid"
            })
        }
        req.image=image;
        next();
    })
}

export const getImage=(req,res)=>{
    req.image.createdAt=undefined
    req.image.updatedAt=undefined
    res.json(req.image)
}
export const likeImage=(req,res)=>{
    Images.findByIdAndUpdate(req.body.postId,{$push:{likedUsers:req.profile._id}},(error,image)=>{
        if(error){
            return res.status(400).json({error:error})
        }
        return res.json({success:"Added liked successfully"})
    })
}
export const unLikeImage=(req,res)=>{
    Images.findByIdAndUpdate(req.body.postId,{$pull:{likedUsers:req.profile._id}},(error,image)=>{
        if(error){
            return res.status(400).json({error:error})
        }
        return res.json({success:"Removed  liked successfully"})
    })
}






