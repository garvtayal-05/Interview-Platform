const Users = require("../Models/User_Model");
const { setUser, getUser } = require("../Services.js/Service_Auth");
const argon2 = require('argon2');

async function User_SignUp(req, res){
    const {name, email, password, gender,age,role} = req.body;

        const temp_user = await Users.findOne({email: email.trim().toLowerCase()})
        
        if(temp_user){
            return res.status(409).json({Error: "Email id already exist. Please change it"});
        }

    if(!name || !email || !password || !gender || !age){
        return res.status(400).json({Error: "All fields are necessary"})
    }
    
    const hashedPassword = await argon2.hash(password);
    try{
        await Users.create({
         name, 
         email, 
         password: hashedPassword,
         gender, age,
         role
        });

        return res.status(200).json({Message: "User Created"});
    }
    catch(e){
        console.log('Error: ', e);
        return res.status(500).json({Error: "User Error"});
    }
}

async function User_Login(req,res){
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(409).json({Error: "Email and password are required"});
    }
    try{

        const user = await Users.findOne({email: email.trim().toLowerCase()})

        if(!user){
            return res.status(401).json({Error: 'Invalid Email'});
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if(!isPasswordValid){
            return res.status(401).json({Error: 'Wrong Password'})
        }

        const token = setUser(user);
        return res.json({token});
    }
    catch(err){
        console.log("Error: " ,err);
        return res.status(500).json({Error : "Internal Server Error"});

    }
}

const jwt = require("jsonwebtoken");

async function User_ForgotPassword (req, res){
    const { email } = req.body;
    
    const user = await Users.findOne({email});
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    const token = jwt.sign({email}, process.env.JWT_SECRET, { expiresIn: "3m" });

    return res.status(200).json({ resetToken: token, message: "Copy this token to reset your password" });
};


async function User_PasswordReset(req, res){
    const resetToken = req.headers['resettoken'];
    // console.log(resetToken)

    const {newPassword} = req.body;

    if(!resetToken){
        return res.status(400).json({Error: "Reset Token is required"})
    }
    if(!newPassword){
        return res.status(400).json({Error: "New Password required"})
    }

    try{

        const decodeToken = getUser(resetToken)
        
        if(decodeToken.Error){
            return res.status(401).json({Error: decodeToken.Error});
        }

        const user = await Users.findOne({email: decodeToken.email})
        console.log(user.email)
        
        if(!user){
            return res.status(404).json({Error: "No user found!"})
        }
        
        const newHashedPassword =  await argon2.hash(newPassword);
        user.password = newHashedPassword;
        await user.save();

        return res.json({ message: "Password reset successfully" }).status(201);
    }
    catch(Error){
        console.log(Error)
        return res.status(500).json({Error: "Internal Server Error"})
    }    
}


module.exports={
    User_SignUp,
    User_Login,
    User_PasswordReset,
    User_ForgotPassword
}