const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

// Middleware for parsing form data (for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as the view engine for rendering views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views folder

// Serve static files like CSS and JavaScript
app.use(express.static(path.join(__dirname, 'public')));

// Import the routes from the routes/index.js file
const indexRoutes = require('./routes/index');  // Make sure this file exists
app.use('/', indexRoutes);  // Use the imported routes

// Start the server
const port = process.env.PORT || 3000; // Use the port from the environment or default to 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
module.exports = app;
