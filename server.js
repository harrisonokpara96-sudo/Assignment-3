// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

const app = express();

// connect to mongodb atlas
connectDB();

// passport configuration (google + github)
require('./config/passport')(passport);

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware for forms and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// method override for PUT/DELETE forms
app.use(methodOverride('_method'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// session setup (needed for passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'simple session secret',
    resave: false,
    saveUninitialized: false,
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// make current user available in all views as "user"
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// nodemailer transporter for contact form
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// HOME PAGE
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// ABOUT PAGE
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// CONTACT PAGE (GET)
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact', sent: false });
});

// CONTACT FORM (POST)
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Workout Tracker Contact: ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.render('contact', { title: 'Contact', sent: true });
  } catch (err) {
    console.error('Error sending email:', err.message);
    res.status(500).send('Error sending message');
  }
});

// AUTH ROUTES (google + github)
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// WORKOUT CRUD ROUTES
const workoutRoutes = require('./routes/workouts');
app.use('/workouts', workoutRoutes);

// 404 fallback
app.use((req, res) => {
  res.status(404).render('404', { title: '404 - Page Not Found' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
