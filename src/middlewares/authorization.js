import { request, response } from 'express'
import jwt from 'jsonwebtoken';
import 'dotenv/config'; 

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const authorize = (req, res, next) => {
    const authHeader = req.headers.authorization?.split(' ');
    if (!authHeader || authHeader[0] !== 'Bearer' || !authHeader[1]) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token data to request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(401).json({ error: 'Invalid token' });
    }
}