import { app } from "../configs/server";
import { DateBusinessLogic } from "../services/dates/index";
import request from "supertest";
import { ErrorMessages } from "../utils/error-messages";
import { getHolidays } from "../external/holidays.api";

describe("date-business-logic", () => {
    it("Should return the correct result in utc", () => {
        const inputDate = "2025-09-12T17:00:00-05:00"; // Friday
        const days = 0;
        const hours = 1;
        const holidays: any[] = [];

        const logic = new DateBusinessLogic({
            date: inputDate,
            holidays,
        });

        const result = logic.calculate({ days, hours });

        expect(result).toBe("2025-09-15T14:00:00Z");
    });
});

describe("date-controller", () => {
    test("Should response to get request", async () => {
        await request(app)
            .get("/v1?hours=1&days=1")
            .then((response) => {
                expect(response.status).toBe(200);
                expect(JSON.parse(response.text).date);
            });
    });

    test("Should throw error on bad request", async () => {
        await request(app)
            .get("/v1?date=2025-04-10T15:00:00.000Z")
            .then((response) => {
                expect(JSON.parse(response.text).message).toBe(
                    ErrorMessages.en.error_date_params
                );
            });
    });
});

describe("holidays-api", () => {
    test("Should return status ok on request", async () => {
        const response = await getHolidays();

        expect(response?.data).toBeInstanceOf(Array<String>);
        expect(response?.data).toHaveLength;
    });
});
