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
router.get("/account", (req, res) => {
res.render("users/account")
})

//GET Update account info
router.get("/account/:id/edit", (req, res) => {
  const userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (err) {
      // Handle error case
      console.log(err);
      res.render('error', { message: 'An error occurred' });
    } else {
      res.render('/account', { user });
    }
  });
})

// POST route for updating user information
router.post('/account/:id/edit', (req, res) => {
  const userId = req.params.id;
  const updatedUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  User.findByIdAndUpdate(userId, updatedUser, (err, user) => {
    if (err) {
      console.log(err);
      res.render('/account', { user: updatedUser, error: 'An error occurred' });
    } else {
      res.redirect('/user-profile');
    }
  });
});

//POST logout
router.post("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

module.exports = router;
