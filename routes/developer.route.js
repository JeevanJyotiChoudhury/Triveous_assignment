const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  DeveloperModel,
  DeveloperOnboardingModel,
} = require("../models/developer.model");
const { SkillModel } = require("../models/skill.model");
const { auth } = require("../middleware/auth.middleware");

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

developerRouter.use(auth);
//onboarding
developerRouter.post("/developer/onboarding",auth, async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    skills,
    education,
    professionalExperience,
  } = req.body;

  try {
    const validSkills = await SkillModel.find({ _id: { $in: skills } });
    if (validSkills.length !== skills.length) {
      return res.status(400).json({ message: "Invalid skills provided." });
    }

    const developer = new DeveloperOnboardingModel({
      firstName,
      lastName,
      phoneNumber,
      email,
      skills,
      education,
      professionalExperience,
    });

    const savedDeveloper = await developer.save();
    res.json({ developer: savedDeveloper });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//logout
developerRouter.get("/logout", (req, res) => {
  try {
    res.status(200).json({ msg: "Developer has been logged out" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = {
  developerRouter,
};
