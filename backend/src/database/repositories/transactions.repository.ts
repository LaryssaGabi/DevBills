import { CreateTransactionDTO, GetDashboardDTO, GetFinancialEvolutionDTO, IndexTransactionsDTO } from "../../dtos/transactions.dto";
import { Balance } from "../../entities/balance.entity";
import { Expense } from "../../entities/expense.entity";
import { Transaction, TransactionType } from "../../entities/transactions.entity";
import { TrasactionsModel } from "../schemas/transactions.schema";
import { AppError } from "../../errors/app.error";
import { StatusCodes } from "http-status-codes";
import { Model } from "mongoose";

export class TransactionsRepository {
    constructor(private model: typeof TrasactionsModel) {}
    
    async create({ title, date, amount, type, category }: Transaction): Promise<Transaction> {
        const createdTrasactions = await this.model.create({ title, date, amount, type, category });

        return createdTrasactions.toObject<Transaction>();
    }

    async index({ beginDate, categoryId, endDate, title }: IndexTransactionsDTO): Promise<Transaction[]> {
        const whereParams: Record<string, unknown> = {
            ...(title && { title: { $regex: title, $options: "i" } }),
            ...(categoryId && { "category._id": categoryId }),
        };

        if (beginDate || endDate) {
            whereParams.date = {
                ...(beginDate && { $gte: beginDate }),
                ...(endDate && { $lte: endDate }),
            };
        }

        const transactions = await this.model.find(whereParams, undefined, {
            sort: {
                date: -1,
            },
        });

        const transactionsMap = transactions.map((item) => item.toObject<Transaction>());

        return transactionsMap;
    }

    async getBalance({ beginDate, endDate }: GetDashboardDTO): Promise<Balance> {
        const aggregate = this.model.aggregate<Balance>();

        if (beginDate || endDate) {
            aggregate.match({
                date: {
                    ...(beginDate && { $gte: beginDate }),
                    ...(endDate && { $lte: endDate }),
                },
            });
        }

        const [result] = await aggregate
            .project({
                _id: 0,
                income: {
                    $cond: [
                        {
                            $eq: ["$type", "income"],
                        },
                        "$amount",
                        0,
                    ],
                },
                expense: {
                    $cond: [
                        {
                            $eq: ["$type", "expense"],
                        },
                        "$amount",
                        0,
                    ],
                },
            })
            .group({
                _id: null,
                income: {
                    $sum: "$income",
                },
                expense: {
                    $sum: "$expense",
                },
            })
            .addFields({
                balance: {
                    $subtract: ["$income", "$expense"],
                },
            });

        return result;
    }
    
    async getExpenses({ beginDate, endDate }: GetDashboardDTO): Promise<Expense[]> {
        const aggregate = this.model.aggregate<Expense>();

        const matchParams: Record<string, unknown> = {
            type: TransactionType.EXPENSE,
        };

        if (beginDate || endDate) {
            matchParams.date = {
                ...(beginDate && { $gte: beginDate }),
                ...(endDate && { $lte: endDate }),
            };
        }

        const result = await aggregate.match(matchParams).group({
            _id: "$category._id",
            title: {
                $first: "$category.title",
            },
            color: {
                $first: "$category.color",
            },
            amount: {
                $sum: "$amount",
            },
        });

        return result;
    }

    async getFinancialEvolution({ year }: GetFinancialEvolutionDTO): Promise<Balance[]> {
        const aggregate = this.model.aggregate<Balance>();

        const result = await aggregate
            .match({
                date: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            })
            .project({
                _id: 0,
                income: {
                    $cond: [
                        {
                            $eq: ["$type", "income"],
                        },
                        "$amount",
                        0,
                    ],
                },
                expense: {
                    $cond: [
                        {
                            $eq: ["$type", "expense"],
                        },
                        "$amount",
                        0,
                    ],
                },
                year: {
                    $year: "$date",
                },
                month: {
                    $month: "$date",
                },
            })
            .group({
                _id: ["$year", "$month"],
                income: {
                    $sum: "$income",
                },
                expense: {
                    $sum: "$expense",
                },
            })
            .addFields({
                balance: {
                    $subtract: ["$income", "$expense"],
                },
            })
            .sort({
                _id: 1,
            });

        return result;
    }


    async delete(id: string): Promise<Transaction | null> {
        const transaction = await this.model.findByIdAndDelete(id);
    
        if (!transaction) {
            throw new AppError("Transaction not found.", StatusCodes.NOT_FOUND);
        }
    
        return transaction.toObject<Transaction>(); 
    }
    
}
