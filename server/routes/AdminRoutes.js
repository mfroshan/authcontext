const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';


function checkAdminRole(req, res, next) {
    const token = req.cookies.token;

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.sendStatus(403);
        }

        const { user } = decoded;

        if (user && user.role === 'Admin') {
            req.user = user;
            next();
        } else {
            res.sendStatus(403);
        }
    });
}

// Example route for admin
router.get('/data', checkAdminRole, (req, res) => {
    res.json({ message: 'This route is protected.', user: req.user });
});

module.exports = router;
