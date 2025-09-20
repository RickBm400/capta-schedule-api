import { z, ZodObject } from "zod";

export const DateParamsInputDto: ZodObject = z.object({
    date: z.optional(z.iso.datetime({ offset: true, local: true })),
    days: z.optional(z.coerce.number().int().positive()),
    hours: z.optional(z.coerce.number().int().positive()),
    timeZone: z.optional(z.string()),
});
