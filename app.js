const express = require('express');
const dotenv = require('dotenv');

const app = express();

// Load env vars
dotenv.config();

module.exports = app;
