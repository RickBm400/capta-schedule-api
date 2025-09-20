import { DateBusinessLogic } from "./dates/business-logic.ts";

export function calculateDateSkips(params: {
    date: string;
    hours: number;
    days: number;
}) {
    return new DateBusinessLogic({ date: "2025-09-12T17:00:00" }).calc({
        hours: 1,
    });
}

// console.log(
//     new DateBusinessLogic({ date: "2025-09-12T17:00:00" }).calculateDate({
//         hours: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-13T14:00:00" }).calculateDate({
//         hours: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-16T15:00:00" }).calculateDate({
//         hours: 4,
//         days: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-14T18:00:00" }).calculateDate({
//         days: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-15T08:00:00" }).calculateDate({
//         hours: 8,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-15T08:00:00" }).calculateDate({
//         days: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-15T12:30:00" }).calculateDate({
//         days: 1,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-09-15T11:30:00" }).calculateDate({
//         hours: 3,
//     })
// );
// console.log(
//     new DateBusinessLogic({ date: "2025-04-10T15:00:00" }).calculateDate({
//         days: 5,
//     })
// );
