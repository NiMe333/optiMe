const User = require("../models/userModel");

const {
  scrapeActors,
} = require("../scripts/dataProcessing/scraperService");

const scrapeData = async (req, res) => {
  try {
    console.log("Starting actor scrape...");

    // 1. SCRAPE
    const results = await scrapeActors();

    console.log("Scrape successful!");

    // 2. REMOVE DUPLICATES FROM DATABASE
    const existingUsers = await User.find({
      email: {
        $in: results.map((user) => user.email),
      },
    });

    const existingEmails = existingUsers.map(
      (user) => user.email
    );

    const newUsers = results.filter(
      (user) => !existingEmails.includes(user.email)
    );

    console.log(
      `New users to insert: ${newUsers.length}`
    );

    // 3. SAVE TO MONGODB
    const savedUsers = [];

    for (const userData of newUsers) {
      const user = new User(userData);

      await user.save();

      savedUsers.push(user);
    }

    console.log("Users saved to MongoDB!");

    return res.status(200).json({
      success: true,
      totalScraped: results.length,
      insertedUsers: savedUsers.length,
      preview: savedUsers.slice(0, 10),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Scraping failed",
      error: error.message,
    });
  }
};

module.exports = {
  scrapeData,
};