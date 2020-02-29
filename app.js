const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const resourceRoutes = require('./api/routes/resources');
const userRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://' + process.env.MONGO_DB_USER + ':' + encodeURIComponent(process.env.MONGO_DB_PASS) + '@node-resources-api-r9djh.mongodb.net/test?retryWrites=true&w=majority', { 
    useUnifiedTopology: true,
    useNewUrlParser: true 
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Header handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Handle request routes
app.use('/uploads', express.static('uploads'));
app.use('/resources', resourceRoutes);
app.use('/users', userRoutes);

// Error handling on bad REST routes
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Error handling in event of database errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;