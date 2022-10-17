import dayjs from "dayjs";
const configList = {
  calendarURL:
    "https://www.ashlandauction.com/auctions?page=1&pageSize=120&search=&sort=null&currentDisplay=calendar&websiteDisplay%5B0%5D=tile&websiteDisplay%5B1%5D=map&websiteDisplay%5B2%5D=calendar&canToggle=true",
  daysToScrape: 3,
  showBrowserOutput: true,
};

const get = (key) => {
  return configList[key];
};
const set = (key, value) => {
  configList[key] = value;
};
const setDaysToScrape = (days) => {
  configList.daysToScrape = days;
};
const getArrayOfDays = () => {
  return Array.from({ length: configList.daysToScrape + 1 }, (_, i) =>
    dayjs().add(i, "day").format("ddd, MMMM DD")
  );
};
const config = Object.freeze({
  get,
  set,
  setDaysToScrape,
  getArrayOfDays,
});
export default config;
