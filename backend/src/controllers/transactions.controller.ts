import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TransactionsService } from "../services/transactions.servic";
import { CreateTransactionDTO, indexTransactionsDTO } from "../dtos/transactions.dto";


export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { }

    create = async (req: Request<unknown, unknown, CreateTransactionDTO>, res: Response, next: NextFunction) => {
        try {
            const { title, amount, categoryId, type, date } = req.body

            const result = await this.transactionsService.create({ title, amount, categoryId, type, date })

            return res.status(StatusCodes.CREATED).json(result)
        } catch (err) {
            next(err)
        }
    }


    index = async (req: Request<unknown, unknown, unknown, indexTransactionsDTO>, res: Response, next: NextFunction) => {
        try {
            const { title, endDate, beginDate, categoryId } = req.query;
            const result = await this.transactionsService.index({ title, endDate, beginDate, categoryId })

            return res.status(StatusCodes.OK).json(result)
        } catch (err) {
            next(err)
        }
    }

}