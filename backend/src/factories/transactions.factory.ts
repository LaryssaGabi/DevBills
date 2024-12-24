import { CategoriesRepository } from "../database/repositories/categories.repository";
import { TransactionsRepository } from "../database/repositories/transactions.repository";
import { CategoryModel } from "../database/schemas/category.schema";
import { TrasactionsModel } from "../database/schemas/transactions.schema";
import { TransactionsService } from "../services/transactions.servic";

export class TransactionsFactory {
    private static transactionsService: TransactionsService;

    static getServiceInstance() {
        if (this.transactionsService) {
            return this.transactionsService;
        }

        const repository = new TransactionsRepository(TrasactionsModel);
        const categoriesRepository = new CategoriesRepository(CategoryModel)
        const service = new TransactionsService(repository, categoriesRepository);

        this.transactionsService = service;
        
        return service
    }
}