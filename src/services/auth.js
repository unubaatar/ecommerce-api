const jwt = require('jsonwebtoken');

const jwtSecret = process.env.SECRET_KEY;

const auth = (req , res , next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Хандах эрх байхгүй байна.' });
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = user;
        next();
      });
}

module.exports = auth;