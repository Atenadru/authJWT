require("dotenv").config();
const config = require("../config");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let tokensStorage = [];

/* 
  ? /login cuando se golpea la ruta responde con un token y un refresh_token
*/

app.post("/login", (req, res) => {
  const username = req.body.username;
  console.log(`login username: ${username}`);
  //variable genrada con el valor req.body.username
  const user = { name: username };

  //? los dos token se genran con el mismo usuario
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, config.REFRESH_TOKEN_ACCESS);

  //se almacena refresh_token para luego verificar
  tokensStorage.push(refreshToken);

  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

//!cerrar seccion
app.delete("/logout", (req, res) => {
  tokensStorage = tokensStorage.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

/**
 * ?obtenemos el token a comprobar
 * ? compravamos si el token realmente existe o es null
 * ? compravamos si el token esta incluido en nuestra DB
 * */
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === null) return res.sendStatus(401);
  if (!tokensStorage.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, config.REFRESH_TOKEN_ACCESS, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    // console.log("Token Reresh Name:" + user.name);
    res.json({ accessToken: accessToken });
  });
});

//genera un token
function generateAccessToken(user) {
  return jwt.sign(user, config.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

app.listen(config.AUTH_PORT, () => {
  console.log(`Listen in http://localhost:${config.AUTH_PORT}`);
});
