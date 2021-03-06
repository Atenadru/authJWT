require("dotenv").config();
const config = require("../config");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "yorman",
    title: "Post 1",
  },
  {
    username: "jim",
    title: "Post 2",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name));
});

//un middlelware para validar si un token es valido
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);

  jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err.message);
      return res.sendStatus(403);
    }
    //si no hay error devuelvo al usuario el el request
    req.user = user;
    console.log(user);
    next();
  });
}

app.listen(config.PORT, () => {
  console.log(`Listen in http://localhost:${config.PORT}`);
});
