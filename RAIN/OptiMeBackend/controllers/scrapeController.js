const { scrapeActors } = require("../scripts/dataProcessing/scraperService");

const scrapeData = async (req, res) => {
  try {
    console.log("Starting actor scrape...");

    const results = await scrapeActors();

    res.status(200).json({
      success: true,
      totalActors: results.length,
      preview: results.slice(0, 10),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Scraping failed",
      error: error.message,
    });
  }
};

module.exports = {
  scrapeData,
};