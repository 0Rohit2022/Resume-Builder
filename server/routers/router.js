const express = require("express");
require("../db/connect");
const User = require("../models/userSchema");
const Router = express.Router();
const bcryptjs = require("bcryptjs");
const cookies = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
//   Middleware

Router.use(cookies());
Router.get("/", (req, res) => {
  res.send("Hello from the home page");
});



Router.get("/signup", (req, res) => {
  res.send("hello from the signup page");
});

// Register Routing
Router.post("/register", async (req, res) => {
  const { name, email, work, password, cpassword, phone } = req.body;

  if (!name || !email || !password || !cpassword || !work || !phone) {
    return res.status(422).json({ error: "Please fill all the details" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: "Passwords are not matching" });
    } else {
      const user = new User({
        name,
        email,
        password,
        work,
        phone,
        cpassword,
      });
      const userRegister = await user.save();

      if (userRegister) {
        return res
          .status(201)
          .json({ message: "User registered Successfully" });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

// Signin Routing
Router.post("/signin", async (req, res) => {
  try {
    let token;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please fill all the details" });
    }

    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);
    if (userLogin) {
      const isMatch = await bcryptjs.compare(password, userLogin.password);

      if (!isMatch) {
        res.status(400).json({ error: "Invalid Credentials" });
      } else {
        token = await userLogin.generateAuthToken();
        console.log(token);
        res.cookie("jwtoken", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true,
        });
        res.json({ message: "User Signin Successfully" });
      }
    } else {
      res.status(400).json({ error: "invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
  }
});

// Page of about us

Router.get("/about", authenticate, (req, res) => {
  console.log("Welcome to the about page");
  res.send(req.mainUser);
});
 
Router.get("/getdata", authenticate, (req, res) => {
  console.log("hello my about");
  res.send(req.mainUser);
});

Router.post("/contact", authenticate, async (req, res) => {
  try {
    const {name, email, phone, message} = req.body;

    if (!name || !email || !phone || !message) {
      console.log("Error in contact form");
      return res.json({ error: "Please filled up the contact form" });
      
    }

    const userContact = await User.findOne({ _id: req.userID });
    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );
      console.log(userMessage)
      await userContact.save();
      res.status(201).json({ message: "User Contact Successfully Added" });
    }
  } catch (error) {
    console.log(error);
  }
});


// logout router

Router.get("/logout", authenticate, (req,res) => {
  console.log("Signing off")
  res.clearCookie("jwtoken" , {path: '/'})
  res.status(200).send("User Logout")
})
module.exports = Router;
