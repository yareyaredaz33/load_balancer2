const jwt = require('jsonwebtoken')
const {secret} = require('../Config/config')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }

    try {

        const authorizationHeader = req.headers["authorization"];

        if (!authorizationHeader) {
            return res.status(403).json({ message: 'User not authorized, no token, no header' });
        }

      /*  const token = authorizationHeader.split(' ')[1];*/
        const token = authorizationHeader;

        /*const token = localStorage.getItem('token');*/
        if (!token) {
            return res.status(403).json({ message: 'User not authorized, NO token' });
        }

        const decodedData = jwt.verify(token, secret);
        req.user = decodedData;
        next();
    } catch (e) {
        console.error(e);
        return res.status(403).json({ message: 'User not authorized' });
    }
};