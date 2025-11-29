// routes/auth.js
// handles google and github login + logout

const express = require('express');
const passport = require('passport');

const router = express.Router();

// google login
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // login success
    res.redirect('/workouts');
  }
);

// github login
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// github callback
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/workouts');
  }
);

// logout
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
