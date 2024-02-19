const express = require('express');
const cors = require('cors');
var path = require('path');
const cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');


const AdminRoutes = require('./routes/AdminRoutes');
const StaffRoutes = require('./routes/StaffRoutes');
const UsersRoutes = require('./routes/UserRoutes');
const loginRoutes = require('./routes/LoginRoute');

require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.options('*', cors())

app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/check-token', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ isValid: false });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('token verification error');
            return res.json({ isValid: false });
        }
        res.json({ isValid: true });
    });
});


app.post('/api/logout', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    });
});


// Use the admin routes module
app.use('/api',loginRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/staff', StaffRoutes);
app.use('/api/users', UsersRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  
console.log('connected');

module.exports = app;
