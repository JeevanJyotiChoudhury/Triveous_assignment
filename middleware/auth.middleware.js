const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, "TOKEN");
      if (decoded) {
        next();
      } else {
        res.json({ msg: "Token not recognised" });
      }
    } catch (err) {
      res.json({ error: err.message });
    }
  } else {
    res.status(400).json({ msg: "Please Login" });
  }
};

module.exports = {
  auth,
};
