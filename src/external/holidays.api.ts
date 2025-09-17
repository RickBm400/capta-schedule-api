import axios, { type AxiosInstance } from 'axios';
import env from '../configs/environment.ts';

/**
 * Axios base instance for http requests
 *
 * @type {AxiosInstance}
 */
const httpClient: AxiosInstance = axios.create({
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get holiday dates from external capa api
 *
 * @export
 * @async
 * @returns {Promise<any>}
 */
export async function getHolidays(): Promise<{ data: string }> {
  try {
    const _response = await httpClient.get(env.API_CAPTA_HOLYDATES);
    if (!_response) throw new Error('Error: Invalid api call');

    return { data: _response.data };
  } catch (error: any) {
    return error;
  }
}

// TODO: implement caching and error handling
