const User = require('../model/User');

const jwt = require('jsonwebtoken');
//require('dotenv').config();


const  handleRefreshToken = async(req, res)=>{
    const cookies = req.cookies;
  
    if(!cookies?.jwt) return res.sendStatus(401);
    ///onsole.log("cookies");
    //console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
    //console.log(refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();
    console.log(foundUser);
    if(!foundUser) return res.sendStatus(403);
   
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded)=>{
            if(err || foundUser.username!== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { 
                    "UserInfo":
                         {  
                            "username": foundUser.username,
                            "roles": roles
                         }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn : '1m'}
            );
            res.json({ accessToken })
        }
        
    );
} 

module.exports = { handleRefreshToken };