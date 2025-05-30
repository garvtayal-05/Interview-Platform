const express = require('express');
const app =  express();

const cors = require("cors");
app.use(cors())

const dotenv = require('dotenv');
dotenv.config(); 


const connectToMongoDB = require('./connection');
const DataBase_URL = process.env.DataBase_URL;
connectToMongoDB(DataBase_URL);




const User_Routes  = require('./Routes/User_Routes');
const JobProfiles_Routes  = require('./Routes/JobProfiles_Routes');
const Discussion_Routes  = require('./Routes/Discussion_Routes');
const Comment_Routes  = require('./Routes/Comment_Routes');
const STT_Routes = require('./Routes/STT_Routes');
const Interview_Routes = require('./Routes/Interview_Routes');



// app.use(checkforAuth)
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use('/user', User_Routes);
app.use('/jobprofile', JobProfiles_Routes)
app.use('/discuss', Discussion_Routes)
app.use('/comment', Comment_Routes)
app.use('/stt', STT_Routes)
app.use('/interview', Interview_Routes);

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', ()=>{console.log(`Server Started at ${PORT}`)});

