import { DateUtils } from "./calculator.ts";

/**
 * Class for date validation logic
 */
export class DateValidations {
    protected utils: DateUtils = new DateUtils();

    /**
     * Check if the current day of the week is a weekend day.
     *
     * @public
     * @param {number} currentDayOfWeek
     * @returns {Boolean}
     */
    public isWeekendDay(currentDayOfWeek: number): Boolean {
        return this.utils.WEEKEND_DAYS.includes(currentDayOfWeek);
    }

    /**
     * Check if current time is between lunch hours
     *
     * @public
     * @param {number} fullTimeInSeconds
     * @returns {Boolean}
     */
    public isMidDay(fullTimeInSeconds: number): Boolean {
        return (
            fullTimeInSeconds > this.utils.BUSINESS_HOURS.startLunch &&
            fullTimeInSeconds < this.utils.BUSINESS_HOURS.endLunch
        );
    }

    /**
     * Check if current time is between leaving hours
     *
     * @public
     * @param {number} fullTimeInSeconds
     * @returns {Boolean}
     */
    public isLeavingHour(fullTimeInSeconds: number): Boolean {
        const { checkin, checkout, mdNight } = this.utils.BUSINESS_HOURS;
        return (
            (fullTimeInSeconds > checkout && fullTimeInSeconds <= mdNight) ||
            (fullTimeInSeconds > mdNight && fullTimeInSeconds < checkin)
        );
    }
}
