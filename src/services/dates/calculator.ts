import { type Moment } from "moment-timezone";
import {
    DatesCalculationImpl,
    type WorkingHoursInSeconds,
} from "../../types/dates.interfaces.ts";

export class DateUtils implements DatesCalculationImpl<Moment> {
    public readonly WEEKEND_DAYS: number[] = [6, 7] as const; // Saturday and sunday as days in week

    /**
     * Convert time string (HH:mm:ss) to seconds
     * @param time
     * @returns
     */
    public timeToSeconds(time: string): number {
        const [hours = 0, minutes = 0, seconds = 0]: number[] = time
            .split(":")
            .map(Number);
        return hours * 3600 + minutes * 60 + seconds;
    }

    /**
     * Set Time to moment date
     *
     * @param {Moment} date date to modify
     * @param {{ hour?: number; minute?: number; second?: number }} params
     * @returns {Moment}
     */
    public setToDate = (
        date: Moment,
        params: { hour?: number; minute?: number; second?: number }
    ): Moment => date.set(params);

    /**
     * Adds hours, days or minutes to a Moment date object
     *
     * @param {Moment} date
     * @param {number} [amount=0]
     * @param {("hours" | "days" | "minutes")} [unit="days"]
     * @returns {Moment}
     */
    public addToDate = (
        date: Moment,
        amount: number = 0,
        unit: "hours" | "days" | "minutes" = "days"
    ): Moment => date.add(amount, unit);

    /**
     * Formats a Moment date object
     *
     * @param {Moment} date
     * @param {string} format
     * @returns {*}
     */
    public format = (date: Moment, format: string): any => {
        return date.format(format);
    };

    /**
     * Convert local date to utc
     * @param date
     * @returns
     */
    public getUTC = (date: Moment): Moment => {
        return date.utc();
    };

    /**
     * Business Hours in seconds
     *
     * @type {WorkingHoursInSeconds}
     */
    BUSINESS_HOURS: WorkingHoursInSeconds = {
        startLunch: this.timeToSeconds("12:00:00"),
        endLunch: this.timeToSeconds("13:00:00"),
        checkout: this.timeToSeconds("17:00:00"),
        checkin: this.timeToSeconds("08:00:00"),
        mdNight: this.timeToSeconds("23:59:59"),
    } as const;
}
