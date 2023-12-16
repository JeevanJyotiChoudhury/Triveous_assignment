const mongoose = require("mongoose");

// const professionalExpSchema = mongoose.Schema(
//   {
//     companyName: { type: String, required: true },
//     techStack: { type: String, required: true },
//     skillsUsed: [
//       {
//         type: String,
//         enum: [
//           "HTML5",
//           "CSS3",
//           "JavaScript",
//           "ReactJs",
//           "NodeJs",
//           "ExpressJs",
//           "MongoDB",
//         ],
//         required: true,
//       },
//     ],
//     timePeriod: { type: String, required: true },
//   },
//   {
//     versionKey: false,
//   }
// );

// const eduExpSchema = mongoose.Schema(
//   {
//     degreeName: { type: String, required: true },
//     schoolName: { type: String, required: true },
//     timePeriod: { type: String, required: true },
//   },
//   {
//     versionKey: false,
//   }
// );

// const developerSchema = mongoose.Schema(
//   {
//     fname: { type: String, required: true },
//     lname: { type: String, required: true },
//     phnum: { type: String, required: true },
//     email: { type: String, required: true },
//     skills: {
//       type: String,
//       enum: [
//         "HTML5",
//         "CSS3",
//         "JavaScript",
//         "ReactJs",
//         "NodeJs",
//         "ExpressJs",
//         "MongoDB",
//       ],
//       required: true,
//     },
//     professionalExp: [professionalExpSchema],
//     education: [eduExpSchema],
//   },
//   {
//     versionKey: false,
//   }
// );

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
  "DeveloperOnborded",
  developerOnboardingSchema
);

module.exports = {
  DeveloperModel,
  DeveloperOnboardingModel,
};
