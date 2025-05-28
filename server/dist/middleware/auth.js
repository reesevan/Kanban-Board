// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET || 'your-secret-key';
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: 'Invalid or expired token' });
            return;
        }
        // Add the decoded user info to the request object
        req.user = decoded;
        next();
    });
};
