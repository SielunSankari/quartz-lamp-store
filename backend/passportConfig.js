const bcrypt = require('bcrypt');
const db = require('./db');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Используем $1 вместо ? для PostgreSQL
        const result = await db.query(
          'SELECT * FROM users WHERE username = $1',
          [username],
        );

        if (result.rows.length === 0) {
          return done(null, false, { message: 'Incorrect username.' });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (isValid) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password.' });
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await db.query(
        'SELECT id, username FROM users WHERE id = $1',
        [id],
      );

      if (result.rows.length === 0) {
        return done(new Error('User not found'));
      }

      done(null, result.rows[0]);
    } catch (err) {
      done(err);
    }
  });
};
