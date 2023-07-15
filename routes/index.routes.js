const router = require("express").Router();
const mongoose = require("mongoose");

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

    // console.log(currentUser);
    // console.log(req.body);
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

//DELETE HABIT
router.post("/userProfile/:id/delete", isLoggedIn, async (req, res, next) => {
  try {
    await Habit.findByIdAndDelete(id);
    res.redirect("/userProfile");
  } catch (error) {
    console.log("There has been an error: ", error);
  }
});

//EDIT HABIT
router.get("/userProfile/:id/edit", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;

  const foundHabit = await Habit.findById(id);
  res.render("habits/update-form", { foundHabit });
});

router.post("/userProfile/:id/edit", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      id,
      {
        name: name,
      },
      { new: true }
    );
    res.redirect("/userProfile");
  } catch (error) {
    console.log("There has been an error: ", error);
  }
});

//GET account
router.get("/account", isLoggedIn, async (req, res, next) => {
  res.render("users/account");
});

//POST logout
router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;
