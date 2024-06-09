const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const pool = require('./databaseSet');

dotenv.config({ path: './src/routes/.env' });

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async function(token, tokenSecret, profile, done) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [profile.id]);
    if (rows.length > 0) {
      return done(null, rows[0]);
    } else {
      const [result] = await pool.query('INSERT INTO users (user_id, user_name, user_nickname, user_email, role) VALUES (?, ?, ?, ?, 0)', 
        [profile.id, profile.displayName, profile.displayName, profile.emails[0].value]);
      const [newUser] = await pool.query('SELECT * FROM users WHERE user_id = ?', [profile.id]);
      return done(null, newUser[0]);
    }
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (rows.length > 0) {
      done(null, rows[0]);
    } else {
      done(null, null);
    }
  } catch (err) {
    done(err, null);
  }
});