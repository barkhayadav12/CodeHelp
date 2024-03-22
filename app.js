require("dotenv").config()
const express=require('express');
const mongoose=require('mongoose');
const path=require('path')
const cookieParser=require('cookie-parser')

const app=express();
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended:false}))


//connecting to mongoose

//mongodb url mongodb://127.0.0.1:27017/codeHelp
//set MONGO_URL=mongodb://127.0.0.1:27017/codeHelp(in terminal)

// mongoose.connect(process.env.MONGO_URL)
// .then((e)=>console.log('mongodb is connected'))

//local

mongoose.connect('mongodb://127.0.0.1:27017/codeHelp')

const PORT=process.env.PORT || 3000


const userRoute=require('./Routes/user');
const postRoute=require('./Routes/Post');
// const articleRouter=require('./Routes/articles')

const Post=require('./Models/post')
const Comment=require('./Models/comments')
const Article=require('./Models/article')

const { checkForAuthenticationCookie } = require('./middleware/authenticateCookie');


app.set('view engine',"ejs")
app.set("views",path.resolve("./views"))
app.use(express.json())
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use("/user",userRoute)
app.use("/post",postRoute)

app.get('/',async (req,res)=>{
    const allPost=await Post.find({}).sort('createdAt')
    const comments=await Comment.find({}).sort('createdAt')
    res.render('home',{
        user:req.user,
        post:allPost,
        comment:comments,
    })
})


app.get('/home',async (req,res)=>{
    const post= await Article.find().sort({createdAt:'desc'})
    res.render('Article',{post:post,user:req.user,})
})

app.get('/new',(req,res)=>{
    res.render('new',{post: new Post(),user:req.user})
})

app.get('/:id',async (req,res)=>{
    const post=await Article.findById(req.params.id);
    if(post==null)
    {
     res.redirect('/home');
    }
    res.render('show',{post:post,user:req.user})
 })


app.post('/home',async (req,res,next)=>{
    req.post= new Article()
    next()
},saveArticleAndRedirect('new'))

function saveArticleAndRedirect(path)
{
    return async (req,res)=>{
        let post=req.post
            post.title=req.body.title,
            post.description=req.body.description
        try{
           post= await post.save()
           res.redirect(`/home`)
        } catch(e){
            console.log(e);
            res.render(`${path}`,{post:post})
        }
    }
}

app.listen(PORT,()=>{
    console.log(`server started on ${PORT}`)
})