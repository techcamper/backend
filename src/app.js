// Core modules
const path = require("path");

// Setup aliases for paths require
require("module-alias/register");

// Third party packages
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Load env vars
dotenv.config();

// Application packages
const errorHandler = require("./middlewares/error");
const connectDB = require("./services/db");

// Define application variables
const app = express();

// Setup cors configuration
const whitelist = process.env.FRONTEND_URL.split(",");
const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200, // (IE11, various SmartTVs) choke on 204
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// Load cors
app.use(cors(corsOptions));

// Body parser
app.use(express.json());

// Connect to database
connectDB();

// Dev loggin middleware
if (process.env.NODE_ENV === "development") {
  app.use(require("morgan")("dev"));
}

// File uploading
app.use(fileupload());

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// Prevent http param pollution
app.use(hpp());

// Set static folder
app.use(express.static(path.join(__dirname, "../public")));

// Setup modules architecture
require("./modules")(app);

// Handle aplication errors as JSON
app.use(errorHandler);

module.exports = app;
