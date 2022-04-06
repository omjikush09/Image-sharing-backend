import Comment from "../models/comment.js";
import Image from  "../models/image.js"


export const addComment=(req,res)=>{
     
    const comment = new Comment(req.body)
    comment.save((error,comment)=>{

        if(error){
            return res.status(400).json({error:error})
        }
        console.log(comment)
        return Image.findByIdAndUpdate(req.body.postId,{$push:{ comments:comment._id}},(error,image)=>{
            if(error){
                return res.status(400).json({error:error})
            }
            return res.status(200).json({success:"comment added Successfully"})
        })
        
    }
    )


}