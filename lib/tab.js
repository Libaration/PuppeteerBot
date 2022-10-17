import * as logger from "./logger.js";
import config from "../config/config.js";
import * as cookieExtractor from "./cookieExtractor.js";
import puppeteer from "puppeteer";
export default function Tab(page) {
  var page = page;
  var registerConsoleAndLogFunctions = async function () {
    if (config.get("showBrowserOutput")) {
      logger.info("Detected showBrowserOutput as true in config");
      logger.info("Enabling browser console output");
      await page.exposeFunction("successMessage", logger.success);
      await page.exposeFunction("infoMessage", logger.info);
      await page.exposeFunction("warnMessage", logger.warn);
      await page.exposeFunction("browserMessage", logger.browser);
      page.on("console", (msg) => logger.browser(msg.text()));
      logger.success("Browser console output enabled");
    }
  };
  var close = async function () {
    await page.close();
  };

  var visit = async function (
    { url, waitOn, cloneCookies } = { waitOn: undefined, cloneCookies: false }
  ) {
    if (cloneCookies) {
      cookieExtractor.grabCookiesFromChrome(url);
    }
    registerConsoleAndLogFunctions();
    logger.info(`Visiting page: ${url}`);
    await page.goto(url);
    if (waitOn !== undefined) {
      logger.info(`...... waiting for "${waitOn}" elements to load`);
      await page.waitForSelector(waitOn);
      logger.success(`Success. "${waitOn}" elements are loaded and visible`);
    }
    logger.success("Success. Page fully loaded");
    return page;
  };

  return {
    close: close,
    visit: visit,
    page: page,
  };
}
