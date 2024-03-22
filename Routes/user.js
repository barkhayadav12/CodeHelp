const {Router}=require('express')
const user=require('../Models/user')
const router=Router();


router.get('/signin',(req,res)=>{
    return res.render('signin');
})
router.get('/signup',(req,res)=>{
    return res.render('signup');
})


router.post('/signup',async(req,res)=>{
    const {username,email,password}=req.body;
        await user.create({
            username,
            email,
            password,
        });
        console.log(req.body)
        return res.redirect("/user/signin");
})

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    try{
    const token=await user.matchPasswordAndGenerateToken(email,password);
    return res.cookie("token",token).redirect("/");
    }catch(err){
        return res.render('signin',{
            error:"Invalid email or password"
        })
    }

})
router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect("/");
})

module.exports=router;