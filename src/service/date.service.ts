import { getHolidays } from '../external/holidays.api.ts';

export class DateService {
  public _days: number;
  public _hours: number;
  public _date: Date;
  public _tz: string = 'UTC';

  constructor(props?: { days?: number; hours?: number; date?: Date }) {
    this._days = props?.days || 0;
    this._hours = props?.hours || 0;
    this._date = props?.date || new Date();
  }

  private daysToWorkingHours(days: number): number {
    return days * 9;
  }

  public addDays(days: number) {
    const _days = this._date.getDate();
    this._date.setDate(_days + days);

    return this._date;
  }
}

/**
 * TODO: Add reset working hours (08:00 AM)
 * TODO: Validate weekends and holydays
 * TODO: Validate working hours (08:00 - 12:00 || 13:00 - 17:00)
 * TODO: Convert input hour to UTC for server time management
 */
