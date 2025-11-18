const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Dummy data for the "items" list
let items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
];

// Home Page Route
router.get('/', (req, res) => {
  res.render('index');
});

// Create Item Form (GET)
router.get('/create', (req, res) => {
  res.render('create');
});

// Create Item (POST)
router.post('/create', (req, res) => {
  const { name } = req.body;
  const newItem = { id: items.length + 1, name };
  items.push(newItem);  // Add the new item to the list
  res.redirect('/items');  // Redirect to the list of items
});

// View Items (GET)
router.get('/items', (req, res) => {
  res.render('items', { items });  // Pass items to the view
});

// Edit Item Form (GET)
router.get('/edit/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    res.render('edit', { item });
  } else {
    res.send('Item not found');
  }
});

// Update Item (POST)
router.post('/edit/:id', (req, res) => {
  const { name } = req.body;
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex !== -1) {
    items[itemIndex].name = name;  // Update the item
    res.redirect('/items');
  } else {
    res.send('Item not found');
  }
});

// Delete Item (GET)
router.get('/delete/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);  // Delete the item
    res.redirect('/items');
  } else {
    res.send('Item not found');
  }
});

// Contact Page (GET)
router.get('/contact', (req, res) => {
  res.render('contact');
});

// Send Contact Form (POST)
router.post('/send-message', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',  // Use your email here
      pass: process.env.EMAIL_PASSWORD,  // Use an environment variable for your email password
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

module.exports = router;
