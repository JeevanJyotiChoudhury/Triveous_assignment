const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DeveloperModel } = require("../models/developer.model");

const developerRouter = express.Router();

//developer registration
developerRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingDeveloper = await DeveloperModel.findOne({ email });
    if (existingDeveloper) {
      return res
        .status(400)
        .json({ error: "Developer already exist, please login" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      const developer = new DeveloperModel({
        name,
        email,
        password: hash,
      });
      await developer.save();
      res
        .status(200)
        .json({ msg: "New developer has been added", newDeveloper: developer });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//developer login
developerRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const developer = await DeveloperModel.findOne({ email });
    if (developer) {
      bcrypt.compare(password, developer.password, (err, result) => {
        if (result) {
          let token = jwt.sign(
            { developerID: developer._id, developer: developer.name },
            "TOKEN",
            {
              expiresIn: "7d",
            }
          );
          res.json({ msg: "Developer logged in successfully.", token });
        } else {
          res.json({ msg: "Wrong credentials" });
        }
      });
    } else {
      res.json({ msg: "Developer not found" });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

//logout
developerRouter.get("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    jwt.verify(token, "TOKEN", (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token." });
      }
      res.status(200).json({ msg: "Developer has been logged out" });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = {
  developerRouter,
};
