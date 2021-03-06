const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Load User =require('../../models/User);

//@route GET api/users/test
//@desc Tests Users route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Users works" }));

//@route GET api/users/register
//@desc Register user
//@access Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already Exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
      1;
    }
  });
});

//@route GET api/users/login
//@desc Login user/Returning JWT Token
//@access Pulish

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "user not found" });
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //isMatched
        const payload = { id: user.id, name: user.name, avatar: user.avatar };

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.send({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password Incorrect" });
      }
    });
  });
});

//@route GET api/users/login

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
