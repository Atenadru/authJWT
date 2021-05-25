require("dotenv").config();
const config = require("../config");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
let tokensStorage = [];

app.delete("/logout", (req, res) => {
  tokensStorage = tokensStorage.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, config.REFRESH_TOKEN_ACCESS);
  tokensStorage.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

app.post("/token", (req, res) => {
  /**
   * ?obtenemos el token a comprobar
   * ? compravamos si el token realmente existe o es null
   * ? compravamos si el token esta incluido en nuestra DB
   * */
  const refreshToken = req.body.token;
  if (refreshToken === null) return res.sendStatus(401);
  if (!tokensStorage.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, config.REFRESH_TOKEN_ACCESS, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    console.log("Token Reresh Name:" + user.name);
    res.json({ accessToken: accessToken });
  });
});

function generateAccessToken(user) {
  return jwt.sign(user, config.ACCESS_TOKEN_SECRET, { expiresIn: "25s" });
}

app.listen(config.AUTH_PORT, () => {
  console.log(`Listen in http://localhost:${config.AUTH_PORT}`);
});
