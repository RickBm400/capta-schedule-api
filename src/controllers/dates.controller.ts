import { type Request, type Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { Router, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { validateQuery } from "../middlewares/validation.middleware.ts";
import { DateParamsInputDto } from "../types/validations/date-params.dto.ts";
import { calculateDateSkips } from "../services/dates.service.ts";
import type { DateServiceInput } from "../types/dates.interfaces.ts";

const asyncHandler = expressAsyncHandler;
const router: Router = Router();

interface queryInterface {
    date: number;
    hours: number;
    days: number;
}

router.get(
    "/",
    validateQuery(DateParamsInputDto),
    asyncHandler(async (req: Request, res: Response) => {
        const query = DateParamsInputDto.safeParse(req.query).data;

        const calculated = calculateDateSkips(
            query as unknown as DateServiceInput
        );
        res.status(StatusCodes.OK).json({
            date: calculated,
        });
    })
);

export default router;
