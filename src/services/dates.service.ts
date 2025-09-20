import { getHolidays } from "../external/holidays.api.ts";
import type { DateServiceInput } from "../types/dates.interfaces.ts";
import { DateBusinessLogic } from "./dates/index.ts";

export const calculateDateSkips = async ({
    date,
    hours,
    days,
    timeZone,
}: Partial<DateServiceInput>) => {
    const _holydays = await getHolidays();
    return new DateBusinessLogic({
        date,
        timeZone,
        holidays: _holydays.data,
    }).calculate({ days, hours });
};
