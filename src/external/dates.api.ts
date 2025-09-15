import axios, { type AxiosInstance } from 'axios';
import env from '../configs/environment.ts';

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
export async function getHolidays(): Promise<any> {
  try {
    const _response = await httpClient.get(env.API_CAPTA_HOLYDATES);
    return _response.data;
  } catch (error: any) {
    return error;
  }
}

// TODO: implement caching and error handling
