// src/middleware/validationMiddleware.ts
import { type Request, type Response, type NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { CustomError } from "../utils/exceptions.ts";

export function validateQuery(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.query);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.issues.map((issue: any) => ({
                    message: `${issue.path.join(".")} is ${issue.message}`,
                }));
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: "Invalid data",
                    details: errorMessages,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: "Internal Server Error",
                });
            }
        }
    };
}

export function ExceptionMiddleware(
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || "Something went wrong!";

    res.status(statusCode).json({
        message,
        error: getReasonPhrase(statusCode),
    });
}
