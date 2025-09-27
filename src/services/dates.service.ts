import { getHolidays } from "../external/holidays.api";
import type { DateServiceInput } from "../types/dates.types";
import { DateBusinessLogic } from "./dates/index";

export const calculateDateSkips = async ({
    date,
    hours,
    days,
    timeZone,
}: Partial<DateServiceInput>) => {
    const holidays = (await getHolidays()).data;
    return new DateBusinessLogic({
        date,
        timeZone,
        holidays,
    }).calculate({ days, hours });
};
