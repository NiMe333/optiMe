const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "sesVer2026",
    resave: false,
    saveUninitialized: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/user", require("./routes/userRoutes")); //sends to userRoutes if /user

module.exports = app;
