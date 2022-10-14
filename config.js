import dayjs from "dayjs";
import chalk from "chalk";
import os from "os";
const log = console.log;
/* config */
const url =
  "https://www.ashlandauction.com/auctions?page=1&pageSize=120&search=&sort=null&currentDisplay=calendar&websiteDisplay%5B0%5D=tile&websiteDisplay%5B1%5D=map&websiteDisplay%5B2%5D=calendar&canToggle=true";
const daysToScrape = 3;

/* end of config */

/* don't touch these */
const successMessage = (message) =>
  log(
    chalk.greenBright.bold.underline.bgBlack("[OK]") +
      chalk.reset(` ${message} `) +
      "\n"
  );
const infoMessage = (message) =>
  log(
    chalk.green.bgBlack.magentaBright.bold.underline("[INFO]") +
      chalk.reset(` ${message} `) +
      "\n"
  );
const warnMessage = (message) =>
  log(
    chalk.bgBlack.yellowBright.bold.underline("[WARN]") +
      chalk.reset(` ${message} `) +
      "\n"
  );
const browserMessage = (message) =>
  log(
    chalk.bgBlack.gray.dim.bold.underline("[BROWSER]") +
      chalk.reset(` ${message} `)
  );
const errorMessage = (message) =>
  log(
    chalk.bgBlack.redBright.bold.underline("[FATAL]") +
      chalk.reset(` ${message} `)
  );
const arrayOfDays = Array.from({ length: daysToScrape + 1 }, (_, i) =>
  dayjs().add(i, "day").format("ddd, MMMM DD")
);

const operatingSystem = os.platform();
const isWindows = operatingSystem === "win32";
const isMac = operatingSystem === "darwin";
const chromeArgs = isMac
  ? [
      "--start-maximized, --user-data-dir=~/Library/Application Support/Google/Chrome/Default",
    ]
  : [
      "--start-maximized, --profile-directory=%userprofile%\\AppData\\Local\\Google\\Chrome\\User Data\\Default, --user-data-dir=%userprofile%\\AppData\\Local\\Google\\Chrome\\User Data\\Default",
    ];
const config = {
  url,
  daysToScrape,
  arrayOfDays,
  successMessage,
  infoMessage,
  warnMessage,
  browserMessage,
  errorMessage,
};
export default config;
/* don't touch these */
