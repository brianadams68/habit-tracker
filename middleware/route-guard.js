//Checks if use is loggedIn
const isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("auth/login");
  }
  next();
};

//Checks if user is loggedOut
const isLoggedOut = (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect("/");
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut,
};
