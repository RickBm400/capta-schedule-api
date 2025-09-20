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
    protected firstRound: Boolean = true;
    protected totalDaysToProcess: number = 0;
    protected totalHoursToProcess: number = 0;
    protected currentDayOfWeek: number = 0;
    protected fullTimeInSeconds: number = 0;
    protected currentDate: Moment;
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
        const daysToSkips = this.firstRound
            ? 5 - this.currentDayOfWeek
            : 8 - this.currentDayOfWeek;
        const hoursToSkip = this.firstRound ? 17 : 8;
        this.utils.addToDate(this.currentDate, daysToSkips, "days");
        this.utils.setToDate(this.currentDate, {
            hour: hoursToSkip,
            minute: 0,
            second: 0,
        });
        this.firstRound = false;
    }

    protected skipLunchHour(): void {
        this.utils.setToDate(this.currentDate, { minute: 0, second: 0 });
        this.firstRound = false;
    }

    protected skipToNextDay(): void {
        const { setToDate, addToDate, BUSINESS_HOURS } = this.utils;
        const resetHour =
            this.firstRound && this.fullTimeInSeconds > BUSINESS_HOURS.mdNight
                ? 17
                : 8;

        setToDate(this.currentDate, { hour: resetHour });
        if (this.firstRound) {
            setToDate(this.currentDate, { minute: 0, second: 0 });
        }
        if (this.fullTimeInSeconds == BUSINESS_HOURS.checkout) {
            addToDate(this.currentDate, 1, "days");
        }
        this.firstRound = false;
    }

    protected processDay(holyDays: string[]) {
        let daysToAdd = 1;
        if (this.validations.isWeekendDay(this.currentDayOfWeek, 1)) {
            daysToAdd = 8 - this.currentDayOfWeek;
        }

        this.utils.addToDate(this.currentDate, daysToAdd, "days");

        if (
            !holyDays.includes(this.utils.format(this.currentDate, "YYYY-MM-D"))
        ) {
            this.totalDaysToProcess--;
        }

        this.firstRound = false;
    }

    protected processHour() {
        this.utils.addToDate(this.currentDate, 1, "hours");
        if (this.currentHours != 12) this.totalHoursToProcess--;
    }

    public calculateDate({ hours, days }: DateServiceInput) {
        this.totalDaysToProcess = days || 0;
        this.totalHoursToProcess = hours || 0;
        const holyDays = holyDayArray;

        while (this.totalHoursToProcess > 0 || this.totalDaysToProcess > 0) {
            this.setCurrentData();
            this.setFullTimeInSeconds();

            if (this.validations.isWeekendDay(this.currentDayOfWeek)) {
                this.skipWeekend();
                continue;
            }

            if (
                this.validations.isMidDay(this.fullTimeInSeconds) &&
                this.firstRound
            ) {
                this.skipLunchHour();
                continue;
            }

            if (
                this.validations.isLeavingHour(this.fullTimeInSeconds) &&
                this.totalDaysToProcess <= 0
            ) {
                this.skipToNextDay();
                continue;
            }

            if (this.totalDaysToProcess > 0) {
                this.processDay(holyDays);
                continue;
            }

            if (this.totalHoursToProcess > 0) {
                this.processHour();
            }

            this.firstRound = false;
        }

        return this.currentDate.format();
    }
}
