import { getCookies } from "chrome-cookies-secure";
import * as logger from "./logger.js";
const grabCookiesFromChrome = async function (url) {
  logger.info("Grabbing all cookies");
  await getCookies(
    url,
    (err, cookies) => {
      if (err) {
        logger.error(
          "Error getting cookies. This is probably because you are not logged in to the admin panel or you are not using the 'default' profile in Chrome"
        );
        logger.error(
          "You may need to login to the admin panel in Chrome first and try again or manually copy the cookies from the Chrome dev tools to the ./saved_data/cookies.txt file."
        );
        logger.error("Exiting");
        browser.close();
        process.exit(1);
      }
      logger.success("Grabbed all cookies from Chrome profile 'default'");
      setCookies(cookies);
    },
    "Default"
  );
};
const setCookies = async function (cookies) {
  logger.info("Checking cookies for previous admin login");
  if (cookies.hasOwnProperty("SND-AS2-SESSION")) {
    return true;
  } else {
    logger.error("No admin login cookie found");
    logger.error("Exiting");
    browser.close();
    process.exit(1);
  }
};
export { grabCookiesFromChrome, setCookies };
