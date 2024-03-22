const mongoose=require('mongoose')

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    coverImg:{
        type:String,
        required:false,
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true});

const PostModel=mongoose.model('Post',postSchema);
module.exports=PostModel;