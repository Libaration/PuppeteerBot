import helpers from "./helpers/index.js";
import config from "./config.js";
const { visitPage, retrieveData, filterAuctionsByDays } = helpers;
const run = async () => {
  const pageOptions = {
    url: config.url,
    waitOn: ".calendar-date",
  };
  const page = await visitPage(pageOptions);
  const data = await retrieveData(page);
  const xDaysAuctions = filterAuctionsByDays(data);
  //console.log(xDaysAuctions);
  //const auction = await visitPage({ url: xDaysAuctions[0].auctions[0] });
};

run();
