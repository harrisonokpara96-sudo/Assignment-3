// middleware/auth.js
// tiny helpers to control access

module.exports = {
  // for routes that should only be used when logged in
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }

    // not logged in, send them to home (or you can show a message)
    return res.redirect('/');
  },

  // for pages like "login" if you don't want logged-in users to see them
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return res.redirect('/workouts');
    }
    next();
  },
};
