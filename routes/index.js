const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');
const { ensureAuthenticated, ensureMember } = require('../middleware/auth');

// Authentication routes
router.get('/signup', authController.signupGet);
router.post('/signup', authController.signupPost);
router.get('/login', authController.loginGet);
router.post('/login', authController.loginPost);
router.get('/logout', authController.logout);

// Join route
router.get('/join', authController.joinGet);
router.post('/join', authController.joinPost);

// Message routes
router.get('/', ensureAuthenticated, messageController.getMessages);
router.get('/new-message', ensureAuthenticated, (req, res, next) => {
  // If user is not a member, redirect to join page
  if (!req.user.membershipStatus) {
    return res.redirect('/join');
  }
  // If user is a member, proceed to new message page
  return messageController.newMessageGet(req, res, next);
});
router.post('/new-message', ensureAuthenticated, (req, res, next) => {
  // If user is not a member, redirect to join page
  if (!req.user.membershipStatus) {
    return res.redirect('/join');
  }
  // If user is a member, proceed to create new message
  return messageController.newMessagePost(req, res, next);
});
router.post('/message/upvote/:id', ensureAuthenticated, messageController.upvoteMessage);
router.post('/message/downvote/:id', ensureAuthenticated, messageController.downvoteMessage);

module.exports = router;
