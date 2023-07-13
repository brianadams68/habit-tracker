const router = require("express").Router();

//require middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/userProfile", isLoggedIn, (req, res) => {
  res.render("users/user-profile", { userInSession: req.session.currentUser });
});


router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});
module.exports = router;
