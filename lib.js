const axios = require("axios");
const check = require("check-broken-links");

const SERVER = process.env.SERVER || "https://fx-breach-alerts.herokuapp.com";
const LOGO_BASE_URL = new URL("/img/logos", SERVER).href;

module.exports = {
  LOGO_BASE_URL,
  checkMissingLogos
};

async function checkMissingLogos(baseUrl = LOGO_BASE_URL) {
  const breaches = await getBreaches(50);
  const logos = breaches.map(breach => `${baseUrl}/${breach.LogoPath}`);
  const broken = await check(baseUrl, logos);
  const res = broken.top.map(link => {
    link.details = link.url.replace("/img/logos/", "/breach-details/").replace(/\.png$/, "");
    return link;
  });

  return sortByString(res, "url");
}

async function getBreaches(limit = 50) {
  const breachesUrl = new URL("/hibp/breaches", SERVER).href;
  const res = await axios.get(breachesUrl);
  const sortedBreaches = sortByDate(res.data, "AddedDate");

  return sortedBreaches.slice(0, limit);
}

function sortByString(arr, key = "url") {
  return arr.sort((resultA, resultB) => {
    const valueA = resultA[key].toLowerCase();
    const valueB = resultB[key].toLowerCase();

    if (valueA > valueB) {
      return 1;
    }
    if (valueA < valueB) {
      return -1;
    }
    return 0;
  });
}

function sortByDate(arr, key = "AddedDate") {
  return arr.sort((breachA, breachB) => {
    const dateA = new Date(breachA[key]);
    const dateB = new Date(breachB[key]);

    if (dateA > dateB) {
      return -1;
    }
    if (dateA < dateB) {
      return 1;
    }
    return 0;
  });
}
