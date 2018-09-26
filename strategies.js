const { Strategy: LocalStrategy } = require('passport-local');

const { User} = require('./models');

const localStrategy = new LocalStrategy(
  {usernameField: 'username', passwordField: 'password'}, function(username, password, done){
  let user;
  User.findOne({ username: username })
    .then(_user => {
      user = _user;
      if (!user) {
        // Return a rejected promise so we break out of the chain of .thens.
        // Any errors like this will be handled in the catch block.
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return done(null, user);
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return done(null, false, err);
      }
      return done(err, false);
    });
});

module.exports = localStrategy;