import axios, { type AxiosInstance } from "axios";
import env from "../configs/environment";
import { CustomError } from "../utils/exceptions";
import { StatusCodes } from "http-status-codes";

/**
 * Axios base instance for http requests
 *
 * @type {AxiosInstance}
 */
const httpClient: AxiosInstance = axios.create({
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
    },
});

/**
 * Get holiday dates from external capta api
 *
 * @export
 * @async
 * @returns {Promise<any>}
 */
export async function getHolidays(): Promise<{ data: string[] }> {
    const _response: string[] = (await httpClient.get(env.API_CAPTA_HOLYDATES))
        .data;
    if (!_response)
        throw new CustomError("", StatusCodes.INTERNAL_SERVER_ERROR);

    return { data: [..._response] };
}
