const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

console.log('Cloudinary Config:', cloudinary.config());


module.exports = cloudinary;
