const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 16;
const { default: mongoose } = require("mongoose");

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) =>
  res.render("auth/signup", { errorMessage: null })
);

// POST route ==> to process form data
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

  // Make sure users fill all mandatory fields:
  if (!username || !email || !password) {
    res.render("/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email, and password.",
    });
    return;
  }
  if (!regex.test(password)) {
    res.status(500).render("/signup", {
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Encrypting
  const saltRounds = 13;
  const salt = bcrypt.genSaltSync(saltRounds);
  const passwordHash = bcrypt.hashSync(password, salt);

  try {
    const newUser = await User.create({
      username,
      email,
      passwordHash,
    });

    res.redirect("/login");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("/signup", {
        errorMessage:
          "Username and email need to be unique. Either username or email is already used",
      });
    }
    {
      next(error);
    }
  }
});
// // GET route ==> to display the userProfile
// router.get("/userProfile", (req, res) => res.render("users/user-profile"));

//GET route ==> to display the login
router.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: null });
});
// routes/auth.routes.js
// ... imports and both signup routes stay untouched

// GET login route stays untouched

// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email }) // <== check if there's user with the provided email
    .then((user) => {
      // <== "user" here is just a placeholder and represents the response from the DB
      if (!user) {
        // <== if there's no user with provided email, notify the user who is trying to login
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      }

      // if there's a user, compare provided password
      // with the hashed password saved in the database
      else if (bcrypt.compareSync(password, user.passwordHash)) {
        // if the two passwords match, render the user-profile.ejs and
        //                   pass the user object to this view
        //                                 |
        //                                 V
        res.render("users/user-profile", { user });
      } else {
        // if the two passwords DON'T match, render the login form again
        // and send the error message to the user
        res.render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => next(error));
});
module.exports = router;
