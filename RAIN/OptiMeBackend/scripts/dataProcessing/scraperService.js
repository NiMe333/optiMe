const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const URL =
  "https://en.wikipedia.org/wiki/List_of_British_actors";

const generateEmail = (fullName) => {
  return (
    fullName
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^a-z.]/g, "") + "@email.com"
  );
};

const scrapeActors = async () => {
  const response = await axios.get(URL, {
    timeout: 10000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });

  const html = response.data;

  const $ = cheerio.load(html);

  const actors = [];

$("#mw-content-text .div-col li a").each(
  (index, element) => {
    const fullName = $(element).text().trim();

    // ignore empty
    if (!fullName) return;

    // must contain at least 2 words
    if (fullName.split(" ").length < 2) return;

    // ignore wikipedia garbage
    const bannedWords = [
      "portal",
      "wikipedia",
      "category",
      "list of",
      "film",
      "television",
      "cinema",
      "award",
      "academy",
      "united kingdom",
      "south africa",
      "lists of british people",
      "lists of actors"
    ];

    const lowerName = fullName.toLowerCase();

    const containsBannedWord = bannedWords.some(
      (word) => lowerName.includes(word)
    );

    if (containsBannedWord) return;

    // generate email
    const email = generateEmail(fullName);

    actors.push({
      name: lowerName,
      email,
    });
  }
);

  // remove duplicates
  const uniqueActors = Array.from(
    new Map(
      actors.map((actor) => [actor.email, actor])
    ).values()
  );

  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }

  fs.writeFileSync(
    "./data/actors.json",
    JSON.stringify(uniqueActors, null, 2)
  );

  fs.writeFileSync(
    "./data/actors.txt",
    uniqueActors
      .map(
        (actor) =>
          `Name: ${actor.name} | Email: ${actor.email}`
      )
      .join("\n")
  );

  return uniqueActors;
};

module.exports = {
  scrapeActors,
};