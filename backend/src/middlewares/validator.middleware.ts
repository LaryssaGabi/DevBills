import { NextFunction, Request, Response } from "express";
import { z, ZodRawShape } from "zod"
import { AppError } from "../errors/app.error";
import { StatusCodes } from "http-status-codes";

export enum ParamsType {
    QUERY = 'query',
    BODY = 'body',
    PARAMS = 'params',
}

type ValidateParams = {
    schema: ZodRawShape;
    type: ParamsType;
}

export function validator(params: ValidateParams) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = z.object(params.schema).safeParse(req[params.type])
        
        if (!result.success) {
            const erroFormatted = result.error.issues.map(item => `${item.path.join('.')} : ${item.message}`)

            throw new AppError(erroFormatted, StatusCodes.UNPROCESSABLE_ENTITY)
        }

        req[params.type] = result.data;

        next()
    }
}