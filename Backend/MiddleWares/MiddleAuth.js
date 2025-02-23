const {getUser} = require('../Services.js/Service_Auth');

function checkforAuth(req, res, next){
    const bearer = req.headers['authorization'];
    // console.log(req.user)
    req.user = null;
    // console.log(req.user)
    
    try{
        if (!bearer) { 
            return res.status(401).json({Error: "Please Login" })
        }
        // console.log(bearer)
        const token = bearer.split('Bearer ')[1];
        // console.log(token)
        if(!token){
            return res.status(401).json({Error: "Invalid token format"})
        }
        const user = getUser(token);
        console.log(user)
        // console.log(typeof user);


        if(user.Error){
            return res.status(401).json({Error: user.Error});
        }

        req.user = user;
        console.log(req.user)
        next();
    }
    catch(error){
        console.error("Error", error);
        return res.status(500).json({Error: "Internal server error"});
    }

}


function restrictTo(roles=[]){
    return function(req, res, next){
        try{
            if(!req.user){
                return res.status(401).json({Error: 'Please Login'})
            }
            if(!roles.includes(req.user.role)){
                return res.status(403).json({Error: "Unauthorized"})
            }
            next();
        }
        catch(error){
            console.log(Error,error);
            return res.status(500).json({Error: "Internal Server Error"})
        }
    }
}


module.exports={
    checkforAuth,
    restrictTo,
}