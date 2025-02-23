const jwt = require('jsonwebtoken')

const dotenv = require('dotenv');
const Users = require('../Models/User_Model');
dotenv.config();

const keySecret = process.env.JWT_SECRET;

function setUser(user){
    return jwt.sign({
        _id: user._id,
        email: user.email,
        name : user.name,
        role: user.role
        // password: user.password,
    },
    keySecret, 
    {expiresIn: '30m'}
);
}

function getUser(token){
    if(!token){
        return {Error: "No Token provided"};
    }
    try{
        console.log("first")
        // console.log(jwt.verify(token, keySecret))
        return jwt.verify(token, keySecret);
        // console.log("jhgf")
    }
    catch(error){
        // console.log(error.name)
        if(error.name == 'TokenExpired'){
            return {Error: 'Token Has Expired'}
        }
        if(error.name == 'JsonWebTokenError'){
            return {Error: 'Invalid Token'}
            
        }
        else{
            return {Error: 'An Unkown Error Occured'};
        }
    }
}

module.exports = {
    getUser,
    setUser,
}