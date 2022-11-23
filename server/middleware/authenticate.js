const jwt = require("jsonwebtoken")
const User = require('../models/userSchema')


const Authenticate = async( req, res ,next) => {
    try {                                                       
        const token = req.cookies.jwtoken;
        console.log(token)
        const verifytoken = jwt.verify(token, process.env.SECRET_KEY);
        const mainUser = await User.findOne({_id: verifytoken._id, "tokens.token": token})

        if(!mainUser) {throw new Error("User not Found")}

        req.token = token;
        req.mainUser = mainUser;
        req.userID = mainUser._id;
        next()
    } catch (error) {
        res.status(401).send("Unauthorized: No token provided") 
        console.log(error) 
    }
} 

module.exports = Authenticate