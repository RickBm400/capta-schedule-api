import type { Moment } from "moment-timezone";
import { DateValidations } from "./validations.ts";
import moment from "moment-timezone";
import type {
    DateBusinessLogicInput,
    DateServiceInput,
    IDateCalc,
} from "../../types/dates.interfaces.ts";
import { holyDayArray } from "../../utils/holidays.utils.ts";
import { DatesCalculatorUtils } from "./calculator.ts";

export class DateBusinessLogic {
    private currentHours: number = 0;
    private currentMinutes: number = 0;
    private currentSeconds: number = 0;
    private currentDayOfWeek: number = 0;
    private currentDate: Moment;
    private fullTimeInSeconds: number = 0;

    private firstLoop: Boolean = true;
    private totalDaysToProcess: number = 0;
    private totalHoursToProcess: number = 0;

    // Calculator and Validations utilities class
    private utils: DatesCalculatorUtils = new DatesCalculatorUtils();
    private validations: DateValidations = new DateValidations(this.utils);

    constructor({ date, timeZone = "America/Bogota" }: DateBusinessLogicInput) {
        this.currentDate = moment(date).tz(timeZone);
        this.setCurrentData();
        this.setFullTimeInSeconds();
    }

    private setFullTimeInSeconds(): DateBusinessLogic {
        const timeFormatted = this.utils.format(this.currentDate, "HH:mm:ss");
        this.fullTimeInSeconds = this.utils.timeToSeconds(timeFormatted);
        return this;
    }

    private setCurrentData(): DateBusinessLogic {
        const [day, hour, minute, second]: number[] = this.utils
            .format(this.currentDate, "E:HH:mm:ss")
            .split(":")
            .map(Number);

        this.currentDayOfWeek = day!;
        this.currentHours = hour!;
        this.currentMinutes = minute!;
        this.currentSeconds = second!;
        return this;
    }

    private skipWeekend(): void {
        const daysToSkips = this.firstLoop
            ? 5 - this.currentDayOfWeek
            : 8 - this.currentDayOfWeek; // if first loop is true, skip back, else skip forwar to next workind date

        const hoursToSkip = this.firstLoop ? 17 : 8;

        this.utils.addToDate(this.currentDate, daysToSkips, "days");
        this.utils.setToDate(this.currentDate, {
            hour: hoursToSkip,
            minute: 0,
            second: 0,
        });

        this.firstLoop = false;
    }

    private skipLunchHour(): void {
        this.utils.setToDate(this.currentDate, { minute: 0, second: 0 });
        this.firstLoop = false;
    }

    private skipToNextDay(): void {
        const { setToDate, addToDate, BUSINESS_HOURS } = this.utils;
        const resetHour =
            this.firstLoop && this.fullTimeInSeconds > BUSINESS_HOURS.mdNight
                ? 17
                : 8;

        setToDate(this.currentDate, { hour: resetHour });
        if (this.firstLoop) {
            setToDate(this.currentDate, { minute: 0, second: 0 });
        }
        if (this.fullTimeInSeconds == BUSINESS_HOURS.checkout) {
            addToDate(this.currentDate, 1, "days");
        }
        this.firstLoop = false;
    }

    private processDay(holyDays: string[]): void {
        let daysToAdd = 1;
        if (this.validations.isWeekendDay(this.currentDayOfWeek, 1)) {
            // Calculates next working days
            daysToAdd = 8 - this.currentDayOfWeek;
        }

        this.utils.addToDate(this.currentDate, daysToAdd, "days");

        // keeps days counter when not a holy day
        if (
            !holyDays.includes(this.utils.format(this.currentDate, "YYYY-MM-D"))
        ) {
            this.totalDaysToProcess--;
        }

        this.firstLoop = false;
    }

    private processHour() {
        this.utils.addToDate(this.currentDate, 1, "hours");
        if (this.currentHours != 12) this.totalHoursToProcess--; // Skip to next hour if not lunch hour,
    }

    /**
     * Calculates the date based on the input parameters
     * @param param0
     * @returns
     */
    public calc({ hours, days }: IDateCalc) {
        this.totalDaysToProcess = days || 0;
        this.totalHoursToProcess = hours || 0;
        const holyDays = holyDayArray;

        while (this.totalHoursToProcess > 0 || this.totalDaysToProcess > 0) {
            this.setCurrentData();
            this.setFullTimeInSeconds();

            if (this.validations.isWeekendDay(this.currentDayOfWeek)) {
                this.skipWeekend(); // Skips back and forward weekend days
                continue;
            }

            if (
                this.validations.isMidDay(this.fullTimeInSeconds) &&
                this.firstLoop
            ) {
                this.skipLunchHour(); // Reset date minutes and seconds if request is made between lunch hour
                continue;
            }

            if (
                this.validations.isLeavingHour(this.fullTimeInSeconds) &&
                this.totalDaysToProcess <= 0
            ) {
                this.skipToNextDay(); // Skips back and forward leaving hours
                continue;
            }

            if (this.totalDaysToProcess > 0) {
                this.processDay(holyDays);
                continue;
            }

            if (this.totalHoursToProcess > 0) {
                this.processHour();
            }

            this.firstLoop = false;
        }

        return this.currentDate.format();
    }
}
