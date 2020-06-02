// Core modules
const path = require('path');

// Setup aliases for paths require
require('module-alias/register');

// Third party packages
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const fileupload = require('express-fileupload');

// Application packages
const errorHandler = require('./middlewares/error');
const connectDB = require('./services/db');

// Define application variables
const app = express();

// Load env vars
dotenv.config();

// Body parser
app.use(express.json());

// Connect to database
connectDB();

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
  app.use(require('morgan')('dev'));
}

// File uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, '../public')));

// Setup modules architecture
require('./modules')(app);

// Handle aplication errors as JSON
app.use(errorHandler);

module.exports = app;
