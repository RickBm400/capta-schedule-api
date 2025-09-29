// src/middleware/validationMiddleware.ts
import { type Request, type Response, type NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { CustomError } from "../utils/exceptions";
import { ErrorMessages } from "../utils/error-messages";

/**
 * Zod middleware for query validations
 *
 * @export
 * @param {z.ZodObject<any, any>} schema
 * @returns {(req: Request, res: Response, next: NextFunction) => void}
 */
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
                    error: getReasonPhrase(StatusCodes.BAD_REQUEST),
                    details: errorMessages[0]?.message,
                });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
                });
            }
        }
    };
}

/**
 * Exception middleware for handling errors in the application
 *
 * @export
 * @param {(Error | CustomError)} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function ExceptionMiddleware(
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err.message || ErrorMessages.en.wrong_exception;

    res.status(statusCode).json({
        message,
        error: getReasonPhrase(statusCode),
    });
}
