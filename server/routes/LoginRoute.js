const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

// Example routes using the role-specific middleware
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM tbl_login WHERE Username = ? AND Password = ?', [username, password], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            const role = results[0].U_Type;
            const token = jwt.sign({ user: { username, role } }, JWT_SECRET_KEY,{expiresIn: "1h"});
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' });
            res.json({ message: 'Login successful', role });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

module.exports = router;
