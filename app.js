const express = require('express');
const dotenv = require('dotenv');

const app = express();

// Load env vars
dotenv.config();

// Body parser
app.use(express.json());

module.exports = app;
