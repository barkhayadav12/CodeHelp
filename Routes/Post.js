const {Router}=require('express')
const post=require('../Models/post')
const router=Router();
const multer=require('multer')
const path=require('path');
const { findById } = require('../Models/user');
const Comment=require('../Models/comments')
const methodOverride=require('method-override')
router.use(methodOverride('_method'))


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/upload/`))
    },
    filename: function (req, file, cb) {
      const fileName= `${Date.now()}-${file.originalname}`;
      cb(null, fileName)
    }
  })
const upload = multer({ storage: storage })


router.get('/addnew',(req,res)=>{
    return res.render("addPost",{
        user:req.user,
    })
})


router.post('/',upload.single("coverImg"),async (req,res)=>{
    const {title,body}=req.body
    const Post=await post.create({
        title,
        body,
        createdBy:req.user._id,
        coverImg:`/upload/${req.file.filename}`
    })
    return res.redirect("/")
})

router.get('/:id',async (req,res)=>{
    const Post=await post.findById(req.params.id).populate('createdBy')
    const comment=await Comment.find({postId:req.params.id}).populate('createdBy')
    return res.render("post",{
        user:req.user,
        Post,
        comment,
    })
})
router.post('/comment/:postId',async(req,res)=>{
    await Comment.create({
        content:req.body.content,
        postId:req.params.postId,
        createdBy:req.user._id,
    });
    return res.redirect(`/post/${req.params.postId}`)
})
router.delete('/:id',async(req,res)=>{
    await post.findByIdAndDelete(req.params.id)
    res.redirect('/')
})
router.delete('/comment/:id',async(req,res)=>{
    await Comment.findByIdAndDelete(req.params.id)
    res.redirect(`/`)
})
module.exports=router;