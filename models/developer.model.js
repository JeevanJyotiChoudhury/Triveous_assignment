const mongoose = require("mongoose");
const developerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const developerOnboardingSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }], 
    professionalExperiences: [
      {
        companyName: { type: String, required: true },
        techStack: { type: String, required: true },
        skillsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
        timePeriod: { type: String, required: true },
      },
    ],
    educationalExperiences: [
      {
        degreeName: { type: String, required: true },
        schoolName: { type: String, required: true },
        timePeriod: { type: String, required: true },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const DeveloperModel = mongoose.model("Developer", developerSchema);

const DeveloperOnboardingModel = mongoose.model(
  "DeveloperOnboarded",
  developerOnboardingSchema
);

module.exports = {
  DeveloperModel,
  DeveloperOnboardingModel,
};
