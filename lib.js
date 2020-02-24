const axios = require("axios");
const check = require("check-broken-links");

const SERVERS = {
  "cdn": "https://monitor.cdn.mozilla.net",
  "dev": "https://fx-breach-alerts.herokuapp.com",
  "prod": "https://monitor.firefox.com"
};

const argv = process.argv.slice(2);
const hasArg = arg => argv.includes(arg);
let serverUrl = process.env.SERVER || SERVERS.dev;
let logoUrl = serverUrl;
if (hasArg("-p")) {
  serverUrl = SERVERS.prod;
  logoUrl = serverUrl;
}
if (hasArg("-c") || hasArg("-cdn")) {
  serverUrl = SERVERS.prod;
  logoUrl = SERVERS.cdn;
}

const LOGO_PATH = "/img/logos/";
const LOGO_BASE_URL = new URL(LOGO_PATH, logoUrl).href;

module.exports = {
  LOGO_BASE_URL,
  checkMissingLogos
};

async function checkMissingLogos(baseUrl = serverUrl, limit = process.env.LIMIT) {
  const breaches = await getBreaches(limit);
  const logos = breaches.map(breach => new URL(`${LOGO_PATH}${breach.LogoPath}`, logoUrl).href);

  const broken = await check(baseUrl, logos);
  const res = broken.top.map(link => {
    return {
      logo: link.url,
      details: link.url.replace(LOGO_PATH, "/breach-details/").replace(/\.png$/, ""),
      status: link.err
    };
  });

  return sortByString(res, "logo");
}

async function getBreaches(limit = 50) {
  const breachesUrl = new URL("/hibp/breaches", serverUrl).href;
  console.log("API:", breachesUrl);
  console.log("CDN:", logoUrl);
  const res = await axios.get(breachesUrl);
  const sortedBreaches = sortByDate(res.data, "AddedDate");

  return sortedBreaches.slice(0, limit);
}

function sortByString(arr, key) {
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
