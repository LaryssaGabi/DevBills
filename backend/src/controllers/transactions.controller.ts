import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { TransactionsService } from "../services/transactions.servic";
import { CreateTransactionDTO, GetDashboardDTO, GetFinancialEvolutionDTO, IndexTransactionsDTO, UpdateTransactionDTO } from "../dtos/transactions.dto";
import { BodyRequest, QueryRequest } from "./types";

interface ParamsId {
    id: string; 
}


export class TransactionsController {
    private transactionsService: TransactionsService;

    constructor(transactionsService: TransactionsService) {
        this.transactionsService = transactionsService;
    }


    create = async (req: BodyRequest<CreateTransactionDTO>, res: Response, next: NextFunction) => {
        try {
            const { title, amount, categoryId, type, date } = req.body

            const result = await this.transactionsService.create({ title, amount, categoryId, type, date })

            return res.status(StatusCodes.CREATED).json(result)
        } catch (err) {
            next(err)
        }
    }


    index = async (req: QueryRequest<IndexTransactionsDTO>, res: Response, next: NextFunction) => {
        try {
            const { title, endDate, beginDate, categoryId } = req.query;
            const result = await this.transactionsService.index({ title, endDate, beginDate, categoryId })

            return res.status(StatusCodes.OK).json(result)
        } catch (err) {
            next(err)
        }
    }


    getDashboard = async (req: QueryRequest< GetDashboardDTO>, res: Response, next: NextFunction) => {
        try {
            const { endDate, beginDate } = req.query;
            const result = await this.transactionsService.getDashboard({ endDate, beginDate })

            return res.status(StatusCodes.OK).json(result)
        } catch (err) {
            next(err)
        }
    }


    getFinancialEvolution = async (req: QueryRequest< GetFinancialEvolutionDTO>, res: Response, next: NextFunction) => {
        try {
            const { year } = req.query;
            const result = await this.transactionsService.getFinancialEvolution({ year })

            return res.status(StatusCodes.OK).json(result)
        } catch (err) {
            next(err)
        }
    }

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params; 
            const deleted = await this.transactionsService.delete(id);
    
            if (!deleted) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "Transação não encontrada" });
            }
    
            return res.status(StatusCodes.OK).json({ message: "Transação deletada com sucesso" });
        } catch (err) {
            next(err);
        }
    };
   
    update = async (req: BodyRequest<UpdateTransactionDTO, ParamsId>, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { title, amount, categoryId, type, date } = req.body;
    
            const result = await this.transactionsService.update(id, { title, amount, categoryId, type, date });
    
            if (!result) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: "Transação não encontrada" });
            }
    
            return res.status(StatusCodes.OK).json(result);
        } catch (err) {
            next(err);
        }
    };
    
    
    
}