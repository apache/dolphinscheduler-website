import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const formatDate = (date, locale) => {
  const len = date?.split(":").length;
  let format = locale !== "zh-cn" ? "MMM DD YYYY" : "YYYY-MM-DD";
  if (len === 2) format += "HH:mm";
  if (len === 3) format += "HH:mm:ss";
  return dayjs(date).isValid() ? dayjs.utc(date).local().format(format) : date;
};

export const isAfter = (date) => {
  return dayjs(date).isValid()
    ? dayjs.utc(date).local().isAfter(dayjs())
    : false;
};
