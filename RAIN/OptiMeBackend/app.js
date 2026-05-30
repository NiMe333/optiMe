const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.use(cookieParser());

const allowedOriginRegex =
  /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+):(8081|19000|19001|19002)$/;

app.use(
  cors({
    origin: (origin, callback) => {
      // Dovoli requeste brez origin headerja:
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOriginRegex.test(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api", require("./routes/scrapeRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/token", require("./routes/tokenRoutes"));
app.use("/data", require("./routes/dataRoutes"));

module.exports = app;
