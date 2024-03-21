import {v2 as cloudinary} from 'cloudinary';
import exp from 'constants';
import { response } from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        //upload file on cloudinary
        cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        //file has been uploaded successfully
        console.log("File uploaded on cloundinary.", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temprary file as upload operation got failed.
        return null;
    }
}

export { uploadOnCloudinary }