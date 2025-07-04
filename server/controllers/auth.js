import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Community from '../models/Community.js';

// Register user
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let user = await User.findOne({ email });
        if(user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = await User.findOne({ username });
        if(user) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        user = new User({username, email, password});
        const saltRounds = Number(process.env.SALT) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

// Login user

export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const query = email ? { email } : { username };
        const user = await User.findOne(query);
        if(!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d'});

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getCurrentUser = async(req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if(!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        console.log(`Fetching user with username: ${username}`);
        const user = await User.findOne({ username }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { bio, avatar } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (bio !== undefined) user.bio = bio;
        if (req.file && req.file.path) {
            user.avatar = req.file.path;
        } else if (avatar !== undefined) {
            user.avatar = avatar;
        }
        await user.save();
        res.json({ success: true, user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const postCount = await Post.countDocuments({ authorId: user._id });
        const commentCount = await Comment.countDocuments({ authorId: user._id });
        const joinedCommunities = await Community.countDocuments({ members: user._id });
        res.json({
            postCount,
            commentCount,
            joinedCommunities
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};