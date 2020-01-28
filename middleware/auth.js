const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    // Get token from heder
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.json({ msg: 'No token, authorization denied' });
    }


    

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch (err) {
        res.json({ msg: 'Token is not valid'});
    }
}