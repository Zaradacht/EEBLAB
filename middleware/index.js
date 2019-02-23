module.exports = {
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error", "You must be signed in to do that!");
    res.redirect("/login");
  },
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.role > 0) {
        return next();
      }
    }
    req.flash("error", "You are not allowed to do that!");
    res.redirect("/");
  }
};
