const express = require('express');
const app = express();

const resourceRoutes = require('./api/routes/resources');

app.use('/resources', resourceRoutes);

module.exports = app;