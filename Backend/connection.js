const mongoose = require('mongoose');

async function connectToMongoDB(url){
    try{
        await mongoose.connect(url); 
        console.log("Connected to Database Interview PlatForm")       
    }
    catch(e){
        console.log("Error: ", e);
    }

}

module.exports = connectToMongoDB;