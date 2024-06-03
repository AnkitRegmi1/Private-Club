module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  },
  ensureMember: function (req, res, next) {
    if (req.isAuthenticated() && req.user.membershipStatus) {
      return next();
    }
    res.redirect('/join');
  }
};
