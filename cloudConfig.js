const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Ye line temporary add karke check karein
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// cloudConfig.js mein temporary test
// cloudinary.config({
//     cloud_name: 'dbwsqdmmr',
//     api_key: '574918526694479',
//     api_secret: 'KHs2aqTW2oBg3pHntoJj4JbjEh0' 
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowerdFormats: ["png","jpg","jpeg"], // supports promises as well
  },
});

module.exports = {cloudinary,storage}