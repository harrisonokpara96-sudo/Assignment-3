const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

// Initialize Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Middleware to parse incoming form data and JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views folder

// Serve static files (CSS, images, JS)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection string from the Atlas dashboard
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.log('MongoDB connection error:', err);
  });

// Define Item Schema and Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

const Item = mongoose.model('Item', itemSchema);

// Route to render Home page
app.get('/', (req, res) => {
  res.render('index'); // Render index.ejs for home page
});

// Route to render Create Item page
app.get('/create', (req, res) => {
  res.render('create'); // Render create.ejs (form for creating a new item)
});

// Route to handle item creation (POST request)
app.post('/create', (req, res) => {
  const { name, description } = req.body;

  const newItem = new Item({
    name,
    description,
  });

  newItem.save()
    .then(() => {
      res.redirect('/items'); // Redirect to items list page
    })
    .catch(err => {
      console.error('Error creating item:', err);
      res.send('Error creating item');
    });
});

// Route to render Items List page
app.get('/items', (req, res) => {
  Item.find()
    .then(items => {
      res.render('items', { items }); // Pass the items to items.ejs
    })
    .catch(err => {
      console.error('Error fetching items:', err);
      res.send('Error fetching items');
    });
});

// Route to render Edit Item page
app.get('/edit/:id', (req, res) => {
  const itemId = req.params.id;

  Item.findById(itemId)
    .then(item => {
      res.render('edit', { item }); // Pass the item data to edit.ejs
    })
    .catch(err => {
      console.error('Error fetching item:', err);
      res.send('Error fetching item');
    });
});

// Route to handle item update (POST request)
app.post('/edit/:id', (req, res) => {
  const itemId = req.params.id;
  const { name, description } = req.body;

  Item.findByIdAndUpdate(itemId, { name, description })
    .then(() => {
      res.redirect('/items'); // Redirect to items list page after update
    })
    .catch(err => {
      console.error('Error updating item:', err);
      res.send('Error updating item');
    });
});

// Route to handle item deletion (GET request)
app.get('/delete/:id', (req, res) => {
  const itemId = req.params.id;

  Item.findByIdAndDelete(itemId)
    .then(() => {
      res.redirect('/items'); // Redirect to items list page after deletion
    })
    .catch(err => {
      console.error('Error deleting item:', err);
      res.send('Error deleting item');
    });
});

// Route to render Contact page
app.get('/contact', (req, res) => {
  res.render('contact'); // Render contact.ejs (form for contacting you)
});

// Route to handle contact form submission and send email (POST request)
app.post('/send-message', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',  // Use your email address here
      pass: process.env.EMAIL_PASSWORD,  // Store your email password securely in .env
    },
  });

  const mailOptions = {
    from: email,
    to: 'your-email@gmail.com',  // Your email address
    subject: `Message from ${name}`,
    text: `Message from: ${name} (${email})\n\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.send('Error: ' + error.message);
    }
    res.send('Message sent successfully!');
  });
});

// Start the server on port 3000 or environment-defined port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
