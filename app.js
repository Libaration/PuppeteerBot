import config from "./config/config.js";
import Browser from "./lib/browser.js";
import * as logger from "./lib/logger.js";
const run = async () => {
  const browser = Browser();
  await browser.launch();
  const tab = await browser.newTab();
  await tab.visit({ url: config.get("calendarURL"), waitOn: ".calendar-date" });
  logger.info("Iterating over calendar dates");
  const auctionsByDate = await tab.page.$$eval(".calendar-date", (nodes) => {
    return nodes.map((node) => {
      const calendarDate = node.querySelector(".header").innerText;
      const calenderAuctions = Array.from(
        node.querySelectorAll(".calendar-event a")
      ).map((a) => a.href);
      infoMessage(`Retrieving auctions for date: ${calendarDate}`);
      calenderAuctions.length <= 0
        ? warnMessage(`No auctions found for this date`)
        : successMessage(`Success. Found ${calenderAuctions.length} auctions`);
      return {
        date: calendarDate,
        auctions: calenderAuctions,
      };
    });
  });
  logger.success("Found dates in config");
  logger.success(config.getArrayOfDays());
  logger.info("Filtering auctions by days");
  const auctionsByDateFiltered = await auctionsByDate.filter((auction) =>
    config.getArrayOfDays().includes(auction.date)
  );
  logger.success("Successfully filtered auctions by days in config");

  // const pageOptions = {
  //   url: config.url,
  //   waitOn: ".calendar-date",
  // };
  // const page = await visitPage(pageOptions);
  // const data = await retrieveData(page);
  // const xDaysAuctions = filterAuctionsByDays(data);
  //console.log(xDaysAuctions);
  //const auction = await visitPage({ url: xDaysAuctions[0].auctions[0] });
};

run();
