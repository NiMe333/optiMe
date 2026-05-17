const express = require("express");

const router = express.Router();

const {
  scrapeData,
} = require("../controllers/scrapeController");

router.get("/scrape", scrapeData);

module.exports = router;