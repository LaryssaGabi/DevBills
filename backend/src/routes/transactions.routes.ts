import { Router } from "express";
import { ParamsType, validator } from "../middlewares/validator.middleware";
import { createTransactionsSchema, indexTransactionsSchema, getDashboardSchema, getFinancialEvolutionSchema, deleteTransactionSchema, updateTransactionsSchema } from "../dtos/transactions.dto";
import { TransactionsController } from "../controllers/transactions.controller";
import { TransactionsFactory } from "../factories/transactions.factory";

export const transactionsRoutes = Router();

const controller = new TransactionsController(TransactionsFactory.getServiceInstance());

transactionsRoutes.post('/',
    validator({
        schema: createTransactionsSchema,
        type: ParamsType.BODY,
    }),
    controller.create
);

transactionsRoutes.get('/',
    validator({
        schema: indexTransactionsSchema,
        type: ParamsType.QUERY,
    }),
    controller.index
);

transactionsRoutes.get('/dashboard',
    validator({
        schema: getDashboardSchema,
        type: ParamsType.QUERY,
    }),
    controller.getDashboard
);

transactionsRoutes.get('/financial-evolution',
    validator({
        schema: getFinancialEvolutionSchema,
        type: ParamsType.QUERY,
    }),
    controller.getFinancialEvolution
);

transactionsRoutes.delete('/:id',
    validator({
        schema: deleteTransactionSchema,
        type: ParamsType.PARAMS,
    }),
    controller.delete
);

transactionsRoutes.put('/:id',
    validator({
        schema: updateTransactionsSchema,
        type: ParamsType.BODY,
    }),
    controller.update
);
