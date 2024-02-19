const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

// Middleware for checking user role
function checkUserRole(req, res, next) {
    const authcookie = req.cookies.authcookie;

    jwt.verify(authcookie, JWT_SECRET_KEY, (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else if (data.user && data.user.role === 'user') {
            req.user = data.user;
            next();
        } else {
            res.sendStatus(403);
        }
    });
}

// Example routes for user
router.get('/api/user/data', checkUserRole, (req, res) => {
    // Logic for fetching staff-specific data from the database
    db.query('SELECT * FROM staff_data WHERE staff_id = ?', [req.user.username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.json({ message: 'Staff data fetched successfully', data: results });
    });
});

module.exports = router;
