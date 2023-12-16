const express = require("express");
const { SkillModel } = require("../models/skill.model");

const skillRouter = express.Router();

skillRouter.post("/add", async (req, res) => {
  const { name } = req.body;
  try {
    const existingSkill = await SkillModel.findOne({ name });
    if (existingSkill) {
      return res.status(400).json({ message: "Skill already exists." });
    }

    const skill = new SkillModel({ name });
    const savedSkill = await skill.save();

    res.json({ skill: savedSkill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

skillRouter.get("/", async (req, res) => {
  try {
    const skills = await SkillModel.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  skillRouter,
};
