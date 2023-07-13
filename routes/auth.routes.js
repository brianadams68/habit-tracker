const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const saltRounds = 16;

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

    res.redirect("login");
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

//GET route ==> to display the login
router.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: null });
});

// POST login route ==> to process form data
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.render("auth/login", {
        errorMessage: "Email is not registered. Try with other email.",
      });
    } else if (bcrypt.compareSync(password, foundUser.passwordHash)) {
      res.render("users/user-profile", { foundUser });
    } else {
      res.render("auth/login", { errorMessage: "Incorrect password." });
    }
  } catch (error) {
    console.log("There has been an error: ", error);
  }
});


module.exports = router;
