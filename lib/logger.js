import chalk from "chalk";
const successMessage = (message) => {
  console.log(
    chalk.greenBright.bold.underline.bgBlack("[OK]") +
      chalk.reset(` ${message} `) +
      "\n"
  );
};
const errorMessage = (message) => {
  console.log(
    chalk.bgBlack.redBright.bold.underline("[FATAL]") +
      chalk.reset(` ${message} `) +
      "\n"
  );
};
const infoMessage = (message) => {
  console.log(
    chalk.green.bgBlack.magentaBright.bold.underline("[INFO]") +
      chalk.reset(` ${message} `) +
      "\n"
  );
};
const warnMessage = (message) => {
  console.log(
    chalk.bgBlack.yellowBright.bold.underline("[WARN]") +
      chalk.reset(` ${message} `) +
      "\n"
  );
};
const browserMessage = (message) => {
  console.log(
    chalk.bgBlack.gray.dim.bold.underline("[BROWSER]") +
      chalk.reset(` ${message} `)
  );
};

export {
  successMessage as success,
  errorMessage as error,
  infoMessage as info,
  warnMessage as warn,
  browserMessage as browser,
};
