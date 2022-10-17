import Tab from "./tab.js";
import puppeteer from "puppeteer";
import * as logger from "./logger.js";

export default function Browser() {
  var browser = null;
  var launch = async function () {
    logger.info("Launching Browser");
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      timeout: 0,
      args: ["--start-maximized"],
    });
    logger.success("Browser launched");
    return browser;
  };
  var close = async function () {
    logger.error("Closing browser");
    await browser.close();
  };
  var newTab = async function () {
    logger.info("Opening new tab");
    const page = await browser.newPage();
    const tab = Tab(page);
    logger.success("New tab opened");
    return tab;
  };
  return {
    launch: launch,
    close: close,
    newTab: newTab,
  };
}
