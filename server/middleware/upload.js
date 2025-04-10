import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const createStorage = (folderName) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: folderName,
            allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
            transformation: [{ width: 1000, height: 1000, crop: "limit" }]
        },
    });
};

const commonConfig = {
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB limit
    },
};

const upload = {
    community: multer({ 
        storage: createStorage('community_avatars'),
        ...commonConfig
    }),
    post: multer({ 
        storage: createStorage('post_images'),
        ...commonConfig
    }),
    user: multer({ 
        storage: createStorage('user_avatars'),
        ...commonConfig
    })
};

export default upload;