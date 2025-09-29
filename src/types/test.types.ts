export interface ISpecialDateTest {
    calcInput: { hours?: number; days?: number };
    date: string;
    holidays: Array<string>;
    expected: string;
}
