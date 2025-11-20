// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const connectDB = require('./config/db');

const app = express();

// Connect to DB
connectDB();

// View setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Gmail email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// HOME PAGE
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// ABOUT PAGE
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// CONTACT PAGE
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', sent: false, error: null });
});

app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `New Contact Message: ${name}`,
      text: `From: ${name} (${email})\n\n${message}`
    });

    res.render('contact', { title: 'Contact', sent: true, error: null });
  } catch (err) {
    console.error(err);
    res.render('contact', {
      title: 'Contact',
      sent: false,
      error: 'Error sending message. Try again later.'
    });
  }
});

// ROUTES FOR WORKOUT CRUD
const workoutRoutes = require('./routes/workouts');
app.use('/workouts', workoutRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).render('index', { title: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${3000}`)
);
