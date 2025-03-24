import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
        unique: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String    
    },
    bio: {
        type: String
    },
    joinedDate: {
        type: Date,
        default: Date.now
    }
});

export const User =  mongoose.model('User', UserSchema);