// config/passport.js
// complete google + github passport configuration

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/user.js");

module.exports = function (passport) {
  // how user info is stored in the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // how user info is taken out of the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  /* -------------------- GOOGLE STRATEGY -------------------- */
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email:
                profile.emails && profile.emails.length > 0
                  ? profile.emails[0].value
                  : undefined,
              avatar:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : undefined,
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  /* -------------------- GITHUB STRATEGY -------------------- */
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });

          if (!user) {
            user = await User.create({
              githubId: profile.id,
              name: profile.displayName || profile.username,
              email:
                profile.emails && profile.emails.length > 0
                  ? profile.emails[0].value
                  : undefined,
              avatar:
                profile.photos && profile.photos.length > 0
                  ? profile.photos[0].value
                  : undefined,
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
};
