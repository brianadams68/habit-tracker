//Checks if use is loggedIn
const isLoggedIn = (req, res, next) => 
{console.log(req.session.currentUser);
  if (!req.session.currentUser) {
    console.log("no sesion")
    return res.redirect("/login");
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
