import puppeteer from "puppeteer";
import config from "../config.js";
import { getCookies } from "chrome-cookies-secure";
import fs from "fs";
const {
  successMessage,
  infoMessage,
  warnMessage,
  browserMessage,
  errorMessage,
} = config;
infoMessage("Opening browser");
const path = `${process.env.HOME}/Library/Application Support/Google/Chrome`;
const browser = await puppeteer.launch({
  headless: false,
  defaultViewport: null,
  timeout: 0,

  args: ["--start-maximized"],
  ignoreDefaultArgs: ["--disable-extensions"],
});
successMessage("Browser opened");

const setCookies = async (cookies) => {
  infoMessage("Checking cookies for previous admin login");
  if (cookies.hasOwnProperty("SND-AS2-SESSION")) {
    successMessage("Found previous admin login");
    infoMessage("Copying cookies to browser");
    const page = await browser.newPage();
    await page.goto("https://www.ashlandauction.com/admin/login");
    const cookie = {
      name: "SND-AS2-SESSION",
      value: cookies["SND-AS2-SESSION"],
      url: "https://www.ashlandauction.com",
      path: "/",
      expires: new Date().setDate(new Date().getDate() + 365),
      httpOnly: false,
      secure: false,
      session: false,
    };
    await page.setCookie(cookie);
    successMessage("Cookies copied to browser");
    successMessage("Upgraded cookie to never expire.");

    //to do: move this to it's own function so it can be called with cookies loaded from file
    infoMessage("Attempting to login as admin...");
    await page.goto("https://www.ashlandauction.com/admin/login");
    await page.waitForSelector(".logout-btn");
    successMessage("Success! Logged in as admin");
    infoMessage("Saving cookie to hard drive as permanent admin login");
    //save the output of page.getCookie() to a file on the hard drive
    //so that the cookie can be used in the future without having to login
    //as admin
    const cookieData = await page.cookies();
    fs.writeFile(
      "./saved_data/cookies.json",
      JSON.stringify(cookieData),
      "utf8",
      async (err) => {
        if (err) {
          errorMessage(err);
        }
        successMessage("Cookie saved to hard drive");
        await page.close();
      }
    );
  } else {
    warnMessage("No previous admin login found");
    warnMessage("Please login as admin and try again");
    errorMessage("Exiting");
    browser.close();
    process.exit(1);
  }
};

const fetchCookies = async (url) => {
  infoMessage("Grabbing all cookies");
  await getCookies(
    url,
    (err, cookies) => {
      if (err) {
        errorMessage("Error getting cookies");
        errorMessage("Exiting");
        browser.close();
        process.exit(1);
      }
      successMessage("Found cookies");
      setCookies(cookies);
    },
    "Default"
  );
};

const visitPage = async ({ url, waitOn } = { waitOn: undefined }) => {
  await fetchCookies(url);
  const page = await browser.newPage();
  successMessage(`Tab opened`);
  infoMessage("Exposing log functions to page");
  await page.exposeFunction("successMessage", successMessage);
  await page.exposeFunction("infoMessage", infoMessage);
  await page.exposeFunction("warnMessage", warnMessage);
  await page.exposeFunction("browserMessage", browserMessage);
  successMessage("Page loaded log functions");
  infoMessage("Enabling browser console output");
  page.on("console", (msg) => browserMessage(msg.text()));
  infoMessage(`Visiting page: ${url}`);
  await page.goto(`${url}`);
  if (waitOn !== undefined) {
    infoMessage(`...... waiting for "${waitOn}" elements to load`);
    await page.waitForSelector(waitOn);
    successMessage(`Success! "${waitOn}" elements are loaded and visible`);
  }
  successMessage("Success ! page fully loaded");

  return page;
};

const retrieveData = async (page) => {
  infoMessage("Iterating over calendar dates");
  const auctionsByDate = await page.$$eval(".calendar-date", (nodes) => {
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

  successMessage("Successfully retrieved all auctions by date");
  return await auctionsByDate;
};

const filterAuctionsByDays = (auctions) => {
  infoMessage("Filtering auctions by days");
  return auctions.filter((auction) =>
    config.arrayOfDays.includes(auction.date)
  );
};

const helpers = {
  visitPage,
  retrieveData,
  filterAuctionsByDays,
};
export default helpers;
