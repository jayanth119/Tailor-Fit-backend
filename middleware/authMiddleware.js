const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        console.log("req.user",req.user);
        next();
    } catch (error) 
    {
        if (error.name === "TokenExpiredError") 
            {

            return res.status(401).json({ message: "Token expired. Please log in again." });
        }
        return res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;


