const User = require('../model/User');

const  handlelogOut = async (req, res)=>{
    // On client, also delete the accesstoken
    const cookies = req.cookies;  
  
    if(!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    //Is refreshTooken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    //console.log(foundUser);
  
    if(!foundUser)
    {
        res.clearCookie('jwt', { httpOnly: true, sameSite:'None', secure:true });
        return res.sendStatus(403);
    }

    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', {httpOnly: true, sameSite:'None', secure:true}); //secure:true-only serves on https
    res.sendStatus(204);
      
} 

module.exports = { handlelogOut };