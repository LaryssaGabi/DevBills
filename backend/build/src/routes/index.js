"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const base_routes_1 = require("./base.routes");
const categories_routes_1 = require("./categories.routes");
const transactions_routes_1 = require("./transactions.routes");
exports.routes = (0, express_1.Router)();
exports.routes.use('/', base_routes_1.baseRoutes);
exports.routes.use('/categories', categories_routes_1.categoriesRoutes);
exports.routes.use('/transactions', transactions_routes_1.transactionsRoutes);
