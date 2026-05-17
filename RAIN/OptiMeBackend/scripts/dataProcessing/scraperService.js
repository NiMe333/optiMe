const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

const URL =
  "https://en.wikipedia.org/wiki/List_of_British_actors";

/*
const generateEmail = (fullName) => {
  return (
    fullName
      .toLowerCase()
      .replace(/\s+/g, ".")
      .replace(/[^a-z.]/g, "") + "@email.com"
  );
};
*/
const generateEmail = (fullName) => {
  return (
    fullName
      .toLowerCase()

      // remove wikipedia brackets
      .replace(/\(.*?\)/g, "")

      // replace spaces with dots
      .replace(/\s+/g, ".")

      // remove non letters/dots
      .replace(/[^a-z.]/g, "")

      // remove duplicate dots
      .replace(/\.{2,}/g, ".")

      // remove ending dot
      .replace(/\.$/, "") +

    "@email.com"
  );
};

const generateRandomGender = () => {
  const genders = ["Male", "Female", "Other"];

  return genders[
    Math.floor(Math.random() * genders.length)
  ];
};

const generateRandomDate = () => {
  const start = new Date(1950, 0, 1);

  const end = new Date(2005, 11, 31);

  return new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime())
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

    const cleanedName = lowerName
      .replace(/\(.*?\)/g, "")
      .trim();

    actors.push({
      username: cleanedName,
      email,
      password: cleanedName,
      gender: generateRandomGender(),
      dateOfBirth: generateRandomDate(),
    });
  }
);

  // remove duplicates
  const uniqueActors = Array.from(
    new Map(
      actors.map((actor) => [actor.email, actor])
    ).values()
  );

  if (!fs.existsSync("./scripts/dataProcessing/data")) {
    fs.mkdirSync("./scripts/dataProcessing/data");
  }

  fs.writeFileSync(
    "./scripts/dataProcessing/data/actors.json",
    JSON.stringify(uniqueActors, null, 2)
  );

  fs.writeFileSync(
    "./scripts/dataProcessing/data/actors.txt",
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