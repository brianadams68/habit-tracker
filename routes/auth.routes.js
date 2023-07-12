const { Router } = require("express");
const router = new Router();
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const saltRounds = 16;

// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));

// POST route ==> to process form data
router.post("/signup", async (req, res, next) => {
    
    const { username, email, password } = req.body;

    try {
      const salt = await bcryptjs.genSalt(saltRounds);
      const hashedPassword = await bcryptjs.hash(password, salt);
      const userFromDB = await User.create({
        username,
        email,
        passwordHash: hashedPassword,
      });
      res.redirect("/user-profile");
    } catch (error) {
      next(error);
    }
});

// GET route ==> to display the userProfile
router.get("/userProfile", (req, res) => res.render("users/user-profile"));

module.exports = router;
