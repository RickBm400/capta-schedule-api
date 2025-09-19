import moment, { Moment } from "moment-timezone";
import { holyDayArray } from "./src/utils/holidays.utils";

const weekendDayNumbers = [6, 7];

const timeToSeconds = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

const setToDate = (
    date: Moment,
    params: { hour?: number; minute?: number; second?: number }
): Moment => date.set(params);

const addToDate = (
    date: Moment,
    amount: number = 0,
    unit: "hours" | "days" | "minutes" = "days"
): Moment => date.add(amount, unit);

const formatDate = (date: Moment, format: string) => {
    return date.format(format);
};

const workingHoursInSeconds = {
    startLunchMs: timeToSeconds("12:00:00"),
    endLunchMs: timeToSeconds("13:00:00"),
    checkoutMs: timeToSeconds("17:00:00"),
    checkinMs: timeToSeconds("08:00:00"),
    midNight: timeToSeconds("23:59:59"),
};

// TESTING BLOCK
console.clear();
console.log("midnight ", workingHoursInSeconds.midNight);
console.log("checkout ", workingHoursInSeconds.checkoutMs);
console.log("checkin ", workingHoursInSeconds.checkinMs);

let testExampleCounter = 0;

function getFormattedDate(
    inputDate: Moment,
    hoursToAdd: number = 0,
    daysToAdd: number = 0
) {
    console.log("EJEMPLO NO: ", (testExampleCounter = testExampleCounter + 1));
    console.log(
        "\nOriginal Date: ",
        inputDate.format(),
        "\nHours: ",
        hoursToAdd,
        "\nDays: ",
        daysToAdd,
        "\n"
    );

    let isFirstIteration = true;
    let [
        currentDayOfWeek,
        currentHour,
        currentMinute,
        currentSecond,
    ]: number[] = formatDate(inputDate, "E:HH:mm:ss").split(":").map(Number);

    let totalDaysToProcess: number = daysToAdd;
    let totalHoursToProcess: number = hoursToAdd;

    while (totalHoursToProcess > 0 || totalDaysToProcess > 0) {
        // console.log("\ncounterD: ", totalDaysToProcess);
        // console.log("counterH: ", totalHoursToProcess);
        [currentDayOfWeek, currentHour, currentMinute, currentSecond] =
            formatDate(inputDate, "E:HH:mm:ss").split(":").map(Number);

        const currentTimeInSeconds = timeToSeconds(
            [currentHour, currentMinute, currentSecond].join(":")
        );

        // Check Weekends
        if (weekendDayNumbers.includes(currentDayOfWeek)) {
            // Aproxima al día laboral más cercano
            let daysToSkipToWorkday = isFirstIteration
                ? 5 - currentDayOfWeek
                : 8 - currentDayOfWeek;
            addToDate(inputDate, daysToSkipToWorkday, "days");
            setToDate(inputDate, {
                hour: isFirstIteration ? 17 : 8,
                minute: 0,
                second: 0,
            });
            isFirstIteration && (isFirstIteration = false);
            // console.log("check weekend output: ", inputDate.format());
            continue;
        }

        // Check Midday Lunch
        if (
            currentTimeInSeconds > workingHoursInSeconds.startLunchMs &&
            currentTimeInSeconds < workingHoursInSeconds.endLunchMs &&
            isFirstIteration
        ) {
            setToDate(inputDate, { minute: 0, second: 0 });
            isFirstIteration = false;
            // console.log("check midday output: ", inputDate.format());
            continue;
        }

        // Check Leaving hours
        if (
            totalDaysToProcess <= 0 &&
            ((currentTimeInSeconds >= workingHoursInSeconds.checkoutMs &&
                currentTimeInSeconds <= workingHoursInSeconds.midNight) ||
                (currentTimeInSeconds > workingHoursInSeconds.midNight &&
                    currentTimeInSeconds < workingHoursInSeconds.checkinMs))
        ) {
            const resetHout =
                isFirstIteration &&
                currentTimeInSeconds > workingHoursInSeconds.checkoutMs
                    ? 17
                    : 8;
            setToDate(inputDate, {
                hour: resetHout,
            });
            isFirstIteration && setToDate(inputDate, { minute: 0, second: 0 });
            if (currentTimeInSeconds == workingHoursInSeconds.checkoutMs)
                addToDate(inputDate, 1, "days");
            isFirstIteration && (isFirstIteration = false);
            // console.log("check gte chout lte mdn output: ", inputDate.format());
            continue;
        }

        if (totalDaysToProcess > 0) {
            let daysToAdd = 1;

            if (weekendDayNumbers.includes(currentDayOfWeek + 1)) {
                daysToAdd = 8 - currentDayOfWeek;
            }
            addToDate(inputDate, daysToAdd, "days");

            !holyDayArray.includes(inputDate.format("YYYY-MM-D")) &&
                totalDaysToProcess--;

            // console.log("check days output: ", inputDate.format());
            // console.log("days left", totalDaysToProcess);
            isFirstIteration && (isFirstIteration = false);
            continue;
        }

        if (totalHoursToProcess > 0) {
            addToDate(inputDate, 1, "hours");
            currentHour != 12 && totalHoursToProcess--;
        }

        isFirstIteration && (isFirstIteration = false);
        // console.log("check default case: ", inputDate.format());
        // console.log("counter end ->", totalHoursToProcess);
    }

    console.log("\ncheck output case: ", inputDate.format());
    console.log("--------------------------------------------------\n");
}

getFormattedDate(moment("2025-09-12T17:00:00").tz("America/Bogota"), 1, 0);
getFormattedDate(moment("2025-09-13T14:00:00").tz("America/Bogota"), 1);
getFormattedDate(moment("2025-09-16T15:00:00").tz("America/Bogota"), 4, 1);
getFormattedDate(moment("2025-09-14T18:00:00").tz("America/Bogota"), 0, 1);
getFormattedDate(moment("2025-09-15T08:00:00").tz("America/Bogota"), 8);
getFormattedDate(moment("2025-09-15T08:00:00").tz("America/Bogota"), 0, 1);
getFormattedDate(moment("2025-09-15T12:30:00").tz("America/Bogota"), 0, 1);
getFormattedDate(moment("2025-09-15T11:30:00").tz("America/Bogota"), 3);
getFormattedDate(moment("2025-04-10T15:00:00").tz("America/Bogota"), 0, 5);
