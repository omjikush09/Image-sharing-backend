import mongoose from  "mongoose"

const commentSchema=mongoose.Schema({
    comment:{
        type:String,
        required:true,
        trim:true
    },
    userId:{
        type:[mongoose.Types.ObjectId],
        required:true,
        ref:"User"
    },
    username:{
        type:String,
        required:true,
        trim:true
    },
    postId:{
        type:[mongoose.Types.ObjectId],
        required:true,
        ref:"Image"
    }
},{timestaps:true})

export default mongoose.model("Comment",commentSchema)