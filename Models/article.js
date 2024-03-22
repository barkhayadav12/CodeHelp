const mongoose=require('mongoose');

const articleSchema=new mongoose.Schema({
    title:String,
    description:String,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},{timestamps:true});

const ArticleModel=mongoose.model('Article',articleSchema);
module.exports=ArticleModel;