const User = require('../models/Users');
const passport = require('passport');

exports.signupGet = (req, res) => {
  res.render('signup');
};

exports.signupPost = async (req, res) => {
  const { firstName, lastName, username, password, confirmPassword, isAdmin } = req.body;
  if (password !== confirmPassword) {
    return res.render('signup', { error: 'Passwords do not match.' });
  }
  try {
    const user = new User({ firstName, lastName, username, password, isAdmin });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Error creating user.' });
  }
};

exports.loginGet = (req, res) => {
  res.render('login');
};

exports.loginPost = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
});

exports.joinGet = (req, res) => {
  res.render('join');
};

exports.joinPost = async (req, res) => {
  const { secretCode } = req.body;
  if (secretCode === process.env.SECRET_CODE) {
    req.user.membershipStatus = true;
    await req.user.save();
    res.redirect('/');
  } else {
    res.render('join', { error: 'Incorrect secret code.' });
  }
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
};
