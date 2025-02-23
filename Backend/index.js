const express = require('express');
const app =  express();
// const cors = require("cors");
// app.use(cors())
const dotenv = require('dotenv');
dotenv.config(); 
// console.log(process.env.DataBase_URL);

const connectToMongoDB = require('./connection');
const DataBase_URL = process.env.DataBase_URL;
connectToMongoDB(DataBase_URL);




const User_Routes  = require('./Routes/User_Routes');
const JobProfiles  = require('./Routes/JobProfiles_Routes');
// const { checkforAuth } = require('./MiddleWares/MiddleAuth');



// app.use(checkforAuth)
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/user', User_Routes);
app.use('/jobprofile', JobProfiles)

const PORT = process.env.PORT;
app.listen(PORT, ()=>{console.log(`Server Started at ${PORT}`)});

