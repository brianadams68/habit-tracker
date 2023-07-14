const router = require("express").Router();

//Require Models
const Habit = require("../models/Habits.model");

//require middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/userProfile", isLoggedIn, async (req, res, next) => {
  const habitList = await Habit.find({});

  res.render("users/user-profile", {
    userInSession: req.session.currentUser,
    habitList,
  });
});

router.post("/userProfile", async (req, res, next) => {
  try {
    console.log(req.body);
    const { name } = req.body;
    const newHabit = await Habit.create({ name });
    res.redirect("/userProfile");
  } catch (error) {
    console.log("There has been an error: ", error);
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});
module.exports = router;
