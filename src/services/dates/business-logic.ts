import type { Moment } from "moment-timezone";
import { DateValidations } from "./validations.ts";
import moment from "moment-timezone";
import type { DateServiceInput } from "../../types/dates.interfaces.ts";
import { holyDayArray } from "../../utils/holidays.utils.ts";
import { DatesCalculatorUtils } from "./calculator.ts";

export class DateBusinessLogic {
    protected currentHours: number = 0;
    protected currentMinutes: number = 0;
    protected currentSeconds: number = 0;
    protected currentDayOfWeek: number = 0;
    protected currentDate: Moment;
    protected fullTimeInSeconds: number = 0;

    protected firstLoop: Boolean = true;
    protected totalDaysToProcess: number = 0;
    protected totalHoursToProcess: number = 0;

    // Calculator and Validations utilities class
    protected utils: DatesCalculatorUtils = new DatesCalculatorUtils();
    protected validations: DateValidations = new DateValidations(this.utils);

    constructor({
        date,
        timeZone = "America/Bogota",
    }: {
        date: string;
        timeZone?: string;
    }) {
        this.currentDate = moment(date).tz(timeZone);
        this.setCurrentData();
        this.setFullTimeInSeconds();
    }

    protected setFullTimeInSeconds() {
        const timeFormatted = this.utils.format(this.currentDate, "HH:mm:ss");
        this.fullTimeInSeconds = this.utils.timeToSeconds(timeFormatted);
        return this;
    }

    protected setCurrentData() {
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

    protected skipWeekend(): void {
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

    protected skipLunchHour(): void {
        this.utils.setToDate(this.currentDate, { minute: 0, second: 0 });
        this.firstLoop = false;
    }

    protected skipToNextDay(): void {
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

    protected processDay(holyDays: string[]) {
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

    protected processHour() {
        this.utils.addToDate(this.currentDate, 1, "hours");
        if (this.currentHours != 12) this.totalHoursToProcess--; // Skip to next hour if not lunch hour,
    }

    /**
     * While loop for calc iterations
     * @param param0
     * @returns
     */
    public calc({ hours, days }: DateServiceInput) {
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
