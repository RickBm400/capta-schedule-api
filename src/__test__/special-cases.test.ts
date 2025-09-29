import { DateBusinessLogic } from "../services/dates";
import { holyDayArray } from "../utils/holidays.utils";

describe("date-special-cases", () => {
    const specialDateTest = [
        {
            calcInput: { hours: 8 },
            date: "2025-12-31T15:00:00.000Z",
            holidays: holyDayArray,
            expected: "2026-01-02T15:00:00Z",
        },
        {
            calcInput: { days: 1 },
            date: "2025-04-16T21:00:00.000Z",
            holidays: holyDayArray,
            expected: "2025-04-21T21:00:00Z",
        },
        {
            calcInput: { days: 1 },
            date: "2025-04-18T21:00:00.000Z",
            holidays: holyDayArray,
            expected: "2025-04-21T22:00:00Z",
        },
        {
            calcInput: { days: 1, hours: 4 },
            date: "2025-10-11T21:00:00.000Z",
            holidays: holyDayArray,
            expected: "2025-10-15T17:00:00Z",
        },
        {
            calcInput: { days: 5 },
            date: "2025-06-20T21:00:00.000Z",
            holidays: holyDayArray,
            expected: "2025-07-01T21:00:00Z",
        },
        {
            calcInput: { days: 14 },
            date: "2026-06-05T21:00:00.000Z",
            holidays: holyDayArray,
            expected: "2026-06-30T21:00:00Z",
        },
        {
            calcInput: { days: 1 },
            date: "2025-09-25T09:00:00.000Z", // after midnight usecase
            holidays: holyDayArray,
            expected: "2025-09-25T22:00:00Z",
        },
    ];

    for (const { expected, calcInput, date, holidays } of specialDateTest) {
        it(`should return ${expected} when ${JSON.stringify(
            calcInput
        )} is passed`, () => {
            const result = new DateBusinessLogic({
                date: date,
                holidays: holidays,
            }).calculate(calcInput);

            expect(result).toBe(expected);
        });
    }
});
