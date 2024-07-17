import dayjs from "dayjs";

export function formatMyDate(date, format = "DD, MMM-YYYY, hh-mma") {
    return dayjs(date).format(format);
   }
   