const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:8081", //allows frontend to use cookies with backend
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api", require("./routes/scrapeRoutes")); //sends to userRoutes if /user
app.use("/user", require("./routes/userRoutes"));
app.use("/token", require("./routes/tokenRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/data", require("./routes/dataRoutes"));

module.exports = app;
