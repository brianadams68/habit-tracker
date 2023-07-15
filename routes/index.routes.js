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
  const currentUser = req.session.currentUser;
  const changes = await User.find({ _id: currentUser._id });

  res.render("users/account", {
    userInSession: req.session.currentUser,
    changes,
  });
  console.log(changes);
});

// EDIT Account

router.get("/account/:id/edit", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    const changes = await User.findById(id);
    res.render("account/updateAccount", { changes });
  } catch (error) {
    console.log("There has been an error: ", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/account/:id/edit", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }

  try {
    const updatedAccount = await User.findByIdAndUpdate(
      id,
      {
        username: username,
        email: email,
        password: password,
      },
      { new: true }
    );
    res.redirect("/account");
  } catch (error) {
    console.log("There has been an error: ", error);
    res.status(500).send("Internal Server Error");
  }
});

//DELETE Account
router.post("/account/:id/delete", isLoggedIn, async (req, res, next) => {
  const { id } = req.params;
  try {
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
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;
