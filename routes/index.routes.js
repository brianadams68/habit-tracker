const router = require("express").Router();

//Require Models
const Habit = require("../models/Habits.model");
const User = require("../models/User.model");

//require middleware
const { isLoggedIn, isLoggedOut } = require("../middleware/route-guard.js");

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

//GET user profile
router.get("/userProfile", isLoggedIn, async (req, res, next) => {
  const currentUser = req.session.currentUser;
  const habitList = await Habit.find({ user: currentUser._id });

  res.render("users/user-profile", {
    userInSession: req.session.currentUser,
    habitList,
  });
});

//POST from userProfile
router.post("/userProfile", isLoggedIn, async (req, res, next) => {
  try {
    //Create new Habit
    const currentUser = req.session.currentUser;

    console.log(currentUser);
    console.log(req.body);
    const { name } = req.body;
    const newHabit = await Habit.create({
      name: name,
      user: currentUser._id,
    });
    res.redirect("/userProfile");
  } catch (error) {
    console.log("There has been an error: ", error);
  }
});

router.post("/userProfile/:id/delete", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    await Habit.findByIdAndDelete(id);
    res.redirect("/userProfile");
  } catch (error) {
    console.log("There has been an error: ", error);
  }
});

//GET Account
router.get("/account", isLoggedIn, async (req, res, next) => {
  const currentUser = req.session.currentUser;
  const userList = await User.find({ user: currentUser._id });

  res.render("users/account");
});

// Delete account
router.post("/account/:id/delete", isLoggedIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log("Deleting user with ID:", id);
    await User.findByIdAndDelete(id);
    res.redirect("/");
  } catch (error) {
    console.log("There has been an error: ", error);
  }
});

//POST logout
router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
