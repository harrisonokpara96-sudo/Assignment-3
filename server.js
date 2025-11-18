const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse incoming form data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the directory for views (where the EJS files are stored)
app.set('views', path.join(__dirname, 'views'));

// Serve static files (e.g., CSS, images, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Import the routes from the routes/index.js file
const indexRoutes = require('./routes/index');  // Import your routes here
app.use('/', indexRoutes);  // Use the routes

// Define the server's port (default to 3000)
const port = process.env.PORT || 3000;

// Start the server and listen on port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

