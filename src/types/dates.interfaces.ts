export interface setToDateParams {
    hour?: number;
    minute?: number;
    second?: number;
}

export enum dateUnits {
    hours = "hours",
    days = "days",
    minutes = "minutes",
}

export interface WorkingHoursInSeconds {
    startLunch: number;
    endLunch: number;
    checkout: number;
    checkin: number;
    mdNight: number;
}

export interface DateServiceInput {
    hours?: number;
    days?: number;
}

export abstract class DatesCalculationImpl<T> {
    public readonly WEEKEND_DAYS: number[] = [6, 7];

    abstract timeToSeconds(time: string): number;
    abstract setToDate(date: T, params: setToDateParams): T;
    abstract addToDate(date: T, amount: number, unit: dateUnits): T;
    abstract format(date: T, format: string): string;

    abstract BUSINESS_HOURS: WorkingHoursInSeconds;
}
