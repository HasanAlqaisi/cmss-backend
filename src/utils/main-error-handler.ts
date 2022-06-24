// import { ForbiddenError } from "@casl/ability";
import { ForbiddenError as CaslError } from "@casl/ability";
import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import multer from "multer";
import {
  ApiError,
  BadRequestError,
  ForbiddenError,
  InternalError,
} from "./api/api-error";
import logger from "./config/logger";

export const types = {
  SIMPLE: "SIMPLE",
  ZOD_FLATTENED: "ZOD_FLATTENED",
  DB_OPERATION: "DB_OPERATION",
  UNHANDLED_ERROR: "UNHANDLED_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  CASL: "CASL",
  MULTER: "MULTER",
};

export default (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error(JSON.stringify(err));

  if (err instanceof ApiError)
    return ApiError.handle(err, req, res, types.SIMPLE);

  if (err instanceof CaslError) {
    return ApiError.handle(
      new ForbiddenError(err.message),
      req,
      res,
      types.CASL
    );
  }

  if (err instanceof multer.MulterError) {
    return ApiError.handle(new BadRequestError(err), req, res, types.MULTER);
  }

  // Checking for unique constraints
  if (err.code === "P2002")
    return ApiError.handle(
      new BadRequestError(`${err.meta.target[0]} is already exists`),
      req,
      res,
      types.DB_OPERATION
    );

  if (err.code === "P2003")
    return ApiError.handle(
      new BadRequestError(`one of provided ids does not exist`),
      req,
      res,
      types.DB_OPERATION
    );

  if (err.code === "P2025") {
    return ApiError.handle(
      new BadRequestError(err.meta.cause),
      req,
      res,
      types.DB_OPERATION
    );
  }

  if (err instanceof ZodError) {
    return ApiError.handle(
      new BadRequestError(err.flatten()),
      req,
      res,
      types.ZOD_FLATTENED
    );
  }

  return ApiError.handle(
    new InternalError(err.message),
    req,
    res,
    types.UNHANDLED_ERROR
  );
};
