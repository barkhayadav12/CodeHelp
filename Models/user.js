const mongoose=require('mongoose')
const {createHmac,randomBytes}=require('crypto');
const { createTokenForUser } = require('../services/authenticate');

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    profileImg:{
        type:String,
        default:'/Images/defaultImg.jpeg'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:'USER'
    }
},{timestamps:true}
)
UserSchema.pre('save',function(next){
    const user=this;
    if(!user.isModified("password")) return;
    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt).update(user.password).digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
    next();
})

UserSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    const user=await this.findOne({email});
    if(!user) throw new Error("User not found!");

    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac('sha256',salt).update(password).digest("hex");
    if(userProvidedHash!==hashedPassword) throw new Error('Incorrect password!');
    const token=createTokenForUser(user);
    return token;
})
const UserModel=mongoose.model('User',UserSchema);
module.exports=UserModel