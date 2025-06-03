import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const token = req.header('token');

    if(!token) {
        return res.status(401).json({ 
            success: false,
            message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token is not valid' });
    }
}