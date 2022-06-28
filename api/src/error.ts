import { ErrorRequestHandler } from "express";

export const handleServerError: ErrorRequestHandler = (error, _req, res, _next) => {
    res.status(500).json(error);
}