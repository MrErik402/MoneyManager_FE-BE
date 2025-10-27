const express = require("express");
const session = require("express-session");
const cors = require("cors");

const tablesRouter = require("./modules/tables");
const authRouter = require("./modules/auth");

const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:4200",
  credentials: true, // cookie-k engedélyezése
}));

app.use(session({
  secret: "nagyonTitkosKulcs",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60, // 1 óra
  },
}));

app.use("/auth", authRouter);
app.use("/", tablesRouter);

app.listen(3000, () => console.log("API fut: http://localhost:3000"));
