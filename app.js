require('module-alias/register');
const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const errorHandler = require('./middlewares/error');
const connectDB = require('./services/db');

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

// Handle aplication errors as JSON
app.use(errorHandler);

module.exports = app;
