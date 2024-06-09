const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const pool = require('./databaseSet');

dotenv.config({ path: './src/routes/.env' });

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback"
},
async function(token, tokenSecret, profile, done) {
  try {
    const userEmail = profile.emails[0].value;  // Gmail을 가져옵니다.
    const [rows] = await pool.query('SELECT * FROM user WHERE user_email = ?', [userEmail]);
    if (rows.length > 0) {
      return done(null, rows[0]);
    } else {
      const [result] = await pool.query('INSERT INTO user (user_name, user_nickname, user_email, user_password, user_salt, role) VALUES (?, ?, ?, ?, ?, 0)', 
        [profile.displayName, profile.displayName, userEmail, '', '']);
      const [newUser] = await pool.query('SELECT * FROM user WHERE user_email = ?', [userEmail]);
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
    const [rows] = await pool.query('SELECT * FROM user WHERE user_id = ?', [id]);
    if (rows.length > 0) {
      done(null, rows[0]);
    } else {
      done(null, null);
    }
  } catch (err) {
    done(err, null);
  }
});