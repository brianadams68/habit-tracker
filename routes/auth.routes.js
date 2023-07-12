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
    res.render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email, and password.",
    });
    return;
  }
  if (!regex.test(password)) {
    res.status(500).render("auth/signup", {
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

    res.redirect("login");
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Username and email need to be unique. Either username or email is already used",
      });
    }
    {
      next(error);
    }
  }
});
// GET route ==> to display the userProfile
router.get("/userProfile", (req, res) => res.render("users/user-profile"));

//GET route ==> to display the login
router.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: null });
});
module.exports = router;
