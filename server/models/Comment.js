import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        maxLength: 500
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },  
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    upVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downVotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
       type: Date,
       default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Comment', commentSchema);