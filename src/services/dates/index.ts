import type { Moment } from "moment-timezone";
import { DateValidations } from "./validations";
import moment from "moment-timezone";
import {
    SetToDateParams,
    TimeZonesEnum,
    type DateBusinessLogicInput,
    type IDateCalc,
} from "../../types/dates.types";
import { DateUtils } from "./utils";
import { CustomError } from "../../utils/exceptions";
import { ErrorMessages } from "../../utils/error-messages";
import { StatusCodes } from "http-status-codes";

export class DateBusinessLogic {
    private currentDate: Moment;
    private currentHours: number = 0;
    private currentMinutes: number = 0;
    private currentSeconds: number = 0;
    private currentDayOfWeek: number = 0;
    private fullTimeInSeconds: number = 0;

    private firstLoop: Boolean = true;
    private totalDaysToProcess: number = 0;
    private totalHoursToProcess: number = 0;

    // Calculator and Validations utilities class
    private utils: DateUtils = new DateUtils();
    private validations: DateValidations = new DateValidations();
    private readonly holidays: string[];
    private readonly borderDate: Moment;

    constructor({
        date,
        timeZone = TimeZonesEnum.BOGOTA,
        holidays,
    }: DateBusinessLogicInput) {
        this.currentDate = moment(date).tz(timeZone);
        this.borderDate = moment(holidays[holidays.length - 1]).tz(timeZone);
        this.holidays = holidays;
        this.setCurrent();
        this.setFullTimeInSeconds();
    }

    /**
     * convert current time in seconds
     * @returns DateBusinessLogic
     */
    private setFullTimeInSeconds(): DateBusinessLogic {
        const timeFormatted = this.utils.format(this.currentDate, "HH:mm:ss");
        this.fullTimeInSeconds = this.utils.timeToSeconds(timeFormatted);
        return this;
    }

    /**
     * initialize date params
     * @returns DateBusinessLogic
     */
    private setCurrent(): DateBusinessLogic {
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
        let setValueParams: SetToDateParams | null = null;

        this.utils.addToDate(this.currentDate, daysToSkips, "days");

        if (this.firstLoop) {
            setValueParams = { hour: 17, minute: 0, second: 0 };
        } else if (this.totalDaysToProcess <= 0) {
            setValueParams = { hour: 8, minute: 0, second: 0 };
        } else if (
            !this.validations.isHoliday(this.currentDate, this.holidays)
        ) {
            this.totalDaysToProcess--;
        }

        !!setValueParams &&
            this.utils.setToDate(this.currentDate, setValueParams);
        this.firstLoop = false;
    }

    private skipLunchHour(): void {
        this.utils.setToDate(this.currentDate, { minute: 0, second: 0 });
        this.firstLoop = false;
    }

    private skipToNextDay(): void {
        const { setToDate, addToDate, BUSINESS_HOURS } = this.utils;

        // Reset hour to 17 if it's the checkout hour and it's the first loop
        const resetHour =
            this.firstLoop &&
            this.validations.isLeavingHour(this.fullTimeInSeconds)
                ? 17
                : 8;

        setToDate(this.currentDate, { hour: resetHour });
        if (this.firstLoop) {
            setToDate(this.currentDate, { minute: 0, second: 0 });
        }
        if (
            this.fullTimeInSeconds == BUSINESS_HOURS.checkout &&
            this.firstLoop
        ) {
            addToDate(this.currentDate, 1, "days");
        }
        this.firstLoop = false;
    }

    private skipHoliday() {
        const daysToJump = this.firstLoop ? -1 : 1;
        this.utils.addToDate(this.currentDate, daysToJump, "days");

        this.firstLoop &&
            this.utils.setToDate(this.currentDate, {
                hour: 17,
                minute: 0,
                second: 0,
            });

        if (
            this.firstLoop &&
            !this.validations.isHoliday(this.currentDate, this.holidays)
        ) {
            this.firstLoop = false;
        } else if (
            this.totalDaysToProcess > 0 &&
            !this.firstLoop &&
            !this.validations.isWeekendDay(this.currentDayOfWeek + 1) &&
            !this.validations.isHoliday(this.currentDate, this.holidays)
        ) {
            this.totalDaysToProcess--;
        }
    }

    private processDay(): void {
        let daysToAdd = 1;

        // checks if next day is a weekend day
        if (this.validations.isWeekendDay(this.currentDayOfWeek + 1)) {
            // Calculates next working days
            daysToAdd = 8 - this.currentDayOfWeek;
        }

        this.utils.addToDate(this.currentDate, daysToAdd, "days");

        // keeps days counter when not a holy day
        if (!this.validations.isHoliday(this.currentDate, this.holidays)) {
            this.totalDaysToProcess--;
        }

        this.firstLoop = false;
    }

    private processHour() {
        this.utils.addToDate(this.currentDate, 1, "hours");
        if (this.currentHours != 12) {
            this.totalHoursToProcess--;
        } // Skip to next hour if not lunch hour,

        // Skips to next day at 08:00 AM
        if (this.currentHours == 17) {
            this.utils.setToDate(this.currentDate, { hour: 8 });
            this.utils.addToDate(this.currentDate, 1, "days");
            this.totalHoursToProcess++;
        }
    }

    /**
     * Calculates the date based on the input parameters
     * @param { hours, days }
     * @returns
     */
    public calculate({ hours, days }: IDateCalc) {
        this.totalDaysToProcess = days || 0;
        this.totalHoursToProcess = hours || 0;

        if (this.totalHoursToProcess <= 0 && this.totalDaysToProcess <= 0) {
            return this.utils.format(this.utils.getUTC(this.currentDate));
        }

        while (this.totalHoursToProcess > 0 || this.totalDaysToProcess > 0) {
            this.setCurrent();
            this.setFullTimeInSeconds();

            if (
                this.validations.isSameOrAfter(
                    this.currentDate,
                    this.borderDate
                )
            ) {
                throw new CustomError(
                    ErrorMessages.en.error_border_date,
                    StatusCodes.BAD_REQUEST
                );
            }

            if (this.validations.isHoliday(this.currentDate, this.holidays)) {
                this.skipHoliday();
                continue;
            }

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

            if (this.validations.isLeavingHour(this.fullTimeInSeconds)) {
                this.skipToNextDay(); // Skips back and forward leaving hours
                continue;
            }

            if (this.totalDaysToProcess > 0) {
                this.processDay();
                continue;
            }

            if (this.totalHoursToProcess > 0) {
                this.processHour();
            }

            this.firstLoop = false;
        }

        // Convert result to UTC format
        return this.utils.format(this.utils.getUTC(this.currentDate));
    }
}
