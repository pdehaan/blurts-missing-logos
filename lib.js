const axios = require("axios");
const check = require("check-broken-links");

const LOGO_BASE_URL = "https://monitor.firefox.com/img/logos";

module.exports = {
  LOGO_BASE_URL,
  checkMissingLogos
};

async function checkMissingLogos(baseUrl = LOGO_BASE_URL) {
  const breaches = await getBreaches(50);
  const logos = breaches.map(breach => `${baseUrl}/${breach.LogoPath}`);
  const broken = await check(baseUrl, logos);

  return sortByString(broken.top, "url");
}

async function getBreaches(limit = 50) {
  const res = await axios.get("https://monitor.firefox.com/hibp/breaches");
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
