const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connection } = require("./db");
const { clientRouter } = require("./routes/client.route");
const { developerRouter } = require("./routes/developer.route");
const { skillRouter } = require("./routes/skill.route");

const app = express();
app.use(express.json());

const corsRes = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsRes));

app.use("/skills", skillRouter);
app.use("/clients", clientRouter);
app.use("/developer", developerRouter);

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Server running at port 8080");
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    console.log("Error in connecting to the database");
  }
});
