const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';
// Middleware for checking staff role
function checkStaffRole(req, res, next) {
    const authcookie = req.cookies.authcookie;

    jwt.verify(authcookie, JWT_SECRET_KEY , (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else if (data.user && data.user.role === 'staff') {
            req.user = data.user;
            next();
        } else {
            res.sendStatus(403);
        }
    });
}

// Example routes for staff
router.get('/data', checkStaffRole, (req, res) => {
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
