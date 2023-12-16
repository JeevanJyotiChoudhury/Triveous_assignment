const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ClientModel } = require("../models/client.model");

const clientRouter = express.Router();

//client registration
clientRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingClient = await ClientModel.findOne({ email });
    if (existingClient) {
      return res
        .status(400)
        .json({ error: "Client already exist, please login" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      const client = new ClientModel({
        name,
        email,
        password: hash,
      });
      await client.save();
      res
        .status(200)
        .json({ msg: "New client has been added", newClient: client });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//client login
clientRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const client = await ClientModel.findOne({ email });
    if (client) {
      bcrypt.compare(password, client.password, (err, result) => {
        if (result) {
          let token = jwt.sign(
            { clientID: client._id, client: client.name },
            "TOKEN",
            {
              expiresIn: "7d",
            }
          );
          res.json({ msg: "Client logged in successfully.", token });
        } else {
          res.json({ msg: "Wrong credentials" });
        }
      });
    } else {
      res.json({ msg: "Client not found" });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

//logout
clientRouter.get("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    jwt.verify(token, "TOKEN", (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Invalid token." });
      }
      res.status(200).json({ msg: "Client has been logged out" });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = {
  clientRouter,
};
