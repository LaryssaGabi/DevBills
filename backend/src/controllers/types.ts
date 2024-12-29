import { Request } from "express";

export type BodyRequest<T, Params = {}> = Request<Params, unknown, T>;
export type QueryRequest<T> = Request<unknown, unknown, unknown, T>;
