import { type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Router, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { validateQuery } from "../middlewares/index";
import { DateParamsInputDto } from "../types/validations/date-params.dto";
import { calculateDateSkips } from "../services/dates.service";
import type { DateServiceInput } from "../types/dates.interfaces";
import { CustomError } from "../utils/exceptions";
import { ErrorMessages } from "../utils/error-messages";

const asyncHandler = expressAsyncHandler;
const router: Router = Router();

router.get(
    "/",
    validateQuery(DateParamsInputDto),
    asyncHandler(async (req: Request, res: Response) => {
        const query = DateParamsInputDto.safeParse(req.query)
            .data as unknown as DateServiceInput;

        if (!query.hours && !query.days) {
            throw new CustomError(
                ErrorMessages.en.error_date_params,
                StatusCodes.BAD_REQUEST
            );
        }

        res.status(StatusCodes.OK).json({
            date: await calculateDateSkips(query),
        });
    })
);

export default router;
