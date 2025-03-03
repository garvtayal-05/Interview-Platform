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
    {expiresIn: '1h'}
);
}

function getUser(token){
    if(!token){
        return {Error: "No Token provided"};
    }
    try{
        return jwt.verify(token, keySecret);
    }
    catch(error){
        // console.log(error)
        // console.log(error.name)
        if(error.name == 'TokenExpiredError'){
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