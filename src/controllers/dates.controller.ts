import { type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Router, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { validateQuery } from "../middlewares/index.ts";
import { DateParamsInputDto } from "../types/validations/date-params.dto.ts";
import { calculateDateSkips } from "../services/dates.service.ts";
import type { DateServiceInput } from "../types/dates.interfaces.ts";
import { CustomError } from "../utils/exceptions.ts";
import { ErrorLogs } from "../utils/error-logs.ts";

const asyncHandler = expressAsyncHandler;
const router: Router = Router();

router.get(
    "/",
    validateQuery(DateParamsInputDto),
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = DateParamsInputDto.safeParse(req.query)
                .data as unknown as DateServiceInput;

            if (!query.hours && !query.days) {
                throw new CustomError(
                    ErrorLogs.en.error_date_params,
                    StatusCodes.BAD_REQUEST
                );
            }

            const calculated = await calculateDateSkips(query);
            res.status(StatusCodes.OK).json({
                date: calculated,
            });
        } catch (error) {
            next(error);
        }
    })
);

export default router;
