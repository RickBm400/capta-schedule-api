import { DateService } from '../service/date.service.ts';
import type { DateFormatParams } from '../types/controller.ts';

export const getDateFormat = async (req: Request, res: Response) => {
  try {
    const dateService = new DateService();

    return dateService;
  } catch (error) {}
};
