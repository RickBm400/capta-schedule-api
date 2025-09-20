import type { DateServiceInput } from "../types/dates.interfaces.ts";
import { DateBusinessLogic } from "./dates/business-logic.ts";

export function calculateDateSkips({
    date,
    hours,
    days,
    timeZone,
}: Partial<DateServiceInput>) {
    return new DateBusinessLogic({ date, timeZone }).calc({ days, hours });
}

// console.log(
//     new DateBusinessLogic({ date: "2025-09-12T17:00:00" }).calc({
//         hours: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-13T14:00:00" }).calc({
//         hours: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-16T15:00:00" }).calc({
//         hours: 4,
//         days: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-14T18:00:00" }).calc({
//         days: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-15T08:00:00" }).calc({
//         hours: 8,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-15T08:00:00" }).calc({
//         days: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-15T12:30:00" }).calc({
//         days: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-15T11:30:00" }).calc({
//         hours: 3,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-04-10T18:30:00" }).calc({
//         days: 5,
//     })
// );
