const jwt=require('jsonwebtoken')

const secret="yeagerist"

function createTokenForUser(user)
{
    const payload={
        _id:user.id,
        email:user.email,
        profileImg:user.profileImg,
        role:user.role,
    }
    const token=jwt.sign(payload,secret);
    return token;
}

function validateToken(token)
{
    const payload=jwt.verify(token,secret);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken
}